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
import {
  switchMap,
  startWith,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
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
import { defer, lastValueFrom, Observable } from "rxjs";
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
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AppDateFormatDirective } from "src/app/app-directives/app-date-format.directive";

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
    MatMenuModule,
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
  isRequiredField = computed<boolean>(
    () =>
      !!this.element?.validations?.find((x) => x._refValidation === "required")
  );
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
      this.fieldTypes.CHECKBOX_GROUP,
    ];
    return !fields.includes(this.element.type);
  });

  ngOnInit(): void {
    this.initField();
  }

  initField(): void {
    if (!this.formField.value && this.element?.initialValue) {
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
    // setTimeout(() => this.setValue(), 6000);
  }

  emitChange($event: any): void {
    this.onChange.emit($event);
  }

  setValue() {
    const fieldType: FieldType = this.element.type;
    const supportedTypes: FieldType[] = [
      this.fieldTypes.AUTOCOMPLETE,
      this.fieldTypes.SELECT,
      this.fieldTypes.RADIO_BUTTON,
      this.fieldTypes.CHECKBOX_GROUP,
    ];

    if (!supportedTypes.includes(fieldType)) return;

    const { staticSelection, multiple, get } = this.element;
    const currentValue = this.formField.value;

    // Utility to safely stringify values
    const normalize = (val: any): string => {
      try {
        return JSON.stringify(val);
      } catch {
        return String(val);
      }
    };

    // Handle static options
    if (staticSelection?.options) {
      const options = staticSelection.options;

      if (multiple && Array.isArray(currentValue)) {
        const valueSet = new Set(currentValue.map(normalize));
        const matched = options.filter((opt) =>
          valueSet.has(normalize(opt?.value ?? opt))
        );
        this.formField.setValue(matched);
      } else {
        const match = options.find(
          (opt) => normalize(opt?.value ?? opt) === normalize(currentValue)
        );
        this.formField.setValue(match);
      }

      // Handle dynamic options (get.mapping)
    } else if (get && Array.isArray(this.dropdownOptions)) {
      const { mapping } = get;

      const extractMapped = (val: any) =>
        mapping?.value ? val?.[mapping.value] : val;

      if (multiple && Array.isArray(currentValue)) {
        const valueSet = new Set(
          currentValue.map((v) => normalize(extractMapped(v)))
        );
        const matched = this.dropdownOptions.filter((opt) =>
          valueSet.has(normalize(extractMapped(opt)))
        );
        this.formField.setValue(matched);
      } else {
        const match = this.dropdownOptions.find(
          (opt) => normalize(extractMapped(opt)) === normalize(currentValue)
        );
        this.formField.setValue(match);
      }
    }
  }

  setOptions() {
    const type: FieldType = this.element?.type;
    const supportedTypes: FieldType[] = [
      this.fieldTypes.AUTOCOMPLETE,
      this.fieldTypes.SELECT,
      this.fieldTypes.RADIO_BUTTON,
      this.fieldTypes.CHECKBOX_GROUP,
    ];
    const isOptWithoutFilter = supportedTypes.includes(type);
    const isAutocomplete = type === this.fieldTypes.AUTOCOMPLETE;
    const isStatic = !!this.element?.staticSelection;
    const isRemote = !!this.element?.get;

    const optionsFromStatic = this.element?.staticSelection?.options || [];
    const { from, mapping } = this.element?.get || {};
    const displayAttr = mapping?.label?.split("|")[0];
    const isDynamicUrl = !!from?.includes("{{}}");

    this.displayFn = this.displayFunction.bind(this);

    const filterOptions = (
      options: any[],
      value: any,
      key: string = "label"
    ) => {
      const val = value?.toString()?.toLowerCase?.();
      return options.filter((opt) =>
        opt?.[key]?.toString()?.toLowerCase?.().includes(val)
      );
    };

  let setValueCalled = false;

  const handleOptions = async (source: any[], value: any, key?: string) => {
    if (!setValueCalled) {
      this.setValue();
      setValueCalled = true;
    }
    if (isOptWithoutFilter) return source.slice();
    if (isAutocomplete) return filterOptions(source, value, key);
    return [];
  };

  this.filteredOptions$ = this.formField.valueChanges.pipe(
    startWith(""),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((value: any) => defer(async () => {
      if (isStatic) {
        return handleOptions(optionsFromStatic, value);
      }

      if (isRemote && from) {
        if ((isDynamicUrl || isEmptyArray(this.dropdownOptions))) {
          this.dropdownOptions = await lastValueFrom(this.dataService.getFieldData(from));
        }
        return handleOptions(this.dropdownOptions, value, displayAttr);
      }

      return [];
    }))
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

  setErrorMessage(errorMsg: any) :string {
    return JSON.stringify(errorMsg)?.replace(/^"(.*)"$/, "$1");
  }
}
