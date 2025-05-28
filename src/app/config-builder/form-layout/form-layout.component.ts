import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  inject,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from "../field-selector/field-selector.component";
import {
  AccessControls,
  ActionButton,
  AttributeType,
  COMPARISON_TYPES,
  ConditionGroup,
  ElementLayoutData,
  FormConfig,
} from "src/app/models/ui-form-config.interface";
import { EDITABLE_LOGIC, UNSAVED, VISIBILITY } from "src/app/models/constants";
import {
  areObjectsSame,
  dateToNumber,
  isBoolean,
  isDate,
  isEmptyArray,
  isNumeric,
  isObject,
  toBoolean,
} from "src/app/utility/utility";
import { CommonModule } from "@angular/common";
import { TextElementComponent } from "./form-elements/text-element/text-element.component";
import { ActionButtonComponent } from "./form-elements/action-buttons/action-buttons.component";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-form-layout",
  standalone: true,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    FieldSelectorComponent,
    TextElementComponent,
    ActionButtonComponent,
  ],
  templateUrl: "./form-layout.component.html",
  styleUrl: "./form-layout.component.scss",
})
export class FormLayoutComponent implements OnInit, DoCheck {
  @Input({ required: true }) formGroup: UntypedFormGroup;
  @Input({ required: true }) config!: FormConfig;
  @Input() status = UNSAVED;
  private toaster = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  // Signals for visibility layers and previous form value
  visibleLayers = signal<ElementLayoutData[][]>([]);
  previousValues = signal({});
  visibleActionButton = signal<ActionButton[]>([]);
  isFormSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.visibleLayers.set(this.config.ui.elementsLayout);
    this.isFormSubmitted.set(!this.config.ui.references.showErrorAfterSubmit)
    this.updateAccessControl();
  }

  ngDoCheck(): void {
    // console.log("=========================START=================================")
    //   Object.entries(this.formGroup.controls).forEach(([key, value]) => {
    //     console.log('from layout=> ', key, ":", value.disabled)
    //   })
    // console.log("=========================END=================================")
  }

  updateAccessControl(): void {
    if (areObjectsSame(this.previousValues(), this.formGroup.getRawValue()))
      return;
    if (this.status !== UNSAVED) this.formGroup.disable();
    this.previousValues.set(this.formGroup.getRawValue());
    let layers = this.config.ui.elementsLayout;
    const { attributes } = this.config.ui.references;
    const { textAttributes } = this.config.ui.paragraphs;
    const actionBtns = this.config.ui?.actions?.buttons;

    for (const id in attributes) {
      const isNotVisible = this.computeAccessControl(
        VISIBILITY,
        attributes,
        id
      );
      const isEditable = !this.computeAccessControl(
        EDITABLE_LOGIC,
        attributes,
        id
      );
      if (isNotVisible) layers = this.removeAttributeAndCleanup(layers, id);
      if (isEditable) this.formGroup.get(id)?.enable();
    }
    for (const id in textAttributes) {
      const isTextNotVisible = this.computeAccessControl(
        VISIBILITY,
        textAttributes,
        id
      );
      if (isTextNotVisible) layers = this.removeAttributeAndCleanup(layers, id);
    }
    if (actionBtns?.length) {
      this.visibleActionButton.update(() =>
        actionBtns?.filter(
          (btn: ActionButton, index: number) =>
            !this.computeAccessControl(VISIBILITY, actionBtns, index)
        )
      );
    }

    this.visibleLayers.update(() => [...layers]);
  }

  removeAttributeAndCleanup(arr: ElementLayoutData[][], attribute: string) {
    const cleanedArray = arr.reduce((acc, innerArray) => {
      const filteredArray = innerArray.filter((item) => {
        if (item._refAttributes && item._refAttributes === attribute) {
          this.formGroup.get(attribute)?.setValue("");
          this.formGroup.get(attribute)?.setErrors(null);
          return false; // Filter out this item
        } else if (
          item._paragraphAttributes &&
          item._paragraphAttributes === attribute
        ) {
          return false; // Filter out this text paragraph
        }
        return true; // Keep the item
      });
      // Only add the inner array if it has elements left
      if (filteredArray.length > 0) {
        acc.push(filteredArray);
      }
      return acc;
    }, [] as ElementLayoutData[][]);
    return cleanedArray;
  }

  computeAccessControl(
    checkType: string,
    attributes: any,
    id: string | number
  ): boolean {
    // WIP: Date format comparison or make single date format applicable all over app
    const data = this.formGroup.getRawValue();
    const isExist = checkType in attributes[id];
    if (!isExist) {
      return this.checkTypeValue(checkType);
    }

    const {
      matchAllGroup,
      matchConditionsGroup,
      conditionGroups,
      statuses,
      userPermissions,
      userRole,
      allWaysEditable,
      readonly,
    } = attributes[id][checkType] as AccessControls;

    if (readonly) {
      this.formGroup.get(id as string)?.disable();
      return true;
    }
    if (allWaysEditable) return false;
    if (statuses && !statuses.includes(this.status)) return true;
    if (userPermissions && !userPermissions.includes("read")) return true;
    if (userRole && !userRole.includes("compliance")) return true;
    if (conditionGroups && !isEmptyArray(conditionGroups)) {
      const mainFunc = matchAllGroup ? "every" : "some";
      const groupFunc = matchConditionsGroup ? "every" : "some";
      return !conditionGroups[mainFunc]((groupArray) => {
        return (
          !!groupArray?.length &&
          groupArray[groupFunc]((group: ConditionGroup) => {
            if (
              group.attributeType === ("form-attribute" as AttributeType) &&
              (group?.sourceAttribute || group?.conditionalAttribute)
            ) {
              const currentValue = this.getDataByType(
                data[group.sourceAttribute as string],
                group.sourceAttribute
              );
              const originalValue = group.conditionValue || data[group.conditionalAttribute as string]
              const conditionValue = this.getDataByType(originalValue);
              switch (group.condition) {
                case COMPARISON_TYPES.EQUAL:
                  return currentValue == conditionValue;
                case COMPARISON_TYPES.NOT_EQUAL:
                  return currentValue != conditionValue;
                case COMPARISON_TYPES.REGULAR_EXPRESSION:
                  const regex = new RegExp(originalValue);
                  return regex.test(currentValue);
                case COMPARISON_TYPES.CONTAINS:
                  return currentValue?.includes(originalValue);
                case COMPARISON_TYPES.START_WITH:
                  return currentValue?.startsWith(originalValue, 1);
                case COMPARISON_TYPES.GREATER_THAN: {
                  const { currVal, condVal } = this.checkIfDateValueAndConvert(
                    currentValue,
                    conditionValue
                  );
                  return Number(currVal) > Number(condVal);
                }
                case COMPARISON_TYPES.GREATER_THAN_EQUAL_TO: {
                  const { currVal, condVal } = this.checkIfDateValueAndConvert(
                    currentValue,
                    conditionValue
                  );
                  return Number(currVal) >= Number(condVal);
                }
                case COMPARISON_TYPES.LESS_THAN: {
                  const { currVal, condVal } = this.checkIfDateValueAndConvert(
                    currentValue,
                    conditionValue
                  );
                  return Number(currVal) < Number(condVal);
                }
                case COMPARISON_TYPES.LESS_THAN: {
                  const { currVal, condVal } = this.checkIfDateValueAndConvert(
                    currentValue,
                    conditionValue
                  );
                  return Number(currVal) <= Number(condVal);
                }
              }
            } else if (
              group.attributeType === ("user-attribute" as AttributeType) &&
              group?.sourceAttribute
            ) {
              //WIP: Implementation pending
              this.checkTypeValue(checkType);
            } else {
              this.checkTypeValue(checkType);
            }
          })
        );
      });
    }
    return false;
  }

  checkIfDateValueAndConvert(
    currentValue: any,
    conditionValue: any
  ): { currVal: any; condVal: any } {
    currentValue = isDate(currentValue)
      ? dateToNumber(currentValue)
      : currentValue;
    conditionValue = isDate(conditionValue)
      ? dateToNumber(conditionValue)
      : conditionValue;
    return { currVal: currentValue, condVal: conditionValue };
  }

  checkTypeValue(checkType: string): boolean {
    if (checkType === VISIBILITY) {
      return false;
    } else if (checkType === EDITABLE_LOGIC) {
      return true;
    }
    return false;
  }

  getDataByType(data: any, sourceAttribute?: string): any {
    if (data == null || data == undefined || data == "") return "";
    if (isBoolean(data)) return toBoolean(data);
    if (isNumeric(data)) return data;
    if (isObject(data) && sourceAttribute) {
      const attributeConfig =
        this.config.ui.references.attributes[sourceAttribute];
      let valueKey = "value";
      if (attributeConfig?.get) {
        valueKey = attributeConfig.get.mapping.value;
      }
      return this.getDataByType(data[valueKey]);
    }
    return JSON.stringify(data)?.replace(/^"(.*)"$/, '$1');
  }

  isLayerVisible(layer: ElementLayoutData[]): boolean {
    return !!layer.find((element) =>
      this.visibleLayers()?.flat()?.includes(element)
    );
  }

  submit({
    nextStatus,
    runValidation,
    api,
  }: {
    nextStatus: string | undefined;
    runValidation: boolean | undefined;
    api: string | undefined;
  }) {
    if (!this.isFormSubmitted()) this.isFormSubmitted.set(true);
    if (runValidation && this.formGroup.invalid) {
      this.toaster.error('Invalid form details');
      return;
    }
  }

  validateForm(): boolean {
    return false;
  }
}
