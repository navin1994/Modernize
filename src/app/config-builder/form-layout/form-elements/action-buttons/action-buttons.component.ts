import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, Signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActionButton, Justification } from "src/app/models/ui-form-config.interface";


@Component({
  selector: "app-action-buttons",
  templateUrl: "./action-buttons.component.html",
  styleUrl: "./action-buttons.component.scss",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule,CommonModule, MatIconModule, MatTooltipModule],
})

export class ActionButtonComponent {
    buttonsConfig = input<{justification: Justification, buttons: Signal<ActionButton[]>}>();
}