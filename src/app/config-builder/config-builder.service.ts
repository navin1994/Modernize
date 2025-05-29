import { Injectable } from "@angular/core";
import {
    AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
} from "@angular/forms";
import {
  ElementLayoutData,
  FormConfig,
  ReferenceAttribute,
} from "../models/ui-form-config.interface";

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
    validatorFn: (attributeId: string, config: FormConfig) => ValidatorFn[],
    formGroup: UntypedFormGroup,
    config: FormConfig
  ): void {
    Object.entries(formGroup.controls).forEach(([id, control]) => {
        control.addValidators(validatorFn(id, config))
    })
  }
}
