import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { FormLayoutComponent } from "src/app/config-builder/form-layout/form-layout.component";
import { ConfigBuilderService } from "src/app/config-builder/config-builder.service";
import {
  attribute_editor,
  attribute_editor_array,
  attribute_editor_single_field_array,
  testConfig,
} from "./sample.config-data";
import { FormConfig } from "src/app/models/ui-form-config.interface";
import { UNSAVED } from "src/app/models/constants";

@Component({
  selector: "app-disclose-form",
  standalone: true,
  imports: [FormLayoutComponent, CommonModule],
  templateUrl: "./disclose-form.component.html",
  styleUrl: "./disclose-form.component.scss",
})
export class DiscloseFormComponent implements OnInit {
  private configBuilderService = inject(ConfigBuilderService);
  config = signal<FormConfig>(testConfig);
  // Holds either UntypedFormGroup or UntypedFormArray
  form: UntypedFormGroup | UntypedFormArray = new UntypedFormGroup({});
  missingDisclosure = signal<boolean>(false);
  fullData = signal([
    {
        "ATTRIBUTE_ID": "2",
        "ATTRIBUTE_TYPE": "input-autocomplete",
        "ATTRIBUTE_LABEL": "Test Label",
        "ATTRIBUTE_COUNT": 123123,
        "DATE": "August 4th, 2025",
        "DATE_END": "20-08-2025",
        "ATTRIBUTE_LABEL_RTE": "",
        "USE_RICH_TEXT": null,
        "TEXT_AREA": "Attribute TEXTAREA",
        "ATTRIBUTE_INPUT_CHIPS": [
            "Attribute Chips Input"
        ],
        "ATTRIBUTE_RADIO": "input-autocomplete",
        "ATTRIBUTE_SELECT_MULTIPLE": [
            "input-basic",
            "input-autocomplete"
        ],
        "ATTRIBUTE_CHIPS_MULTI": [
            "Autocomplete Input",
            "Number"
        ],
        "ATTRIBUTE_CHECKBOX_GROUP": [
            "input-basic",
            "input-autocomplete"
        ],
        "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
            {
                "id": "2",
                "attribute_name": "closure",
                "attribute_type": "buoyancy"
            },
            {
                "id": "3",
                "attribute_name": "western_boot_style",
                "attribute_type": "excitation"
            }
        ],
        "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
            {
                "value": "input-basic",
                "label": "Text Field"
            },
            {
                "value": "input-autocomplete",
                "label": "Autocomplete Input"
            },
            {
                "value": "input-number",
                "label": "Number"
            }
        ],
        "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
            "value": "input-select",
            "label": "Select"
        },
        "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
            "Text Field",
            "Autocomplete Input"
        ]
    },
    {
        "ATTRIBUTE_ID": "4",
        "ATTRIBUTE_TYPE": "input-number",
        "ATTRIBUTE_LABEL": "Attribute Label",
        "ATTRIBUTE_COUNT": 12,
        "DATE": "August 12th, 2025",
        "DATE_END": "26-08-2025",
        "ATTRIBUTE_LABEL_RTE": "",
        "USE_RICH_TEXT": null,
        "TEXT_AREA": "Attribute TEXTAREA-2",
        "ATTRIBUTE_INPUT_CHIPS": [
            "Chips -2"
        ],
        "ATTRIBUTE_RADIO": "input-autocomplete",
        "ATTRIBUTE_SELECT_MULTIPLE": [
            "input-basic",
            "input-select"
        ],
        "ATTRIBUTE_CHIPS_MULTI": [
            "Number"
        ],
        "ATTRIBUTE_CHECKBOX_GROUP": [
            "input-basic",
            "input-autocomplete"
        ],
        "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
            {
                "id": "2",
                "attribute_name": "closure",
                "attribute_type": "buoyancy"
            },
            {
                "id": "3",
                "attribute_name": "western_boot_style",
                "attribute_type": "excitation"
            }
        ],
        "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
            {
                "value": "input-basic",
                "label": "Text Field"
            }
        ],
        "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
            "value": "input-checkbox",
            "label": "Checkbox"
        },
        "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
            "Autocomplete Input",
            "Number"
        ]
    }
]);
  status = UNSAVED;

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(this.config().disclosure_name);
    if (!this.config()) {
      this.missingDisclosure.set(true);
    }
    // Detect config type and initialize form accordingly
    this.form = this.configBuilderService.setUpConfigFormRoot(this.config());
    // Optimized recursive patch for both FormGroup and FormArray
    this.configBuilderService.patchFormRecursive(this.form, this.fullData(), this.config());
  }

  onSubmit($event: Record<string, any>) {
    console.log("$event", $event);
  }
}
