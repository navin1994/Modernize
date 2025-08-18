import { Injectable } from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import {
  AccessControls,
  AttributeType,
  COMPARISON_TYPES,
  ConditionGroup,
  ElementLayoutData,
  FIELD_TYPES,
  FormConfig,
  ReferenceAttribute,
  UiFormConfig,
  UiFormReferences,
  Validation,
} from "../models/ui-form-config.interface";
import { EDITABLE_LOGIC, VISIBILITY } from "../models/constants";
import {
  dateToNumber,
  isBoolean,
  isDate,
  isEmptyArray,
  isNumeric,
  isObject,
  toBoolean,
} from "../utility/utility";

@Injectable({ providedIn: "root" })
export class ConfigBuilderService {

  public setUpConfigFormRoot(config: FormConfig): UntypedFormGroup | UntypedFormArray {
    if (config.ui.type === FIELD_TYPES.FORM_ARRAY) {
      // Only one attribute allowed in attributes for FORM_ARRAY
      const attrKeys = Object.keys(config.ui.references.attributes);
      if (attrKeys.length !== 1) {
        throw new Error('FORM_ARRAY config must have exactly one attribute in references.attributes');
      }
      const attr = config.ui.references.attributes[attrKeys[0]];
      const initial = attr.initialValue || [];
      const formArray = new UntypedFormArray([]);
      // If attribute is a FORM_GROUP or FORM_ARRAY, use nestedElement
      if (attr.type === FIELD_TYPES.FORM_GROUP && attr.nestedElement) {
          formArray.push(
            this.setUpConfigFormRoot({
              disclosure_name: attr.label,
              disclosure_type: attr.id,
              ui: attr.nestedElement as UiFormConfig,
            }) as UntypedFormGroup
          );
      } else if (attr.type === FIELD_TYPES.FORM_ARRAY && attr.nestedElement) {
          formArray.push(
            this.setUpConfigFormRoot({
              disclosure_name: attr.label,
              disclosure_type: attr.id,
              ui: attr.nestedElement as UiFormConfig,
            }) as UntypedFormArray
          );
      } else {
        // Basic field or other types
          formArray.push(new UntypedFormControl(initial));
      }
      return formArray;
    } else if (config.ui.type === FIELD_TYPES.FORM_GROUP) {
      const formGroup = new UntypedFormGroup({});
      config.ui.elementsLayout.forEach((layer: ElementLayoutData[]) => {
        layer.forEach((element: ElementLayoutData) => {
          if (element?._refAttributes) {
            const attr = config.ui.references.attributes[element._refAttributes];
            if (!attr) return;
            // --- FORM GROUP ---
            if (attr.type === FIELD_TYPES.FORM_GROUP && attr.nestedElement) {
              formGroup.addControl(
                attr.id,
                this.setUpConfigFormRoot({
                  disclosure_name: attr.label,
                  disclosure_type: attr.id,
                  ui: attr.nestedElement as UiFormConfig,
                }) as UntypedFormGroup
              );
            // --- FORM ARRAY ---
            } else if (attr.type === FIELD_TYPES.FORM_ARRAY && attr.nestedElement) {
              formGroup.addControl(
                attr.id,
                this.setUpConfigFormRoot({
                  disclosure_name: attr.label,
                  disclosure_type: attr.id,
                  ui: attr.nestedElement as UiFormConfig,
                }) as UntypedFormArray
              );
            // --- BASIC FIELD ---
            } else {
              formGroup.addControl(
                element._refAttributes,
                new UntypedFormControl(attr.initialValue)
              );
            }
          }
        });
      });
      return formGroup;
    } else {
      throw new Error('Unknown config.ui.type: ' + config.ui);
    }
  }

  public setCustomValidations(
    form: UntypedFormGroup | UntypedFormArray,
    references: UiFormReferences,
    status: string
  ): void {
    if (!references || !references.attributes) return;
    if (form instanceof UntypedFormGroup) {
      Object.entries(form.controls).forEach(([id, control]) => {
        const attr = references.attributes[id];
        if (!attr) return;
        control.addValidators(
          this.customValidatorFunction(id, references, form, status)
        );
        // Handle nested FormGroup/FormArray
        if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
          this.setCustomValidations(control, references, status);
        }
      });
    } else if (form instanceof UntypedFormArray) {
      // Only one attribute allowed in references.attributes for FormArray
      const attrKeys = Object.keys(references.attributes);
      if (attrKeys.length !== 1) return;
      const attr = references.attributes[attrKeys[0]];
      form.controls.forEach((control, idx) => {
        if (!attr) return;
        control.addValidators(
          this.customValidatorFunction(attrKeys[0], references, form, status)
        );
        // Handle nested FormGroup/FormArray
        if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
          this.setCustomValidations(control, references, status);
        }
      });
    }
  }

  customValidatorFunction(
    attributeId: string,
    references: UiFormReferences,
    form: UntypedFormGroup | UntypedFormArray,
    status: string
  ): ValidatorFn[] {
    const { validations, attributes } = references;
    const attribute = attributes[attributeId];
    if (!attribute || !attribute.validations?.length) return [];
    return attribute.validations.map((validation: Validation) => {
      return (control: AbstractControl): ValidationErrors | null => {
        const controlValue = control.value;
        if (validation?._refValidation) {
          const val = validations[validation._refValidation];
          if (!val || !val.regex) return null;
          const regex = new RegExp(val.regex);
          return controlValue && regex.test(controlValue)
            ? null
            : { [val.type]: val.errorMessage };
        } else if (validation?.comparativeValidations) {
          const { result, message } = this.computeAccessControl(
            VISIBILITY,
            {
              [attributeId]: {
                [VISIBILITY]: validation.comparativeValidations,
              },
            },
            attributeId,
            attributes,
            form,
            status
          );
          return result ? { [Math.random().toString()]: message } : null;
        }
        return null;
      };
    });
  }

  removeAttributeAndCleanup(
    arr: ElementLayoutData[][],
    attribute: string,
    formGroup: UntypedFormGroup | UntypedFormArray
  ) {
    const cleanedArray = arr.reduce((acc, innerArray) => {
      const filteredArray = innerArray.filter((item) => {
        if (item._refAttributes && item._refAttributes === attribute) {
          // Remove value and errors for both FormGroup and FormArray
          if (formGroup instanceof UntypedFormGroup) {
            formGroup.get(attribute)?.setValue("");
            formGroup.get(attribute)?.setErrors(null);
          } else if (formGroup instanceof UntypedFormArray) {
            formGroup.controls.forEach(ctrl => {
              if (ctrl instanceof UntypedFormGroup || ctrl instanceof UntypedFormArray) {
                // Recursively clean nested groups/arrays
                this.removeAttributeAndCleanup(
                  [innerArray],
                  attribute,
                  ctrl
                );
              } else if (ctrl instanceof UntypedFormControl) {
                ctrl.setValue("");
                ctrl.setErrors(null);
              }
            });
          }
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
    id: string | number,
    attributesConfig: Record<string, ReferenceAttribute>,
    formGroup: UntypedFormGroup | UntypedFormArray,
    status: string
  ): { result: boolean; message: string | null } {
    // Support both FormGroup and FormArray for data extraction
    let data: any;
    if (formGroup instanceof UntypedFormGroup) {
      data = formGroup.getRawValue();
    } else if (formGroup instanceof UntypedFormArray) {
      data = formGroup.controls.map(ctrl =>
        ctrl instanceof UntypedFormGroup || ctrl instanceof UntypedFormArray
          ? ctrl.getRawValue()
          : ctrl.value
      );
    } else {
      data = {};
    }

    const isExist = checkType in attributes[id];
    if (!isExist) {
      return {
        result: this.checkTypeValue(checkType),
        message: `${checkType} doesn't exist in`,
      };
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
      if (formGroup instanceof UntypedFormGroup) {
        formGroup.get(id as string)?.disable();
      } else if (formGroup instanceof UntypedFormArray) {
        formGroup.controls.forEach(ctrl => ctrl.disable());
      }
      return { result: true, message: `${id} attribute is readonly` };
    }
    if (allWaysEditable)
      return { result: false, message: `${id} attribute is always editable` };
    if (statuses && !statuses.includes(status))
      return {
        result: true,
        message: `Current form status :${status} is not included in conditional statuses`,
      };
    if (userPermissions && !userPermissions.includes("read"))
      return {
        result: true,
        message: `User don't have read permission for attribute ${id}`,
      };
    if (userRole && !userRole.includes("compliance"))
      return { result: true, message: `User don't have compliance role` };
    if (conditionGroups && !isEmptyArray(conditionGroups)) {
      const mainFunc = matchAllGroup ? "every" : "some";
      const groupFunc = matchConditionsGroup ? "every" : "some";
      let message = null;
      const result: boolean = !conditionGroups[mainFunc]((groupArray) => {
        return (
          !!groupArray?.length &&
          groupArray[groupFunc]((group: ConditionGroup) => {
            if (group.attributeType === ("self" as AttributeType)) {
              group.sourceAttribute = id as string;
            }
            if (
              (group.attributeType === ("self" as AttributeType) ||
                group.attributeType === ("form-attribute" as AttributeType)) &&
              (group?.sourceAttribute || group?.conditionalAttribute)
            ) {
              message = group.description;
              let currentValue, originalValue;
              if (formGroup instanceof UntypedFormArray) {
                // For arrays, use index as sourceAttribute if possible
                const idx = typeof group.sourceAttribute === 'number' ? group.sourceAttribute : 0;
                currentValue = data[idx];
                originalValue = group.conditionValue || data[idx];
              } else {
                currentValue = this.getDataByType(
                  data[group.sourceAttribute as string],
                  attributesConfig,
                  group.sourceAttribute
                );
                originalValue =
                  group.conditionValue ||
                  data[group.conditionalAttribute as string];
              }
              const conditionValue = this.getDataByType(originalValue, attributesConfig);
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
      message = result ? message : null;
      return { result, message };
    }
    return { result: false, message: null };
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

  getDataByType(data: any, attributes: Record<string, ReferenceAttribute>, sourceAttribute?: string): any {
    if (data == null || data == undefined || data == "") return "";
    if (isBoolean(data)) return toBoolean(data);
    if (isNumeric(data)) return data;
    if (isObject(data) && sourceAttribute) {
      const attributeConfig = attributes[sourceAttribute];
      let valueKey = "value";
      // Type guard for discriminated union: only access 'get' if present
      if (
        attributeConfig &&
        typeof attributeConfig === 'object' &&
        'get' in attributeConfig &&
        attributeConfig.get &&
        attributeConfig.get.mapping &&
        attributeConfig.get.mapping.value
      ) {
        valueKey = attributeConfig.get.mapping.value;
      }
      return this.getDataByType(data[valueKey], attributes);
    }
    return JSON.stringify(data)?.replace(/^"(.*)"$/, "$1");
  }
}
