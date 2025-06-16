import { Injectable } from "@angular/core";
import {
  AbstractControl,
  FormGroup,
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
  FormConfig,
  UiFormConfig,
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
import { combineLatest } from "rxjs";

@Injectable({ providedIn: "root" })
export class ConfigBuilderService {
  public setUpConfigFormGroup(
    formGroup: UntypedFormGroup,
    config: FormConfig
  ): UntypedFormGroup {
    config.ui.elementsLayout.forEach((layer: ElementLayoutData[]) => {
      layer.forEach((element: ElementLayoutData) => {
        if (element?._refAttributes) {
          formGroup.addControl(
            element._refAttributes,
            new UntypedFormControl()
          );
        }
      });
    });
    return formGroup;
  }

  public setCustomValidations(
    formGroup: UntypedFormGroup,
    config: FormConfig,
    status: string
  ): void {
    Object.entries(formGroup.controls).forEach(([id, control]) => {
      control.addValidators(
        this.customValidatorFunction(id, config, formGroup, status)
      );
    }); 
  }

  customValidatorFunction(
    attributeId: string,
    config: FormConfig,
    formGroup: FormGroup,
    status: string
  ): ValidatorFn[] {
    const { validations, attributes } = config.ui.references;
    const attribute = attributes[attributeId];
    if (!attribute.validations?.length) return [];
    return attribute.validations.map((validation: Validation) => {
      return (control: AbstractControl): ValidationErrors | null => {
        const controlValue = control.value;
        if (validation?._refValidation) {
          const val = validations[validation._refValidation];
          const regex = new RegExp(val.regex);
          return controlValue && regex.test(controlValue)
            ? null
            : { [val.type]: val.errorMessage };
        } else if (validation?.comparativeValidations) {

          const { result, message } = this.computeAccessControl(
            VISIBILITY,
            {[attributeId]:{ [VISIBILITY]: validation.comparativeValidations }},
            attributeId,
            config,
            formGroup,
            status
          );
          return  result ? {[Math.random().toString()]: message} : null;
        }
        return null;
      };
    });
  }

  removeAttributeAndCleanup(
    arr: ElementLayoutData[][],
    attribute: string,
    formGroup: FormGroup
  ) {
    const cleanedArray = arr.reduce((acc, innerArray) => {
      const filteredArray = innerArray.filter((item) => {
        if (item._refAttributes && item._refAttributes === attribute) {
          formGroup.get(attribute)?.setValue("");
          formGroup.get(attribute)?.setErrors(null);
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
    config: FormConfig,
    formGroup: FormGroup,
    status: string
  ): { result: boolean; message: string | null } {
    // WIP: Date format comparison or make single date format applicable all over app
    const data = formGroup.getRawValue();
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
      formGroup.get(id as string)?.disable();
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
              const currentValue = this.getDataByType(
                data[group.sourceAttribute as string],
                config,
                group.sourceAttribute
              );
              const originalValue =
                group.conditionValue ||
                data[group.conditionalAttribute as string];
              const conditionValue = this.getDataByType(originalValue, config);
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

  getDataByType(data: any, config: FormConfig, sourceAttribute?: string): any {
    if (data == null || data == undefined || data == "") return "";
    if (isBoolean(data)) return toBoolean(data);
    if (isNumeric(data)) return data;
    if (isObject(data) && sourceAttribute) {
      const attributeConfig = config.ui.references.attributes[sourceAttribute];
      let valueKey = "value";
      if (attributeConfig?.get && attributeConfig.get?.mapping && attributeConfig.get.mapping.value) {
          valueKey = attributeConfig.get.mapping.value;
      }
      return this.getDataByType(data[valueKey], config);
    }
    return JSON.stringify(data)?.replace(/^"(.*)"$/, "$1");
  }
}
