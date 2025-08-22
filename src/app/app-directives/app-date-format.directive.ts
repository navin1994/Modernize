import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  OnDestroy,
  Renderer2,
  signal,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as _moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../models/constants';

const moment = _moment;

@Directive({
  selector: '[appDateFormat]',
  standalone: true,
})
export class AppDateFormatDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);
  private ngControl = inject(NgControl, { optional: true });
  private subscription?: Subscription;
  private readonly defaultFormat = signal(DEFAULT_DATE_FORMAT);
  readonly appDateFormat = input<string|undefined>(this.defaultFormat());

  ngOnInit(): void {
    this.formatDate();
    
    // Listen to form control value changes
    if (this.ngControl?.valueChanges) {
      this.subscription = this.ngControl.valueChanges.subscribe(() => {
        // Use setTimeout to ensure the DOM value is updated before formatting
        setTimeout(() => this.formatDate(), 0);
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    this.formatDate();
  }

  @HostListener('dateInput', ['$event'])
  onDateInput(event: Event): void {
    this.formatDate();
  }

  formatDate() {
    // Get value from form control if available, otherwise from DOM element
    const raw = this.ngControl?.value ?? this.el.nativeElement.value;
    if (!raw) return;
    
    const expectedFormat = this.appDateFormat();
    
    // Try to parse the date in various formats, including the expected format
    let parsedMoment = moment(raw, expectedFormat);
    
    // If that doesn't work, try parsing with moment's default parsing
    if (!parsedMoment.isValid()) {
      parsedMoment = moment(raw);
    }
    
    if (parsedMoment.isValid()) {
      const formatted = parsedMoment.format(expectedFormat);
      this.setValue(formatted);
    } else {
      // If all parsing fails, leave the original value
      this.setValue(raw);
    }
  }

  setValue(input: any) {
    this.renderer.setProperty(this.el.nativeElement, 'value', input);
  }
}
