import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FormLayoutComponent } from 'src/app/config-builder/form-layout/form-layout.component';
import { ConfigBuilderService } from 'src/app/config-builder/config-builder.service';
import { attribute_editor } from './sample.config-data';
import { FormConfig } from 'src/app/models/ui-form-config.interface';
import { UNSAVED } from 'src/app/models/constants';

@Component({
  selector: 'app-disclose-form',
  standalone: true,
  imports: [FormLayoutComponent, CommonModule],
  templateUrl: './disclose-form.component.html',
  styleUrl: './disclose-form.component.scss'
})
export class DiscloseFormComponent implements OnInit{
  private configBuilderService = inject(ConfigBuilderService);
  config = signal<FormConfig>(attribute_editor);
  formGroup: UntypedFormGroup = new UntypedFormGroup({});
  missingDisclosure = false;
  fullData = signal({
    "ATTRIBUTE_ID": {
        "id": 1,
        "attribute_name": "season",
        "attribute_type": "contraction"
    },
    "ATTRIBUTE_TYPE": {
        "value": "input-autocomplete",
        "label": "Autocomplete Input"
    },
    "ATTRIBUTE_LABEL": "Attribute Label Basic Input",
    "ATTRIBUTE_COUNT": null,
    "DATE": "2025-06-01T18:30:00.000Z",
    "DATE_END": "2025-06-25T18:30:00.000Z",
    "ATTRIBUTE_LABEL_RTE": "",
    "USE_RICH_TEXT": null,
    "TEXT_AREA": "Attribute TEXTAREA",
    "ATTRIBUTE_INPUT_CHIPS": [
        "Chips value1",
        "Chips value 2"
    ],
    "ATTRIBUTE_RADIO": {
        "value": "input-basic",
        "label": "Text Field"
    },
    "ATTRIBUTE_SELECT_MULTIPLE": [
        {
            "value": "input-number",
            "label": "Number"
        },
        {
            "value": "input-select",
            "label": "Select"
        }
    ],
    "ATTRIBUTE_CHIPS_MULTI": [
        "Autocomplete Input",
        "Number"
    ],
    "ATTRIBUTE_CHECKBOX_GROUP": [
        {
            "value": "input-autocomplete",
            "label": "Autocomplete Input"
        },
        {
            "value": "input-number",
            "label": "Number"
        }
    ]
});
  status = UNSAVED;

  constructor(private title: Title) {}

  ngOnInit():void{
    this.title.setTitle(this.config().disclosure_name)
    if (!this.config()) {
      this.missingDisclosure = true;
    }
    this.formGroup = this.configBuilderService.setUpConfigFormGroup(new UntypedFormGroup({}), this.config());
    // this.formGroup.patchValue(this.fullData())
  }

  onSubmit($event: Record<string, any>) {
    console.log('$event', $event);
  }
}
