import { Component, inject, Input, OnInit, signal } from "@angular/core";
import { AsyncPipe } from "@angular/common";
import {
  UntypedFormControl,
  UntypedFormGroup,
  ReactiveFormsModule,
  FormsModule,
} from "@angular/forms";
import { switchMap, startWith, debounceTime } from "rxjs/operators";
import {
  FIELD_TYPES,
  ReferenceAttribute,
} from "src/app/models/ui-form-config.interface";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatIconModule} from '@angular/material/icon';
import { Observable } from "rxjs";
import { DataService } from "src/app/services/data.service";
import { isEmptyArray } from "src/app/utility/utility";
import { SanitizeTrustedHtmlPipe } from "src/app/pipes/sanitize-trusted-html.pipe";

@Component({
  selector: "app-field-selector",
  standalone: true,
  imports: [
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
    SanitizeTrustedHtmlPipe
  ],
  templateUrl: "./field-selector.component.html",
  styleUrl: "./field-selector.component.scss",
})
export class FieldSelectorComponent implements OnInit {
  // inputs from parent component
  @Input() fullForm: UntypedFormGroup | undefined;
  @Input({required: true}) element: ReferenceAttribute;
  @Input({required: true}) formField: UntypedFormControl;
  private dataService = inject(DataService);
  // formStatus = input<string>();

  fieldTypes = FIELD_TYPES;

  // variables used in this component
  filteredOptions$: Observable<any[]>; // this is for autocomplete field
  dropdownOptions:any[] = [];
  displayFn:any = '';
  hint = signal<boolean>(false);

  ngOnInit(): void {
    this.initField();
  }

  initField(): void {
    switch (this.element.type) {
      case this.fieldTypes.BASIC:
        
        break;
      case this.fieldTypes.AUTOCOMPLETE:
      case this.fieldTypes.SELECT:
        this.setOptions();
      break;
    }
  }

  setOptions() {
    this.displayFn = this.displayFunction.bind(this);
    this.filteredOptions$ = this.formField.valueChanges.pipe(
      debounceTime(500),
      startWith(""),
      switchMap(async (value:any) => {
        if (this.element?.staticSelection) {
          const {options} = this.element.staticSelection;
          if (this.fieldTypes.SELECT === this.element.type) {
            return options.slice();
          } else if (this.fieldTypes.AUTOCOMPLETE === this.element.type) {
            return options.filter(opt => opt.label.toString().toLowerCase().includes(value.toString().toLowerCase())) || options.slice();
          }
        } else if (this.element?.get) {
          const {from, mapping } = this.element.get;
          const displayAttribute = mapping.label.split('|')[0];
          const isDynamicUrl = !!from.includes('{{}}');
          if (isDynamicUrl || isEmptyArray(this.dropdownOptions)) {
            this.dropdownOptions = await this.dataService.getFieldData(from).toPromise();
          }
          if (this.fieldTypes.SELECT === this.element.type) {
            return this.dropdownOptions.slice();
          } else if (this.fieldTypes.AUTOCOMPLETE === this.element.type) {
            return this.dropdownOptions.filter((opt: any) => opt[displayAttribute].toString().toLowerCase().includes(value.toString().toLowerCase())) || this.dropdownOptions.slice();
          }
        }
        return [];
      })
    );
  }

  displayFunction(option: any) {
    let display = option;
    if (this.element?.staticSelection) {
      display = option && option.label ? option.label : '';
    }
    if (this.element?.get) {
      const {mapping} = this.element.get;
      display = mapping?.label && mapping.label?.split('|') && option ? option[mapping.label.split('|')[0]] : option;
    }
    return display || '';
  }

  getDisplayLabel(option: any): string {
    let display = this.displayFunction(option);
    if (this.element?.get) {
      const {mapping} = this.element.get;
      const labels = mapping.label.split('|');
      display = mapping ? (display + (labels.slice(1) ? '. <small class="text-muted">'+ labels.slice(1).map((key: string) => option[key]).join('.')+'</small>': '')) : option;
    }
    return display || '';
  }

  clearField($event: MouseEvent) {
    this.formField.setValue('');
    $event.stopPropagation();
  }

  showHideHint($event: MouseEvent) {
    this.hint.update((hint:boolean) => !hint);
    $event.stopPropagation();
  }
}
