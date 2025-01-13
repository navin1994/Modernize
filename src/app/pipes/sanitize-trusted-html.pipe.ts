import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: "sanitizeTrustedHtml",
    standalone: true,
})
export class SanitizeTrustedHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(value: any): any {
        let strValue: string;

        if (typeof value === "string") {
            strValue = value;
        } else if (
            value &&
            typeof value.changingThisBreaksApplicationSecurity === "string"
        ) {
            // If the value is already a SafeHtmlImpl instance, return it directly
            return value;
        } else return;

        const disallowedTags =
            /<\/?((script)|(iframe)|(embed)|(object)|(applet)|(meta)|(style)|(form)|(input)|(button)|(link)|(img)|(on\w+=)|(h1)|(h2)|(h3)|(h4)|(h5)|(h6))\b.*?>/gi;

        // Strip disallowed HTML tags
        const sanitizedContent = strValue.replace(disallowedTags, "");

        // Trust the sanitized HTML
        return this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
    }
}
