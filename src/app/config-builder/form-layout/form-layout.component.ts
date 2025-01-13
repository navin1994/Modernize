import { Component, input, signal } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from '../field-selector/field-selector.component';
import { FormConfig } from 'src/app/models/ui-form-config.interface';

@Component({
  selector: 'app-form-layout',
  standalone: true,
  imports: [MatCardModule, FieldSelectorComponent],
  templateUrl: './form-layout.component.html',
  styleUrl: './form-layout.component.scss'
})
export class FormLayoutComponent {
config = input.required<FormConfig>();
formGroup = input<UntypedFormGroup>();
}
