import { AfterViewInit, Component, input, Input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { EditorModule, TINYMCE_SCRIPT_SRC} from '@tinymce/tinymce-angular';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rich-text-editor[formFieldControl]',
  standalone: true,
  imports: [EditorModule],
  providers: [{provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'}],
  templateUrl: './rich-text-editor.component.html',
  styleUrl: './rich-text-editor.component.scss'
})
export class RichTextEditorComponent implements OnInit, AfterViewInit, OnDestroy{
  private destroyed$ = new ReplaySubject(1);
  @Input() formFieldControl?: UntypedFormControl;
  isDisabled = input<boolean>(false);
  existingValue = signal('');
  initEditor = signal(false);
  blur = output<any>();

  ngOnInit(): void {
    this.formFieldControl?.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (value: string) => {
          this.existingValue.set(value);
        },
      });
  }

  ngAfterViewInit(): void {
    this.existingValue.set(this.formFieldControl?.value);
    this.initEditor.set(true);
    setTimeout(( )=> {
      this.formFieldControl?.updateValueAndValidity();
    });
  }

  updateContent(tinyMce: any) {
    if (!this.formFieldControl) return;
    const htmlContent = tinyMce.editor.getContent().replace(/^<p>|<\/p>$/g, ''); // Remove <p> tag
    this.formFieldControl.setValue(htmlContent);
    this.formFieldControl.markAsTouched();
    this.formFieldControl.markAsDirty();
    this.formFieldControl.updateValueAndValidity();
    this.blur.emit(htmlContent);
  }

  ngOnDestroy(): void {
    this.existingValue.set('');
    this.destroyed$.next(true);
    this.destroyed$.unsubscribe();
  }

}
