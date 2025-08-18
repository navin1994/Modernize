import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from "../field-selector/field-selector.component";
import {
  ActionButton,
  ElementLayoutData,
  FIELD_TYPES,
  FormConfig,
  UiFormConfig,
} from "src/app/models/ui-form-config.interface";
import {
  ARRAY,
  ARRAY_OF_OBJECTS,
  BOOLEAN,
  DATE,
  DEFAULT_DATE_FORMAT,
  DUMMY_UI,
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
import { MatIcon } from "@angular/material/icon";
import { MatButton } from "@angular/material/button";

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
    MatButton,
    MatIcon,
    // forwardRef(() => FormArrayComponent),
],
  templateUrl: "./form-layout.component.html",
  styleUrl: "./form-layout.component.scss",
})
export class FormLayoutComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren(forwardRef(() => FormLayoutComponent)) childForms!: QueryList<FormLayoutComponent>;
  private destroyed$ = new ReplaySubject(1);
  @Input({ required: true }) mainForm: UntypedFormGroup | UntypedFormArray;
  @Input({ required: true }) config!: FormConfig;
  @Input({ required: true }) status = UNSAVED;
  isChildForm = input<boolean>(false);
  showAddButton = input<boolean>(false);
  showDeleteButton = input<boolean>(false);
  submittedFormData = output<Record<string, any>>();
  addOrDelete = output<boolean>();
  private toaster = inject(ToastrService);
  private configBuilderService = inject(ConfigBuilderService);
  fallbackUI: UiFormConfig = DUMMY_UI;

  // Signals for visibility layers and previous form value
  visibleLayers = signal<ElementLayoutData[][]>([]);
  previousValues = signal({});
  visibleActionButton = signal<ActionButton[]>([]);
  isFormSubmitted = signal<boolean>(false);
  isFormGroup = computed((): boolean => {
    return this.mainForm instanceof UntypedFormGroup;
  });
  isFormArray = computed((): boolean => {
    return this.mainForm instanceof UntypedFormArray;
  });
  formArrayControls = computed(() => (this.mainForm as UntypedFormArray).controls);
  fieldTypes = FIELD_TYPES;

  ngOnInit(): void {
    this.visibleLayers.set(this.config.ui.elementsLayout);
    this.isFormSubmitted.set(!this.config.ui.references.showErrorAfterSubmit);
    this.updateAccessControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["config"] && changes["config"]?.currentValue) {
      this.configBuilderService.setCustomValidations(
        this.mainForm,
        changes["config"]?.currentValue,
        this.status
      );

      // Setup validation relations for both FormGroup and FormArray
      const setupValidationRelations = (form: UntypedFormGroup | UntypedFormArray, config: FormConfig) => {
        if (form instanceof UntypedFormGroup) {
          Object.entries(config.ui.references.validationRelations)?.forEach(
            ([key, values]: [string, string[]]) => {
              values.forEach((control) => {
                form.get(key)?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((_) => {
                  form.get(control)?.updateValueAndValidity();
                });
              });
            }
          );
          // Recursively setup for nested FormArrays
          Object.values(form.controls).forEach(ctrl => {
            if (ctrl instanceof UntypedFormArray) {
              ctrl.controls.forEach(childCtrl => {
                setupValidationRelations(childCtrl as UntypedFormGroup | UntypedFormArray, config);
              });
            }
          });
        } else if (form instanceof UntypedFormArray) {
          form.controls.forEach(childCtrl => {
            setupValidationRelations(childCtrl as UntypedFormGroup | UntypedFormArray, config);
          });
        }
      };
      setupValidationRelations(this.mainForm, changes["config"].currentValue);
    }
  }

  addNewItemAt(index: number = 0, config?: FormConfig): void {
    let newControl;
    if(config) {
      newControl = this.configBuilderService.setUpConfigFormRoot(config);
    } else {
      newControl = new UntypedFormControl("");
    }
    (this.mainForm as UntypedFormArray).insert(index, newControl);
  }

  removeItem(index: number): void {
    (this.mainForm as UntypedFormArray).removeAt(index);
  }
  
  addOrRemoveElement(flag: boolean, index: number, config?: FormConfig): void {
    if (flag) {
      this.addNewItemAt(index + 1, config);
    } else {
      this.removeItem(index);
    }
  }

  updateAccessControl(): void {
    // Handles both FormGroup and FormArray
    const previous = this.previousValues();
    const current = this.mainForm instanceof UntypedFormGroup || this.mainForm instanceof UntypedFormArray
      ? this.mainForm.getRawValue()
      : {};
    if (areObjectsSame(previous, current)) return;
    if (this.status !== UNSAVED) this.mainForm.disable();
    this.previousValues.set(current);
    let layers = this.config.ui.elementsLayout;
    const { attributes } = this.config.ui.references;
    const { textAttributes } = this.config.ui.paragraphs;
    const actionBtns = this.config.ui?.actions?.buttons;

    // Helper to enable/disable controls recursively
    const processControls = (form: UntypedFormGroup | UntypedFormArray, attrs: any) => {
      if (form instanceof UntypedFormGroup) {
        for (const id in attrs) {
          const { result: isNotVisible } = this.configBuilderService.computeAccessControl(
            VISIBILITY,
            attrs,
            id,
            attributes,
            form,
            this.status
          );
          const { result: isNotEditable } = this.configBuilderService.computeAccessControl(
            EDITABLE_LOGIC,
            attrs,
            id,
            attributes,
            form,
            this.status
          );
          if (isNotVisible)
            layers = this.configBuilderService.removeAttributeAndCleanup(layers, id, form);
          if (!isNotEditable) form.get(id)?.enable();
        }
        // Recursively process nested FormArrays
        Object.values(form.controls).forEach(ctrl => {
          if (ctrl instanceof UntypedFormArray) {
            processControls(ctrl, attrs);
          }
        });
      } else if (form instanceof UntypedFormArray) {
        form.controls.forEach(childCtrl => {
          processControls(childCtrl as UntypedFormGroup | UntypedFormArray, attrs);
        });
      }
    };

    processControls(this.mainForm, attributes);

    for (const id in textAttributes) {
      const { result: isTextNotVisible } = this.configBuilderService.computeAccessControl(
        VISIBILITY,
        textAttributes,
        id,
        attributes,
        this.mainForm,
        this.status
      );
      if (isTextNotVisible)
        layers = this.configBuilderService.removeAttributeAndCleanup(layers, id, this.mainForm);
    }
    if (actionBtns?.length) {
      this.visibleActionButton.update(() =>
        actionBtns?.filter((btn: ActionButton, index: number) => {
          const { result } = this.configBuilderService.computeAccessControl(
            VISIBILITY,
            actionBtns,
            index,
            attributes,
            this.mainForm,
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
    // Set form as submitted
    if (!this.isFormSubmitted()) this.isFormSubmitted.set(true);

    // Validation logic for both FormGroup and FormArray
    let isNotValid = false;
    if (runValidation) {
      if (this.mainForm instanceof UntypedFormGroup) {
        const visibleControls = this.visibleLayers().flat(Infinity);
        isNotValid = visibleControls.some((item: any) => {
          if (item?._refAttributes && this.mainForm.get(item._refAttributes)?.invalid) return true;
          return false;
        });
      } else if (this.mainForm instanceof UntypedFormArray) {
        isNotValid = this.mainForm.controls.some(ctrl => ctrl.invalid);
      }
      if (isNotValid) {
        this.toaster.error("Invalid form details");
        return;
      }
    }

    // Recursively collect data from all child forms
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

    // Parse this form's data (handles both group and array)
    const parsedFormValues = this.parseFormValues();

    // Merge child data into this form's data
    if (parsedFormValues && typeof parsedFormValues === 'object') {
      Object.assign(parsedFormValues, childData);
    }

    // Emit data (or return for parent)
    const result = { formData: parsedFormValues, nextStatus, api };
    if (!this.isChildForm()) {
      this.submittedFormData.emit(result);
    }
    return result;
  }

  parseFormValues() {
    // Handles both FormGroup and FormArray as main form, recursively parses nested structures
    const parse = (form: UntypedFormGroup | UntypedFormArray, config: FormConfig): any => {
      if (form instanceof UntypedFormGroup) {
        const formValues = form.getRawValue() as Record<string, any>;
        return Object.entries(formValues).reduce((acc, [attributeId, controlValue]) => {
          const attributeConfig = config.ui.references.attributes[attributeId];
          // Type guards for discriminated union properties
          let providedFormat = DEFAULT_DATE_FORMAT;
          let mapping: any = undefined;
          let staticSelection: any = undefined;
          if (attributeConfig && attributeConfig.type === FIELD_TYPES.DATE && 'dateFormat' in attributeConfig) {
            providedFormat = attributeConfig.dateFormat;
          }
          if ('get' in attributeConfig && attributeConfig.get) {
            mapping = attributeConfig.get.mapping;
          }
          if ('staticSelection' in attributeConfig && attributeConfig.staticSelection) {
            staticSelection = attributeConfig.staticSelection;
          }
          const dataType = this.getTypeOfData(controlValue);
          switch (dataType) {
            case ARRAY_OF_OBJECTS:
              if (staticSelection) {
                acc[attributeId] = controlValue.map((val: { [x: string]: any }) => val["value"]);
              } else if (mapping && mapping.value) {
                acc[attributeId] = controlValue.map((val: { [x: string]: any }) => val[mapping.value as string]);
              } else {
                acc[attributeId] = controlValue;
              }
              break;
            case OBJECT:
              if (staticSelection) {
                acc[attributeId] = controlValue["value"];
              } else if (mapping && mapping.value) {
                acc[attributeId] = controlValue[mapping.value];
              } else {
                acc[attributeId] = controlValue;
              }
              break;
            case DATE:
              acc[attributeId] = moment(controlValue).format(providedFormat);
              break;
            case ARRAY:
              // Recursively parse nested FormArray if present
              if (form.get(attributeId) instanceof UntypedFormArray) {
                acc[attributeId] = parse(form.get(attributeId) as UntypedFormArray, config);
              } else {
                acc[attributeId] = controlValue;
              }
              break;
            case NUMBER:
            case UNDEFINED:
            case NULL:
            case BOOLEAN:
            default:
              acc[attributeId] = controlValue;
              break;
          }
          return acc;
        }, {} as Record<string, any>);
      } else if (form instanceof UntypedFormArray) {
        // Recursively parse each control in the array
        return form.controls.map((ctrl, idx) => {
          // Try to get config for array item if available
          const arrayConfig = config;
          return parse(ctrl as UntypedFormGroup | UntypedFormArray, arrayConfig);
        });
      }
      return null;
    };
    return parse(this.mainForm, this.config);
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

