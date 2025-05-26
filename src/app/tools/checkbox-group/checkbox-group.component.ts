import { AfterViewInit, Component, inject, input, Input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { combineLatest, ReplaySubject, takeUntil } from 'rxjs';
import { DIRECTION, ReferenceAttribute } from 'src/app/models/ui-form-config.interface';
import { SanitizeTrustedHtmlPipe } from 'src/app/pipes/sanitize-trusted-html.pipe';
import { SharedUtilityService } from 'src/app/services/shared-utility.service';

@Component({
  selector: 'mat-checkbox-group',
  standalone: true,
  imports: [MatCheckboxModule, MatFormFieldModule, SanitizeTrustedHtmlPipe],
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.scss'
})
export class CheckboxGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroyed$ = new ReplaySubject(1);
  @Input() formFieldControl: UntypedFormControl;
  disabled = signal<boolean>(false);
  private sharedUtilityService = inject(SharedUtilityService);
  options = input.required<any[] | null>();
  element = input.required<ReferenceAttribute>();
  existingValue = signal('');
  change = output<any>();
  direction = DIRECTION;

  ngOnInit(): void {
    this.disabled.set(this.formFieldControl.disabled)
    combineLatest([this.formFieldControl.valueChanges, this.formFieldControl.statusChanges])
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: ([value, status]) => {
          this.existingValue.set(value);
        },
      });
  }

  ngAfterViewInit(): void {
    this.disabled.set(this.formFieldControl.disabled)
    this.existingValue.set(this.formFieldControl.value);
    setTimeout(() => {
      this.formFieldControl.updateValueAndValidity();
    });
  }

  getDisplayLabel(option: any) {
    return this.sharedUtilityService.getDisplayLabel(option, this.element());
  }

  onChange($event: MatCheckboxChange, option: any) {
    const isChecked = $event.checked;
    if (isChecked) {
      this.add(option);
    } else {
      this.remove(option);
    }
  }

  add(value: any) {
    if (!value) return;
    const chips = this.formFieldControl.value ? [...this.formFieldControl?.value, value] : [value];
    this.updateControl(chips);
  }

  remove(value: any) {
    const arr = this.formFieldControl.value;
    const index = arr.indexOf(value);
    if (index >= 0) {
      arr.splice(index, 1);
      this.updateControl(arr);
    }
  }

  updateControl(values: any[]) {
    this.formFieldControl.setValue(values);
    this.formFieldControl.markAsTouched();
    this.formFieldControl.markAsDirty();
    this.formFieldControl.updateValueAndValidity();
    this.change.emit(this.formFieldControl.value);
  }

  ngOnDestroy(): void {
    this.existingValue.set('');
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
