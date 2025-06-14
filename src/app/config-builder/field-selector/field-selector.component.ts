import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  Input,
  OnInit,
  output,
} from "@angular/core";
import { AsyncPipe, CommonModule } from "@angular/common";
import {
  UntypedFormControl,
  UntypedFormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { switchMap, startWith, debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  DIRECTION,
  FIELD_TYPES,
  FieldType,
  ReferenceAttribute,
} from "src/app/models/ui-form-config.interface";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule } from "@angular/material/icon";
import { lastValueFrom, Observable } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { isEmptyArray } from "src/app/utility/utility";
import { SanitizeTrustedHtmlPipe } from "src/app/pipes/sanitize-trusted-html.pipe";
import { RichTextEditorComponent } from "src/app/config-builder/form-layout/form-elements/rich-text-editor/rich-text-editor.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ChipsInputComponent } from "src/app/config-builder/form-layout/form-elements/chips-input/chips-input.component";
import { MatChipsModule } from "@angular/material/chips";
import { SharedUtilityService } from "src/app/services/shared-utility.service";
import { CheckboxGroupComponent } from "src/app/config-builder/form-layout/form-elements/checkbox-group/checkbox-group.component";
import { MatMenuModule } from "@angular/material/menu";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from "@angular/material-moment-adapter";
import { AppDateFormatDirective } from "src/app/app-directives/app-date-format.directive";
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from "@angular/material/core";

@Component({
  selector: "app-field-selector",
  templateUrl: "./field-selector.component.html",
  styleUrl: "./field-selector.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatIconModule,
    SanitizeTrustedHtmlPipe,
    RichTextEditorComponent,
    MatDatepickerModule,
    MatMomentDateModule,
    AppDateFormatDirective,
    ChipsInputComponent,
    MatChipsModule,
    CheckboxGroupComponent,
    MatMenuModule
  ],
})
export class FieldSelectorComponent implements OnInit {
  // inputs from parent component
  @Input() fullForm: UntypedFormGroup | undefined;
  @Input({ required: true }) element: ReferenceAttribute;
  @Input({ required: true }) formField: UntypedFormControl;
  private dataService = inject(DataService);
  private sharedUtilityService = inject(SharedUtilityService);
  onChange = output<any>();
  isFormSubmitted = input<boolean>(false);
  // formStatus = input<string>();

  fieldTypes = FIELD_TYPES;
  direction = DIRECTION;
  filteredOptions$: Observable<any[]>;
  dropdownOptions: any[] = [];
  displayFn: any = "";
  showEraser = computed<boolean>(() => {
    return (
      this.formField.enabled &&
      this.element.type === this.fieldTypes.RADIO_BUTTON
    );
  });
  showClear = computed<boolean>(() => {
    return (
      this.formField.enabled &&
      (this.element.type === this.fieldTypes.SELECT ||
        this.element.type === this.fieldTypes.AUTOCOMPLETE)
    );
  });
  hideLabel = computed<boolean>(() => {
    return !(this.fieldTypes.CHECKBOX === this.element.type);
  });
  fieldsWithoutMatForm = computed<boolean>(() => {
    const fields: FieldType[] = [
      this.fieldTypes.CHECKBOX,
      this.fieldTypes.RICH_TEXT,
      this.fieldTypes.RADIO_BUTTON,
      this.fieldTypes.CHIPS_INPUT,
      this.fieldTypes.CHIPS_SELECT,
      this.fieldTypes.CHECKBOX_GROUP
    ];
    return !fields.includes(this.element.type);
  });

  ngOnInit(): void {
    this.initField();
  }

  initField(): void {
    if (this.element?.initialValue) {
      this.formField.setValue(this.element.initialValue);
    }
    switch (this.element.type) {
      case this.fieldTypes.BASIC:
        break;
      case this.fieldTypes.AUTOCOMPLETE:
      case this.fieldTypes.SELECT:
      case this.fieldTypes.RADIO_BUTTON:
      case this.fieldTypes.CHIPS_SELECT:
      case this.fieldTypes.CHECKBOX_GROUP:
        this.setOptions();
        break;
    }
  }

  emitChange($event: any): void {
    this.onChange.emit($event);
  }

  setOptions() {
    const fieldsTypes: FieldType[] = [this.fieldTypes.SELECT, this.fieldTypes.RADIO_BUTTON, this.fieldTypes.CHIPS_SELECT, this.fieldTypes.CHECKBOX_GROUP];
    const isOptWithoutFilter = fieldsTypes.includes(this.element.type);
    this.formField.setValue([]);
    this.displayFn = this.displayFunction.bind(this);
    this.filteredOptions$ = this.formField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith(""),
      switchMap(async (value: any) => {
        if (this.element?.staticSelection) {
          const { options } = this.element.staticSelection;
          if (isOptWithoutFilter) {
            return options.slice();
          } else if (this.fieldTypes.AUTOCOMPLETE === this.element.type) {
            return (
              options.filter((opt) =>
                opt.label
                  .toString()
                  .toLowerCase()
                  .includes(value.toString().toLowerCase())
              ) || options.slice()
            );
          }
        } else if (this.element?.get) {
          const { from, mapping } = this.element.get;
          const displayAttribute = mapping.label.split("|")[0];
          const isDynamicUrl = !!from.includes("{{}}");
          if (isDynamicUrl || isEmptyArray(this.dropdownOptions)) {
            this.dropdownOptions = await lastValueFrom(this.dataService.getFieldData(from));
            // this.dropdownOptions = [];
          }
          if (isOptWithoutFilter) {
            return this.dropdownOptions.slice();
          } else if (this.fieldTypes.AUTOCOMPLETE === this.element.type) {
            return (
              this.dropdownOptions.filter((opt: any) =>
                opt[displayAttribute]
                  .toString()
                  .toLowerCase()
                  .includes(value.toString().toLowerCase())
              ) || this.dropdownOptions.slice()
            );
          }
        }
        return [];
      })
    );
  }

  displayFunction(option: any) {
    return this.sharedUtilityService.displayFunction(option, this.element);
  }

  getDisplayLabel(option: any): string {
    return this.sharedUtilityService.getDisplayLabel(option, this.element);
  }

  clearField($event: MouseEvent) {
    if (this.formField.disabled) return;
    this.formField.setValue("");
    this.onChange.emit($event);
    $event.stopPropagation();
  }

}
