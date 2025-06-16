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

  if (element?.get?.mapping?.label) {
    const labels = element.get.mapping.label.split("|");
    const extraLabels = labels.slice(1).map((key: string) => option[key]).join(".");

    if (extraLabels) {
      display += `. <small class="text-muted">${extraLabels}</small>`;
    }
  }

  return display || "";
}

}
