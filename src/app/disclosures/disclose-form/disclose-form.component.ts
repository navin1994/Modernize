import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { FormLayoutComponent } from 'src/app/config-builder/form-layout/form-layout.component';
import { ConfigBuilderService } from 'src/app/config-builder/config-builder.service';
import { attribute_editor } from './sample.config-data';
import { FormConfig } from 'src/app/models/ui-form-config.interface';

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
  formGroup?: UntypedFormGroup;
  missingDisclosure = false;

  constructor(private title: Title) {}

  ngOnInit():void{
    this.title.setTitle(this.config().disclosure_name)
    if (!this.config()) {
      this.missingDisclosure = true;
    }
    this.formGroup = this.configBuilderService.setUpConfigFormGroup(new UntypedFormGroup({}), this.config());
  }
}
