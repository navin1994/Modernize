import { Injectable } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
    ElementLayoutData,
    FormConfig,
} from "../models/ui-form-config.interface";

@Injectable({ providedIn: "root" })
export class ConfigBuilderService {

    public setUpConfigFormGroup(
        formGroup: UntypedFormGroup,
        config: FormConfig
    ): UntypedFormGroup {
        config.ui.elementsLayout.forEach((layer: ElementLayoutData[]) => {
            layer.forEach((element: ElementLayoutData) => {
                if(element?._refAttributes) {
                    formGroup.addControl(
                        element._refAttributes,
                        new UntypedFormControl()
                    );
                }
            })
        });
        return formGroup;
    }

}
