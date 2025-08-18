import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { UntypedFormArray, UntypedFormGroup } from "@angular/forms";
import { ReplaySubject, takeUntil } from "rxjs";
import { ReferenceTextAttribute } from "src/app/models/ui-form-config.interface";
import { SanitizeTrustedHtmlPipe } from "src/app/pipes/sanitize-trusted-html.pipe";
import { isEmptyArray } from "src/app/utility/utility";

@Component({
  selector: "app-text-element",
  templateUrl: "./text-element.component.html",
  styleUrl: "./text-element.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SanitizeTrustedHtmlPipe],
})
export class TextElementComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroyed$ = new ReplaySubject(1);
  element = input<ReferenceTextAttribute>();
  form = input<UntypedFormGroup | UntypedFormArray | undefined>();
  text = signal<string | undefined>("");

  ngOnInit(): void {
    this.updateText();
  }

  ngAfterViewInit(): void {
    const formInstance = this.form();
    if (formInstance instanceof UntypedFormGroup || formInstance instanceof UntypedFormArray) {
      formInstance.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((_) => {
        this.updateText();
      });
    }
  }

  updateText() {
    this.text.set(
        this.element()?.text.replace(/{{(.*?)}}/g, (_, key) => {
          const path = key.trim().split(".");
          let value = this.form()?.getRawValue();

          for (const part of path) {
            value = value?.[part];
            if (value === undefined || value === null) return "";
          }

          return isEmptyArray(value) ? '' : JSON.stringify(value)?.replace(/^"(.*)"$/, '$1');
        })
      );
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }
}
