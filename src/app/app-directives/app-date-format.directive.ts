import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  Renderer2,
  signal,
} from '@angular/core';
import * as _moment from 'moment';
import { DEFAULT_DATE_FORMAT } from '../models/constants';

const moment = _moment;

@Directive({
  selector: '[appDateFormat]',
  standalone: true,
})
export class AppDateFormatDirective implements OnInit{
  private el = inject(ElementRef<HTMLInputElement>);
  private renderer = inject(Renderer2);
  private readonly defaultFormat = signal(DEFAULT_DATE_FORMAT);
  readonly appDateFormat = input<string|undefined>(this.defaultFormat());

  ngOnInit(): void {
      this.formatDate();
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
    const raw = this.el.nativeElement.value;
    const parsed = moment(raw).format(this.appDateFormat());
    this.renderer.setProperty(this.el.nativeElement, 'value', parsed);
  }
}
