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
    "ATTRIBUTE_ID": "3",
    "ATTRIBUTE_TYPE": "input-number",
    "ATTRIBUTE_LABEL": "",
    "ATTRIBUTE_COUNT": 67,
    "DATE": "2025-06-09T18:30:00.000Z",
    "DATE_END": "2025-06-26T18:30:00.000Z",
    "ATTRIBUTE_LABEL_RTE": "This is test <span style=\"color: #e03e2d;\"><strong>data for reset for data</strong></span>",
    "USE_RICH_TEXT": true,
    "TEXT_AREA": "Attribute TEXTAREA",
    "ATTRIBUTE_INPUT_CHIPS": [
        "Test chip 1",
        "Test Chip 2"
    ],
    "ATTRIBUTE_RADIO": "input-autocomplete",
    "ATTRIBUTE_SELECT_MULTIPLE": [
        "input-number",
        "input-select"
    ],
    "ATTRIBUTE_CHIPS_MULTI": [
        "Text Field",
        "Autocomplete Input"
    ],
    "ATTRIBUTE_CHECKBOX_GROUP": [
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
            "value": "input-checkbox",
            "label": "Checkbox"
        },
        {
            "value": "input-password",
            "label": "Password"
        }
    ],
    "ATTRIBUTE_SELECT_SINGLE_WITH_OBJECT_VALUE": {
        "value": "input-password",
        "label": "Password"
    },
    "ATTRIBUTE_CHIPS_MULTI_OBJECT_VALUE": [
        "Autocomplete Input",
        "Number"
    ]
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
