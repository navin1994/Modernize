import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
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
export class TextElementComponent implements OnInit {
  element = input<ReferenceTextAttribute>();
  formGroup = input<UntypedFormGroup | undefined>();
  text = signal<string | undefined>("");

  ngOnInit(): void {
    this.formGroup()?.valueChanges.subscribe((change) => {
      this.text.set(
        this.element()?.text.replace(/{{(.*?)}}/g, (_, key) => {
          const path = key.trim().split(".");
          let value = this.formGroup()?.getRawValue();

          for (const part of path) {
            value = value?.[part];
            if (value === undefined || value === null) return "";
          }

          return isEmptyArray(value) ? '' : JSON.stringify(value)?.replace(/^"(.*)"$/, '$1');
        })
      );
    });
  }
}
