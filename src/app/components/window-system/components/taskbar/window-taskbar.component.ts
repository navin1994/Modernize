import { Component, ChangeDetectionStrategy, input, output, ViewChild, ElementRef, AfterViewInit, OnDestroy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WindowState } from '../../models/window.interface';

@Component({
  selector: 'app-window-taskbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './window-taskbar.component.html',
  styleUrl: './window-taskbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WindowTaskbarComponent implements AfterViewInit, OnDestroy {
  // Modern Angular inputs/outputs
  allWindows = input<WindowState[]>([]);
  
  restoreWindow = output<string>();
  centerAndFocusWindow = output<string>();
  closeWindow = output<string>();

  @ViewChild('taskbarElement', { static: false }) taskbarElement!: ElementRef<HTMLElement>;

  // Signals for scroll state
  canScrollLeft = signal(false);
  canScrollRight = signal(false);

  private resizeObserver?: ResizeObserver;
  private scrollTimeout?: number;

  constructor() {
    // Effect to check scroll state when windows change
    effect(() => {
      this.allWindows();
      // Use setTimeout to ensure DOM is updated
      setTimeout(() => this.checkScrollState(), 0);
    });
  }

  ngAfterViewInit(): void {
    this.setupScrollListeners();
    this.checkScrollState();
  }

  ngOnDestroy(): void {
    this.cleanupListeners();
  }

  private setupScrollListeners(): void {
    if (this.taskbarElement) {
      const element = this.taskbarElement.nativeElement;
      
      // Listen to scroll events
      element.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
      
      // Listen to resize events to update scroll state
      this.resizeObserver = new ResizeObserver(() => {
        this.checkScrollState();
      });
      this.resizeObserver.observe(element);
    }
  }

  private cleanupListeners(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private onScroll(): void {
    // Debounce scroll events for better performance
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    this.scrollTimeout = window.setTimeout(() => {
      this.checkScrollState();
    }, 10);
  }

  private checkScrollState(): void {
    if (!this.taskbarElement) return;

    const element = this.taskbarElement.nativeElement;
    const { scrollLeft, scrollWidth, clientWidth } = element;

    this.canScrollLeft.set(scrollLeft > 0);
    this.canScrollRight.set(scrollLeft < scrollWidth - clientWidth - 1); // -1 for rounding
  }

  onTaskbarItemClick(windowId: string, window: WindowState): void {
    if (window.isMinimized) {
      this.restoreWindow.emit(windowId);
    } else {
      this.centerAndFocusWindow.emit(windowId);
    }
  }

  onTaskbarClose(event: Event, windowId: string): void {
    event.stopPropagation();
    this.closeWindow.emit(windowId);
  }

  getTruncatedTitle(title: string, maxLength: number = 20): string {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  }
}
