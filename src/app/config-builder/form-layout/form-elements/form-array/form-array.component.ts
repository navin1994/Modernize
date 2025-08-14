import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  output,
  signal,
  computed,
  input,
  AfterViewInit,
  OnDestroy,
  inject,
  forwardRef,
} from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { ReferenceAttribute } from "src/app/models/ui-form-config.interface";
import { FieldSelectorComponent } from "src/app/config-builder/field-selector/field-selector.component";
import { UNSAVED } from "src/app/models/constants";
import { combineLatest, ReplaySubject, takeUntil } from "rxjs";
import { ConfigBuilderService } from "src/app/config-builder/config-builder.service";
import { FormLayoutComponent } from "../../form-layout.component";

@Component({
  selector: "app-form-array",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FieldSelectorComponent,
    MatButtonModule,
    forwardRef(() => FormLayoutComponent),
  ],

  templateUrl: "./form-array.component.html",
  styleUrl: "./form-array.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormArrayComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroyed$ = new ReplaySubject(1);
  @Input({ required: true }) formArray!: UntypedFormArray;
  @Input({ required: true }) attrConfig!: ReferenceAttribute;
  @Input() formGroup: UntypedFormGroup;
  private configBuilderService = inject(ConfigBuilderService);
  isFormSubmitted = input<boolean>(false);
  formStatus = input(UNSAVED);
  onChange = output<any>();
  existingValue = signal("");
  disabled = signal<boolean>(true);
  groupConfig = computed(
    () => this.attrConfig.formArrayAttributes?.groupConfig
  );

  ngOnInit(): void {
    this.disabled.set(this.formArray.disabled);
    combineLatest([this.formArray.valueChanges, this.formArray.statusChanges])
      .pipe(takeUntil(this.destroyed$))
      .subscribe(([value, status]) => {
        this.existingValue.set(value);
        this.disabled.set(this.formArray.disabled);
      });

    if (this.formArray.length === 0) {
      this.addNewItemAt(0);
    }
  }

  ngAfterViewInit(): void {
    this.disabled.set(this.formArray.disabled);
    this.existingValue.set(this.formArray.value);
    setTimeout(() => {
      this.formArray.updateValueAndValidity();
    });
  }

  addNewItemAt(index: number = 0): void {
    let newControl;
    if (this.groupConfig()) {
      newControl = this.configBuilderService.setUpConfigFormGroup(
        new UntypedFormGroup({}),
        {
          disclosure_name: this.attrConfig.label,
          disclosure_type: this.attrConfig.type,
          ui: this.attrConfig.formArrayAttributes?.groupConfig!,
        }
      );
    } else {
      newControl = new UntypedFormControl("");
    }
    this.formArray.insert(index, newControl);
    this.updateControl();
  }

  removeItem(index: number): void {
  this.formArray.removeAt(index);
  this.updateControl();
  }

  addOrRemoveElement(flag: boolean, index: number): void {
    if (flag) {
      this.addNewItemAt(index + 1);
    } else {
      this.removeItem(index);
    }
  }

  updateControl() {
    this.formArray.markAsTouched();
    this.formArray.markAsDirty();
    this.formArray.updateValueAndValidity();
    this.onChange.emit(this.formArray?.value);
  }

  ngOnDestroy(): void {
    this.existingValue.set("");
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
