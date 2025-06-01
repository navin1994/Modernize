import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { MatCardModule } from "@angular/material/card";
import { FieldSelectorComponent } from "../field-selector/field-selector.component";
import {
  ActionButton,
  ElementLayoutData,
  FormConfig,
} from "src/app/models/ui-form-config.interface";
import { EDITABLE_LOGIC, UNSAVED, VISIBILITY } from "src/app/models/constants";
import { areObjectsSame } from "src/app/utility/utility";
import { CommonModule } from "@angular/common";
import { TextElementComponent } from "./form-elements/text-element/text-element.component";
import { ActionButtonComponent } from "./form-elements/action-buttons/action-buttons.component";
import { ToastrService } from "ngx-toastr";
import { ConfigBuilderService } from "../config-builder.service";

@Component({
  selector: "app-form-layout",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatCardModule,
    FieldSelectorComponent,
    TextElementComponent,
    ActionButtonComponent,
  ],
  templateUrl: "./form-layout.component.html",
  styleUrl: "./form-layout.component.scss",
})
export class FormLayoutComponent implements OnInit, OnChanges {
  @Input({ required: true }) formGroup: UntypedFormGroup;
  @Input({ required: true }) config!: FormConfig;
  @Input() status = UNSAVED;
  private toaster = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private configBuilderService = inject(ConfigBuilderService);

  // Signals for visibility layers and previous form value
  visibleLayers = signal<ElementLayoutData[][]>([]);
  previousValues = signal({});
  visibleActionButton = signal<ActionButton[]>([]);
  isFormSubmitted = signal<boolean>(false);

  ngOnInit(): void {
    this.visibleLayers.set(this.config.ui.elementsLayout);
    this.isFormSubmitted.set(!this.config.ui.references.showErrorAfterSubmit);
    this.updateAccessControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["config"] && changes["config"]?.currentValue) {
      this.configBuilderService.setCustomValidations(
        this.formGroup,
        changes["config"]?.currentValue,
        this.status
      );
    }
  }

  updateAccessControl(): void {
    if (areObjectsSame(this.previousValues(), this.formGroup.getRawValue()))
      return;
    if (this.status !== UNSAVED) this.formGroup.disable();
    this.previousValues.set(this.formGroup.getRawValue());
    let layers = this.config.ui.elementsLayout;
    const { attributes } = this.config.ui.references;
    const { textAttributes } = this.config.ui.paragraphs;
    const actionBtns = this.config.ui?.actions?.buttons;

    for (const id in attributes) {
      const { result: isNotVisible } =
        this.configBuilderService.computeAccessControl(
          VISIBILITY,
          attributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      const { result: isNotEditable } =
        this.configBuilderService.computeAccessControl(
          EDITABLE_LOGIC,
          attributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      if (isNotVisible)
        layers = this.configBuilderService.removeAttributeAndCleanup(
          layers,
          id,
          this.formGroup
        );
      if (!isNotEditable) this.formGroup.get(id)?.enable();
    }
    for (const id in textAttributes) {
      const { result: isTextNotVisible } =
        this.configBuilderService.computeAccessControl(
          VISIBILITY,
          textAttributes,
          id,
          this.config,
          this.formGroup,
          this.status
        );
      if (isTextNotVisible)
        layers = this.configBuilderService.removeAttributeAndCleanup(
          layers,
          id,
          this.formGroup
        );
    }
    if (actionBtns?.length) {
      this.visibleActionButton.update(() =>
        actionBtns?.filter((btn: ActionButton, index: number) => {
          const { result } = this.configBuilderService.computeAccessControl(
            VISIBILITY,
            actionBtns,
            index,
            this.config,
            this.formGroup,
            this.status
          );
          return !result;
        })
      );
    }

    this.visibleLayers.update(() => [...layers]);
  }

  isLayerVisible(layer: ElementLayoutData[]): boolean {
    return !!layer.find((element) =>
      this.visibleLayers()?.flat()?.includes(element)
    );
  }

  submit({
    nextStatus,
    runValidation,
    api,
  }: {
    nextStatus: string | undefined;
    runValidation: boolean | undefined;
    api: string | undefined;
  }) {
    console.log("formData", this.formGroup.getRawValue());
    if (!this.isFormSubmitted()) this.isFormSubmitted.set(true);
    if (runValidation && this.formGroup.invalid) {
      this.toaster.error("Invalid form details");
      return;
    }
  }
}
