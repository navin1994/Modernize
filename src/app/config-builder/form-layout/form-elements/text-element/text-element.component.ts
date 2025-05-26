import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { ReferenceTextAttribute } from "src/app/models/ui-form-config.interface";
import { SanitizeTrustedHtmlPipe } from "src/app/pipes/sanitize-trusted-html.pipe";

@Component({
    selector: 'app-text-element',
    templateUrl: './text-element.component.html',
    styleUrl: './text-element.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SanitizeTrustedHtmlPipe]
})
export class TextElementComponent {
    element = input<ReferenceTextAttribute>()
    fullForm = input<UntypedFormGroup | undefined>();
    text = computed(()=> {
        return this.element()?.text
    })
}