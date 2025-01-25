import { Injectable } from "@angular/core";
import { ReferenceAttribute } from "../models/ui-form-config.interface";

@Injectable({
    providedIn: "root",
})
export class SharedUtilityService {
    public displayFunction(option: any, element: ReferenceAttribute) {
        let display = option;
        if (element?.staticSelection) {
            display = option && option.label ? option.label : "";
        }
        if (element?.get) {
            const { mapping } = element.get;
            display =
                mapping?.label && mapping.label?.split("|") && option
                    ? option[mapping.label.split("|")[0]]
                    : option;
        }
        return display || "";
    }

    public getDisplayLabel(option: any, element: ReferenceAttribute): string {
        let display = this.displayFunction(option, element);
        if (element?.get) {
            const { mapping } = element.get;
            const labels = mapping.label.split("|");
            display = mapping
                ? display +
                (labels.slice(1)
                    ? '. <small class="text-muted">' +
                    labels
                        .slice(1)
                        .map((key: string) => option[key])
                        .join(".") +
                    "</small>"
                    : "")
                : option;
        }
        return display || "";
    }
}
