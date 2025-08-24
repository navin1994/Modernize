import { 
  Component, 
  OnInit, 
  ChangeDetectionStrategy,
  inject,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WindowManagerService } from '../../services/window-manager.service';
import { DynamicWindowComponent } from '../dynamic-window/dynamic-window.component';
import { WindowTaskbarComponent } from '../taskbar/window-taskbar.component';
import { WindowState, WindowPosition } from '../../models/window.interface';

@Component({
  selector: 'app-window-container',
  standalone: true,
  imports: [
    CommonModule,
    DynamicWindowComponent,
    WindowTaskbarComponent
  ],
  templateUrl: './window-container.component.html',
  styleUrls: ['./window-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowContainerComponent implements OnInit {
  // Modern dependency injection
  protected readonly windowManager = inject(WindowManagerService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // Auto-cleanup is handled by takeUntilDestroyed
  }

  onWindowClose(windowId: string): void {
    this.windowManager.closeWindow(windowId);
  }

  onWindowMinimize(windowId: string): void {
    this.windowManager.minimizeWindow(windowId);
  }

  onWindowMaximize(windowId: string): void {
    this.windowManager.maximizeWindow(windowId);
  }

  onWindowFocus(windowId: string): void {
    this.windowManager.focusWindow(windowId);
  }

  onPositionChange(event: { id: string; position: WindowPosition }): void {
    this.windowManager.updateWindowPosition(event.id, event.position);
  }

  onSizeChange(event: { id: string; size: { width: number; height: number } }): void {
    this.windowManager.updateWindowSize(event.id, event.size);
  }

  onRestoreWindow(windowId: string): void {
    this.windowManager.restoreWindow(windowId);
  }

  onCenterAndFocusWindow(windowId: string): void {
    this.windowManager.centerAndFocusWindow(windowId);
  }

  onTaskbarClose(windowId: string): void {
    this.windowManager.closeWindow(windowId);
  }
}
