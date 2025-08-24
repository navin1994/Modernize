import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WindowContainerComponent } from './components/window-system/components/window-container/window-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WindowContainerComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Modernize Angular Admin Template';
}
