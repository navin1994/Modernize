import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  Renderer2,
  signal,
} from '@angular/core';
import * as _moment from 'moment';

const moment = _moment;

@Directive({
  selector: '[appDateFormat]',
  standalone: true,
})
export class AppDateFormatDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);
  private readonly defaultFormat = signal('DD-MM-YYYY');
  readonly appDateFormat = input<string|undefined>(this.defaultFormat());

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    this.formatDate();
  }

  @HostListener('dateInput', ['$event'])
  onDateInput(event: Event): void {
    this.formatDate();
  }

  formatDate() {
    const raw = this.el.nativeElement.value;
    const parsed = moment(raw).format(this.appDateFormat());
    this.renderer.setProperty(this.el.nativeElement, 'value', parsed);
  }
}
