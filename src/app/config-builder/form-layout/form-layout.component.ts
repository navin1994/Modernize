import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  QueryList,
  signal,
  SimpleChanges,
  ViewChildren
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from "../field-selector/field-selector.component";
import {
  ActionButton,
  ElementLayoutData,
  FIELD_TYPES,
  FormConfig,
  ReferenceAttribute,
} from "src/app/models/ui-form-config.interface";
import {
  ARRAY,
  ARRAY_OF_OBJECTS,
  BOOLEAN,
  DATE,
  DEFAULT_DATE_FORMAT,
  EDITABLE_LOGIC,
  NULL,
  NUMBER,
  OBJECT,
  UNDEFINED,
  UNSAVED,
  VISIBILITY,
} from "src/app/models/constants";
import {
  areObjectsSame,
  isArray,
  isArrayOfObjects,
  isBoolean,
  isNumeric,
  isObject,
} from "src/app/utility/utility";
import { CommonModule } from "@angular/common";
import { TextElementComponent } from "./form-elements/text-element/text-element.component";
import { ActionButtonComponent } from "./form-elements/action-buttons/action-buttons.component";
import { ToastrService } from "ngx-toastr";
import { ConfigBuilderService } from "../config-builder.service";
import { ReplaySubject, takeUntil } from "rxjs";
import { isDate } from "moment";
import * as moment from "moment";
import { FormArrayComponent } from "./form-elements/form-array/form-array.component";

@Component({
  selector: "app-form-layout",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    FieldSelectorComponent,
    TextElementComponent,
    ActionButtonComponent,
    forwardRef(() => FormArrayComponent),
],
  templateUrl: "./form-layout.component.html",
  styleUrl: "./form-layout.component.scss",
})
export class FormLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren(forwardRef(() => FormLayoutComponent)) childForms!: QueryList<FormLayoutComponent>;
  private destroyed$ = new ReplaySubject(1);
  @Input({ required: true }) formGroup: UntypedFormGroup;
  @Input({ required: true }) config!: FormConfig;
  @Input({ required: true }) status = UNSAVED;
  isChildForm = input<boolean>(false);
  submittedFormData = output<Record<string, any>>();
  private toaster = inject(ToastrService);
  private configBuilderService = inject(ConfigBuilderService);

  // Signals for visibility layers and previous form value
  visibleLayers = signal<ElementLayoutData[][]>([]);
  previousValues = signal({});
  visibleActionButton = signal<ActionButton[]>([]);
  isFormSubmitted = signal<boolean>(false);
  fieldTypes = FIELD_TYPES;

  ngOnInit(): void {
    this.visibleLayers.set(this.config.ui.elementsLayout);
    this.isFormSubmitted.set(!this.config.ui.references.showErrorAfterSubmit);
    this.updateAccessControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["config"] && changes["config"]?.currentValue) {
      this.configBuilderService.setCustomValidations(
        this.formGroup,
        changes["config"]?.currentValue,
        this.status
      );
      // update value and validity of dependent fields if value of field on which other fields validation is dependent
      Object.entries(this.config.ui.references.validationRelations)?.forEach(
        ([key, values]: [string, string[]]) => {
          values.forEach((control) => {
            this.formGroup
              .get(key)
              ?.valueChanges.pipe(takeUntil(this.destroyed$))
              .subscribe((_) =>
                this.formGroup.get(control)?.updateValueAndValidity()
              );
          });
        }
      );
    }
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
      const { result: isNotVisible } =
        this.configBuilderService.computeAccessControl(
          VISIBILITY,
          attributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      const { result: isNotEditable } =
        this.configBuilderService.computeAccessControl(
          EDITABLE_LOGIC,
          attributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      if (isNotVisible)
        layers = this.configBuilderService.removeAttributeAndCleanup(
          layers,
          id,
          this.formGroup
        );
      if (!isNotEditable) this.formGroup.get(id)?.enable();
    }
    for (const id in textAttributes) {
      const { result: isTextNotVisible } =
        this.configBuilderService.computeAccessControl(
          VISIBILITY,
          textAttributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      if (isTextNotVisible)
        layers = this.configBuilderService.removeAttributeAndCleanup(
          layers,
          id,
          this.formGroup
        );
    }
    if (actionBtns?.length) {
      this.visibleActionButton.update(() =>
        actionBtns?.filter((btn: ActionButton, index: number) => {
          const { result } = this.configBuilderService.computeAccessControl(
            VISIBILITY,
            actionBtns,
            index,
            this.config,
            this.formGroup,
            this.status
          );
          return !result;
        })
      );
    }

    this.visibleLayers.update(() => [...layers]);
  }

  isLayerVisible(layer: ElementLayoutData[]): boolean {
    return !!layer.find((element) =>
      this.visibleLayers()?.flat()?.includes(element)
    );
  }

  async submit({
    nextStatus,
    runValidation,
    api,
  }: {
    nextStatus: string | undefined;
    runValidation: boolean | undefined;
    api: string | undefined;
  }) {
    const visibleControls = this.visibleLayers().flat(Infinity);
    if (!this.isFormSubmitted()) this.isFormSubmitted.set(true);
    if (runValidation) {
      const isNotValid = visibleControls.some((item: any) => {
        if (
          item?._refAttributes &&
          this.formGroup.get(item._refAttributes)?.invalid
        )
          return true;
        return false;
      });
      if (isNotValid) {
        this.toaster.error("Invalid form details");
        return;
      }
    }
        // 1. Recursively collect data from all child FORM_GROUPs
    const childData: Record<string, any> = {};
    if (this.childForms && this.childForms.length) {
      for (const child of this.childForms.toArray()) {
        // Avoid self-recursion
        if (child !== this) {
          const data = await child.submit({ nextStatus, runValidation, api });
          if (data && data.formData && child.config?.disclosure_type) {
            childData[child.config.disclosure_type] = data.formData;
          }
        }
      }
    }

    // 2. Parse this form's data
    const parsedFormValues = this.parseFormValues();

    // 3. Merge child data into this form's data
    Object.assign(parsedFormValues, childData);

    // 4. Emit data (or return for parent)
    const result = { formData: parsedFormValues, nextStatus, api };
    if (!this.isChildForm()) {
      this.submittedFormData.emit(result);
    }
    return result;
  }

  parseFormValues() {
    const formValues = this.formGroup.getRawValue() as Record<string, any>;
    return Object.entries(formValues).reduce(
      (acc, [attributeId, controlValue]) => {
        const attributeConfig =
          this.config.ui.references.attributes[attributeId];
        const { dateFormat, get, staticSelection } = (attributeConfig ??
          {}) as ReferenceAttribute;
        const { mapping } = get ?? {};
        const providedFormat = dateFormat ?? DEFAULT_DATE_FORMAT;
        const dataType = this.getTypeOfData(controlValue);
        switch (dataType) {
          case ARRAY_OF_OBJECTS:
            if (staticSelection) {
              acc[attributeId] = controlValue.map(
                (val: { [x: string]: any }) => val["value"]
              );
            } else if (mapping?.value) {
              acc[attributeId] = controlValue.map(
                (val: { [x: string]: any }) => val[mapping.value as string]
              );
            } else {
              acc[attributeId] = controlValue;
            }
            return acc;
          case OBJECT:
            if (staticSelection) {
              acc[attributeId] = controlValue["value"];
            } else if (mapping?.value) {
              acc[attributeId] = controlValue[mapping.value];
            } else {
              acc[attributeId] = controlValue;
            }
            return acc;
          case DATE:
            acc[attributeId] = moment(controlValue)
              .format(providedFormat);
            return acc;
          case ARRAY:
          case NUMBER:
          case UNDEFINED:
          case NULL:
          case BOOLEAN:
          default:
            acc[attributeId] = controlValue;
            return acc;
        }
      },
      {} as Record<string, any>
    );
  }

  getTypeOfData(data: any): string {
    let type = "string";
    if (isArrayOfObjects(data)) type = ARRAY_OF_OBJECTS;
    else if (isArray(data)) type = ARRAY;
    if (isObject(data)) type = OBJECT;
    if (isBoolean(data)) type = BOOLEAN;
    if (isDate(data)) type = DATE;
    if (isNumeric(data)) type = NUMBER;
    if (data === null) type = NULL;
    if (data === undefined) type = UNDEFINED;
    return type;
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
