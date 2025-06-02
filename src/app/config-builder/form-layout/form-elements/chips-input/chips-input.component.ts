import { AfterViewInit, Component, input, Input, OnDestroy, OnInit, output, signal } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { FormControl, ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { combineLatest, ReplaySubject, takeUntil } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { SanitizeTrustedHtmlPipe } from "src/app/pipes/sanitize-trusted-html.pipe";
import { ReferenceAttribute } from "src/app/models/ui-form-config.interface";
import { MatMenuModule } from "@angular/material/menu";



@Component({
    selector: 'mat-chips-input',
    standalone: true,
    templateUrl: './chips-input.component.html',
    styleUrl: './chips-input.component.scss',
    imports: [MatChipsModule, MatIconModule, MatFormFieldModule, SanitizeTrustedHtmlPipe, ReactiveFormsModule, MatMenuModule],
})
export class ChipsInputComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroyed$ = new ReplaySubject(1);
    @Input() formFieldControl: UntypedFormControl;
    placeholder = input('');
    separatorKeysCodes = signal([ENTER, COMMA] as const);
    existingValue = signal('');
    disabled = signal<boolean>(false);
    change = output<any>();
    element = input.required<ReferenceAttribute>();
    isSubmitted = input(false);

    ngOnInit(): void {
        this.disabled.set(this.formFieldControl.disabled);
        combineLatest([
            this.formFieldControl.valueChanges,
            this.formFieldControl.statusChanges
        ])
            .pipe(takeUntil(this.destroyed$))
            .subscribe(([value, status]) => {
                this.existingValue.set(value);
                this.disabled.set(this.formFieldControl.disabled); // see next step
            });

    }

    ngAfterViewInit(): void {
        this.disabled.set(this.formFieldControl.disabled);
        this.existingValue.set(this.formFieldControl.value);
        setTimeout(() => {
            this.formFieldControl.updateValueAndValidity();
        });
    }

    remove(chip: any): void {
        const chips = this.formFieldControl.value;
        const index = chips.indexOf(chip);
        if (index >= 0) {
            chips.splice(index, 1);
            this.updateControl(chips);
        }
    }

    edit(chip: any, event: MatChipEditedEvent) {
        const value = event.value.trim();
        // Remove chip if it no longer has a name
        if (!value) {
            this.remove(chip);
            return;
        }

        // Edit existing chips
        const chips = this.formFieldControl.value;
        const index = chips?.indexOf(chip);
        if (index >= 0) {
            chips[index] = value;
            this.updateControl(chips);
        }
    }

    addChipInputValue(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();
        if (value) {
            const chips = this.formFieldControl.value ? [...this.formFieldControl?.value, value] : [value];
            this.updateControl(chips);
        }
        event.chipInput!.clear();
    }

    updateControl(chips: any[]) {
        this.formFieldControl.setValue(chips);
        this.formFieldControl.markAsTouched();
        this.formFieldControl.markAsDirty();
        this.formFieldControl.updateValueAndValidity();
        this.change.emit(this.formFieldControl?.value);
    }

    ngOnDestroy(): void {
        this.existingValue.set('');
        this.destroyed$.next(true);
        this.destroyed$.unsubscribe();
    }

}