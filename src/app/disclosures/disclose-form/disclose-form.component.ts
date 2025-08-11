import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UntypedFormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { FormLayoutComponent } from "src/app/config-builder/form-layout/form-layout.component";
import { ConfigBuilderService } from "src/app/config-builder/config-builder.service";
import { attribute_editor } from "./sample.config-data";
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
  config = signal<FormConfig>(attribute_editor);
  formGroup: UntypedFormGroup = new UntypedFormGroup({});
  missingDisclosure = signal<boolean>(false);
  fullData = signal(
    {
    "ATTRIBUTE_ID": "1",
    "ATTRIBUTE_TYPE": "input-autocomplete",
    "ATTRIBUTE_LABEL": "",
    "ATTRIBUTE_COUNT": 342,
    "DATE": "2025-08-04T18:30:00.000Z",
    "DATE_END": "2025-08-29T18:30:00.000Z",
    "ATTRIBUTE_LABEL_RTE": "<span style=\"font-family: 'arial black', sans-serif; font-size: 14pt; color: #e03e2d; background-color: #fbeeb8;\">Attribute Label</span>",
    "USE_RICH_TEXT": true,
    "TEXT_AREA": "Attribute TEXTAREA",
    "ATTRIBUTE_INPUT_CHIPS": [
        "Chip Parent1",
        "Chip Parent 2"
    ],
    "ATTRIBUTE_RADIO": "input-autocomplete",
    "ATTRIBUTE_SELECT_MULTIPLE": [
        "input-basic",
        "input-autocomplete"
    ],
    "ATTRIBUTE_CHIPS_MULTI": [
        "Text Field",
        "Autocomplete Input"
    ],
    "ATTRIBUTE_CHECKBOX_GROUP": [
        "input-basic",
        "input-autocomplete"
    ],
    "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
        {
            "id": "1",
            "attribute_name": "scarf_length",
            "attribute_type": "sound"
        },
        {
            "id": "2",
            "attribute_name": "closure",
            "attribute_type": "buoyancy"
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
        }
    ],
    "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
        "value": "input-basic",
        "label": "Text Field"
    },
    "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
        "Text Field",
        "Autocomplete Input"
    ],
    "SUB_FORM_GROUP": {
        "ATTRIBUTE_ID": "2",
        "ATTRIBUTE_TYPE": "input-basic",
        "ATTRIBUTE_LABEL": "",
        "ATTRIBUTE_COUNT": 3333,
        "DATE": "2025-07-31T18:30:00.000Z",
        "DATE_END": "2025-08-21T18:30:00.000Z",
        "ATTRIBUTE_LABEL_RTE": "<span style=\"color: #843fa1;\"><strong><span style=\"font-size: 14pt;\">Attribute Label Child</span></strong></span>",
        "USE_RICH_TEXT": true,
        "TEXT_AREA": "Attribute TEXTAREA Child",
        "ATTRIBUTE_INPUT_CHIPS": [
            "Chips Child 1",
            "Chips Child 2"
        ],
        "ATTRIBUTE_RADIO": "input-autocomplete",
        "ATTRIBUTE_SELECT_MULTIPLE": [
            "input-basic",
            "input-autocomplete",
            "input-number"
        ],
        "ATTRIBUTE_CHIPS_MULTI": [
            "Text Field",
            "Autocomplete Input",
            "Number"
        ],
        "ATTRIBUTE_CHECKBOX_GROUP": [
            "input-basic",
            "input-autocomplete",
            "input-number"
        ],
        "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
            {
                "id": "1",
                "attribute_name": "scarf_length",
                "attribute_type": "sound"
            },
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
            "value": "input-autocomplete",
            "label": "Autocomplete Input"
        },
        "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
            "Text Field",
            "Autocomplete Input",
            "Number"
        ]
    }
}
  );
  status = UNSAVED;

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(this.config().disclosure_name);
    if (!this.config()) {
      this.missingDisclosure.set(true);
    }
    this.formGroup = this.configBuilderService.setUpConfigFormGroup(
      new UntypedFormGroup({}),
      this.config()
    );
    this.formGroup.patchValue(this.fullData());
  }

  onSubmit($event: Record<string, any>) {
    console.log("$event", $event);
  }
}
