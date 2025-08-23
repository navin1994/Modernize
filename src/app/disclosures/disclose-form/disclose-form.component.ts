import { Component, OnInit, signal, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { FormLayoutComponent } from "src/app/config-builder/form-layout/form-layout.component";
import { ConfigBuilderService } from "src/app/config-builder/config-builder.service";
import {
  attribute_editor,
  attribute_editor_array,
  attribute_editor_formGroup,
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
  config = signal<FormConfig>(attribute_editor);
  // Holds either UntypedFormGroup or UntypedFormArray
  form: UntypedFormGroup | UntypedFormArray = new UntypedFormGroup({});
  missingDisclosure = signal<boolean>(false);
  fullData = signal(
   {
    "ATTRIBUTE_ID": "1",
    "ATTRIBUTE_TYPE": "input-autocomplete",
    "ATTRIBUTE_LABEL": "Attribute Label Basic Input",
    "ATTRIBUTE_COUNT": 12,
    "DATE": "2025-08-10T18:30:00.000Z",
    "DATE_END": "2025-08-19T18:30:00.000Z",
    "ATTRIBUTE_LABEL_RTE": "",
    "USE_RICH_TEXT": null,
    "TEXT_AREA": "01/01/2001",
    "ATTRIBUTE_INPUT_CHIPS": [
        "Chips -1",
        "Chips-2"
    ],
    "ATTRIBUTE_RADIO": "input-autocomplete",
    "ATTRIBUTE_SELECT_MULTIPLE": [
        "input-basic",
        "input-autocomplete"
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
        },
        {
            "value": "input-autocomplete",
            "label": "Autocomplete Input"
        }
    ],
    "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
        "value": "input-autocomplete",
        "label": "Autocomplete Input"
    },
    "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
        "Text Field",
        "Autocomplete Input"
    ],
    "SUB_FORM_GROUP": {
        "ATTRIBUTE_ID": "2",
        "ATTRIBUTE_TYPE": "input-number",
        "ATTRIBUTE_LABEL": "",
        "ATTRIBUTE_COUNT": 23,
        "DATE": "2025-08-04T18:30:00.000Z",
        "DATE_END": "2025-08-14T18:30:00.000Z",
        "ATTRIBUTE_LABEL_RTE": "<span style=\"font-size: 18pt; font-family: tahoma, arial, helvetica, sans-serif; color: #3e9bcb; background-color: #f1c40f;\"><strong>Attribute Label</strong></span>",
        "USE_RICH_TEXT": true,
        "TEXT_AREA": "01/02/2001",
        "ATTRIBUTE_INPUT_CHIPS": [
            "Chips-3",
            "Chips-4"
        ],
        "ATTRIBUTE_RADIO": "input-autocomplete",
        "ATTRIBUTE_SELECT_MULTIPLE": [
            "input-basic",
            "input-autocomplete",
            "input-number"
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
                "id": "3",
                "attribute_name": "western_boot_style",
                "attribute_type": "excitation"
            },
            {
                "id": "4",
                "attribute_name": "hiking_boot_style",
                "attribute_type": "color"
            }
        ],
        "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
            {
                "value": "input-number",
                "label": "Number"
            },
            {
                "value": "input-select",
                "label": "Select"
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
    "SUB_FORM_GROUP_WITH_NESTED_FORM_ARRAY": {
        "ATTRIBUTE_ID": "5",
        "FORM_ARRAY_OF_SINGLE_FIELD": [
            "This is nested form array-1",
            "This is nested form array-2"
        ]
    },
    "FORM_ARRAY_OF_SINGLE_FIELD": [
        "Attribute TEXTAREA-1",
        "Attribute TEXTAREA-2",
        "Attribute TEXTAREA-3"
    ],
    "FORM_ARRAY_OF_FORM_GROUP": [
        {
            "ATTRIBUTE_ID": "1",
            "ATTRIBUTE_TYPE": "input-basic",
            "ATTRIBUTE_LABEL": "ABC",
            "ATTRIBUTE_COUNT": 34,
            "DATE": "2025-08-11T18:30:00.000Z",
            "DATE_END": "2025-08-21T18:30:00.000Z",
            "ATTRIBUTE_LABEL_RTE": "",
            "USE_RICH_TEXT": null,
            "TEXT_AREA": "01/01/2001",
            "ATTRIBUTE_INPUT_CHIPS": [
                "ABC",
                "CBZ",
                "Hayabusa"
            ],
            "ATTRIBUTE_RADIO": "input-number",
            "ATTRIBUTE_SELECT_MULTIPLE": [
                "input-checkbox",
                "input-password"
            ],
            "ATTRIBUTE_CHIPS_MULTI": [
                "Autocomplete Input"
            ],
            "ATTRIBUTE_CHECKBOX_GROUP": [
                "input-basic",
                "input-number"
            ],
            "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
                {
                    "id": "3",
                    "attribute_name": "western_boot_style",
                    "attribute_type": "excitation"
                },
                {
                    "id": "4",
                    "attribute_name": "hiking_boot_style",
                    "attribute_type": "color"
                }
            ],
            "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
                {
                    "value": "input-basic",
                    "label": "Text Field"
                },
                {
                    "value": "input-select",
                    "label": "Select"
                }
            ],
            "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
                "value": "input-select",
                "label": "Select"
            },
            "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
                "Text Field"
            ]
        },
        {
            "ATTRIBUTE_ID": "4",
            "ATTRIBUTE_TYPE": "input-number",
            "ATTRIBUTE_LABEL": "Attribute Label Basic Input",
            "ATTRIBUTE_COUNT": 56,
            "DATE": "2025-08-04T18:30:00.000Z",
            "DATE_END": "2025-08-19T18:30:00.000Z",
            "ATTRIBUTE_LABEL_RTE": "",
            "USE_RICH_TEXT": null,
            "TEXT_AREA": "ABSD NASASB NASNASK",
            "ATTRIBUTE_INPUT_CHIPS": [
                "chocholate",
                "Topy",
                "Tophy"
            ],
            "ATTRIBUTE_RADIO": "input-autocomplete",
            "ATTRIBUTE_SELECT_MULTIPLE": [
                "input-basic"
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
                "value": "input-number",
                "label": "Number"
            },
            "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
                "Text Field",
                "Autocomplete Input"
            ]
        }
    ],
    "FORM_ARRAY_WITH_NESTED_SINGLE_FIELD_WITH_FORM_GROUP": [
        [
            {
                "ATTRIBUTE_ID": "3",
                "ATTRIBUTE_TYPE": "input-autocomplete",
                "ATTRIBUTE_LABEL": "Label 123",
                "ATTRIBUTE_COUNT": 234,
                "DATE": "2025-08-11T18:30:00.000Z",
                "DATE_END": "2025-08-20T18:30:00.000Z",
                "ATTRIBUTE_LABEL_RTE": "",
                "USE_RICH_TEXT": null,
                "TEXT_AREA": "Attribute TEXTAREA Attribute TEXTAREA Attribute TEXTAREA",
                "ATTRIBUTE_INPUT_CHIPS": [
                    "Attribute TEXTAREA",
                    "Attribute TEXTAREA-2"
                ],
                "ATTRIBUTE_RADIO": "input-autocomplete",
                "ATTRIBUTE_SELECT_MULTIPLE": [
                    "input-basic",
                    "input-autocomplete",
                    "input-number",
                    "input-select"
                ],
                "ATTRIBUTE_CHIPS_MULTI": [
                    "Number"
                ],
                "ATTRIBUTE_CHECKBOX_GROUP": [
                    "input-basic"
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
                    },
                    {
                        "id": "4",
                        "attribute_name": "hiking_boot_style",
                        "attribute_type": "color"
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
                    },
                    {
                        "value": "input-select",
                        "label": "Select"
                    },
                    {
                        "value": "input-textarea",
                        "label": "Text Area"
                    },
                    {
                        "value": "input-date",
                        "label": "Date"
                    },
                    {
                        "value": "input-chips",
                        "label": "Chips Input"
                    },
                    {
                        "value": "chips-select",
                        "label": "Chips Select"
                    }
                ],
                "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
                    "value": "input-password",
                    "label": "Password"
                },
                "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
                    "Autocomplete Input"
                ]
            },
            {
                "ATTRIBUTE_ID": "5",
                "ATTRIBUTE_TYPE": "input-password",
                "ATTRIBUTE_LABEL": "Attribute Label Basic Input 988",
                "ATTRIBUTE_COUNT": 34,
                "DATE": "2025-08-11T18:30:00.000Z",
                "DATE_END": "2025-08-13T18:30:00.000Z",
                "ATTRIBUTE_LABEL_RTE": "",
                "USE_RICH_TEXT": null,
                "TEXT_AREA": "Attribute TEXTAREA 0987",
                "ATTRIBUTE_INPUT_CHIPS": [
                    "Attribute TEXTAREA 987",
                    "9876554"
                ],
                "ATTRIBUTE_RADIO": "input-autocomplete",
                "ATTRIBUTE_SELECT_MULTIPLE": [
                    "input-radio",
                    "input-checkbox",
                    "input-password"
                ],
                "ATTRIBUTE_CHIPS_MULTI": [
                    "Autocomplete Input"
                ],
                "ATTRIBUTE_CHECKBOX_GROUP": [
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
                    },
                    {
                        "id": "4",
                        "attribute_name": "hiking_boot_style",
                        "attribute_type": "color"
                    }
                ],
                "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
                    {
                        "value": "chips-select",
                        "label": "Chips Select"
                    },
                    {
                        "value": "input-radio",
                        "label": "Radio Buttons"
                    }
                ],
                "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
                    "value": "input-select",
                    "label": "Select"
                },
                "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
                    "Autocomplete Input"
                ]
            }
        ],
        [
            {
                "ATTRIBUTE_ID": "3",
                "ATTRIBUTE_TYPE": "input-radio",
                "ATTRIBUTE_LABEL": "Radio Button Label",
                "ATTRIBUTE_COUNT": 948,
                "DATE": "2025-06-10T18:30:00.000Z",
                "DATE_END": "2025-06-11T18:30:00.000Z",
                "ATTRIBUTE_LABEL_RTE": "",
                "USE_RICH_TEXT": null,
                "TEXT_AREA": "Attribute TEXTAREA",
                "ATTRIBUTE_INPUT_CHIPS": [
                    "Attribute TEXTAREA"
                ],
                "ATTRIBUTE_RADIO": "input-autocomplete",
                "ATTRIBUTE_SELECT_MULTIPLE": [
                    "input-basic",
                    "input-textarea"
                ],
                "ATTRIBUTE_CHIPS_MULTI": [
                    "Autocomplete Input",
                    "Number"
                ],
                "ATTRIBUTE_CHECKBOX_GROUP": [
                    "input-autocomplete",
                    "input-number"
                ],
                "ATTRIBUTE_TYPE_GET_SERVER_OPTIONS": [
                    {
                        "id": "3",
                        "attribute_name": "western_boot_style",
                        "attribute_type": "excitation"
                    },
                    {
                        "id": "4",
                        "attribute_name": "hiking_boot_style",
                        "attribute_type": "color"
                    }
                ],
                "ATTRIBUTE_SELECT_MULTIPLE_WITH_OBJECT_VALUE": [
                    {
                        "value": "input-basic",
                        "label": "Text Field"
                    },
                    {
                        "value": "input-textarea",
                        "label": "Text Area"
                    },
                    {
                        "value": "input-date",
                        "label": "Date"
                    }
                ],
                "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
                    "value": "chips-select",
                    "label": "Chips Select"
                },
                "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
                    "Autocomplete Input",
                    "Number"
                ]
            }
        ]
    ],
    "FORM_ARRAY_WITH_NESTED_FORM_GROUP_WITH_NESTED_ARRAY_OF_SINGLE_FIELD": [
        {
            "ATTRIBUTE_ID": "1",
            "FORM_ARRAY_OF_SINGLE_FIELD": [
                "Attribute TEXTAREA",
                "Attribute TEXTAREA -2",
                "Attribute TEXTAREA-3"
            ]
        },
        {
            "ATTRIBUTE_ID": "3",
            "FORM_ARRAY_OF_SINGLE_FIELD": [
                "Attribute TEXTAREA-12",
                "Attribute TEXTAREA-23",
                "Attribute TEXTAREA-34"
            ]
        },
        {
            "ATTRIBUTE_ID": "5",
            "FORM_ARRAY_OF_SINGLE_FIELD": [
                "Attribute TEXTAREA-45",
                "Attribute TEXTAREA56"
            ]
        }
    ]
});
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
    if (this.fullData()) {
      this.configBuilderService.patchFormRecursive(this.form, this.fullData(), this.config());
    }
  }

  onSubmit($event: Record<string, any>) {
    console.log("$event", $event);
  }
}
