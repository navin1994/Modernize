import { Injectable, ComponentRef, ViewContainerRef, Type, signal, computed, DestroyRef, inject } from '@angular/core';
import { Subject, Observable, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { 
  WindowConfig, 
  WindowState, 
  WindowPosition, 
  WindowResult, 
  DynamicComponentInterface 
} from '../models/window.interface';

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private readonly destroyRef = inject(DestroyRef);
  
  // Modern Angular signals for reactive state management
  private windowsMap = signal(new Map<string, WindowState>());
  private currentZIndex = signal(1000);

  // Computed signals for derived state
  public readonly windows = computed(() => 
    Array.from(this.windowsMap().values()).sort((a, b) => a.zIndex - b.zIndex)
  );
  
  public readonly visibleWindows = computed(() => 
    this.windows().filter(w => w.isVisible && !w.isMinimized)
  );
  
  public readonly minimizedWindows = computed(() => 
    this.windows().filter(w => w.isMinimized)
  );
  
  public readonly hasActiveWindows = computed(() => 
    this.windows().length > 0
  );

  private windowResults = new Map<string, Subject<WindowResult>>();

  // Default configuration
  private readonly defaultConfig: Partial<WindowConfig> = {
    width: '80%',
    height: '70%',
    minWidth: 300,
    minHeight: 200,
    resizable: true,
    draggable: true,
    closable: true,
    minimizable: true,
    position: { x: 100, y: 100 }
  };

  /**
   * Open a new window with the specified component
   */
  openWindow<T>(config: WindowConfig): Observable<WindowResult> {
    // Generate unique ID if not provided
    if (!config.id) {
      config.id = this.generateWindowId();
    }

    const currentWindows = this.windowsMap();
    
    // Check if window already exists
    if (currentWindows.has(config.id)) {
      this.focusWindow(config.id);
      return this.windowResults.get(config.id)!.asObservable();
    }

    // Merge with default config
    const finalConfig = { ...this.defaultConfig, ...config };

    // Calculate initial position (cascade windows)
    const position = this.calculateInitialPosition(finalConfig.position);

    // Calculate initial size
    const size = this.calculateInitialSize(finalConfig.width, finalConfig.height);

    // Create window state
    const newZIndex = this.currentZIndex() + 1;
    this.currentZIndex.set(newZIndex);
    
    const windowState: WindowState = {
      id: config.id,
      title: finalConfig.title!,
      isMinimized: false,
      isMaximized: false,
      isVisible: true,
      zIndex: newZIndex,
      position,
      size,
      component: finalConfig.component!,
      data: finalConfig.data,
      config: finalConfig
    };

    // Update windows map
    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      newWindows.set(config.id, windowState);
      return newWindows;
    });

    // Create result subject
    const resultSubject = new Subject<WindowResult>();
    this.windowResults.set(config.id, resultSubject);

    return resultSubject.asObservable().pipe(
      takeUntilDestroyed(this.destroyRef)
    );
  }

  /**
   * Close a window
   */
  closeWindow(windowId: string, data?: any): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    // Emit result
    const resultSubject = this.windowResults.get(windowId);
    if (resultSubject) {
      resultSubject.next({ action: 'close', data });
      resultSubject.complete();
      this.windowResults.delete(windowId);
    }

    // Remove window
    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      newWindows.delete(windowId);
      return newWindows;
    });
  }

  /**
   * Minimize a window
   */
  minimizeWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        newWindows.set(windowId, {
          ...windowState,
          isMinimized: true,
          isVisible: false
        });
      }
      return newWindows;
    });

    // Emit minimize event
    const resultSubject = this.windowResults.get(windowId);
    if (resultSubject) {
      resultSubject.next({ action: 'minimize' });
    }
  }

  /**
   * Maximize or restore a window
   */
  maximizeWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        const isCurrentlyMaximized = windowState.isMaximized;
        
        if (isCurrentlyMaximized) {
          // Restore to previous size and position
          newWindows.set(windowId, {
            ...windowState,
            isMaximized: false,
            size: windowState.previousSize || windowState.size,
            position: windowState.previousPosition || windowState.position
          });
        } else {
          // Maximize: save current state and set to full size
          const containerWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth - 40 : 1200;
          const containerHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight - 80 : 800;
          
          newWindows.set(windowId, {
            ...windowState,
            isMaximized: true,
            previousSize: windowState.size,
            previousPosition: windowState.position,
            size: { width: containerWidth, height: containerHeight },
            position: { x: 20, y: 20 }
          });
        }
      }
      return newWindows;
    });

    // Emit maximize/restore event
    const resultSubject = this.windowResults.get(windowId);
    if (resultSubject) {
      resultSubject.next({ 
        action: window.isMaximized ? 'restore' : 'maximize' 
      });
    }
  }

  /**
   * Restore a minimized window
   */
  restoreWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        const newZIndex = this.currentZIndex() + 1;
        this.currentZIndex.set(newZIndex);
        newWindows.set(windowId, {
          ...windowState,
          isMinimized: false,
          isVisible: true,
          zIndex: newZIndex
        });
      }
      return newWindows;
    });
  }

  /**
   * Focus a window (bring to front)
   */
  focusWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    if (window.isMinimized) {
      this.restoreWindow(windowId);
    } else {
      this.windowsMap.update(windows => {
        const newWindows = new Map(windows);
        const windowState = newWindows.get(windowId);
        if (windowState) {
          const newZIndex = this.currentZIndex() + 1;
          this.currentZIndex.set(newZIndex);
          newWindows.set(windowId, {
            ...windowState,
            zIndex: newZIndex
          });
        }
        return newWindows;
      });
    }
  }

  /**
   * Center window on screen and bring to front (for taskbar clicks)
   */
  centerAndFocusWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    // Calculate center position
    const screenWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1200;
    const screenHeight = typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 800;
    const centerX = Math.max(0, (screenWidth - window.size.width) / 2);
    const centerY = Math.max(0, (screenHeight - window.size.height) / 2);

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        const newZIndex = this.currentZIndex() + 1;
        this.currentZIndex.set(newZIndex);
        newWindows.set(windowId, {
          ...windowState,
          isMinimized: false,
          isVisible: true,
          zIndex: newZIndex,
          position: { x: centerX, y: centerY }
        });
      }
      return newWindows;
    });
  }

  /**
   * Update window position
   */
  updateWindowPosition(windowId: string, position: WindowPosition): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        newWindows.set(windowId, { ...windowState, position });
      }
      return newWindows;
    });
  }

  /**
   * Update window size
   */
  updateWindowSize(windowId: string, size: { width: number; height: number }): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        newWindows.set(windowId, { ...windowState, size });
      }
      return newWindows;
    });
  }

  /**
   * Close all windows
   */
  closeAllWindows(): void {
    const windowIds = Array.from(this.windowsMap().keys());
    windowIds.forEach(id => this.closeWindow(id));
  }

  // Private helper methods
  private generateWindowId(): string {
    return 'window_' + Math.random().toString(36).substr(2, 9);
  }

  private calculateInitialPosition(preferredPosition?: WindowPosition): WindowPosition {
    if (preferredPosition) {
      return preferredPosition;
    }

    // Cascade windows
    const openWindows = this.visibleWindows().length;
    const offset = openWindows * 30;
    
    return {
      x: 100 + offset,
      y: 100 + offset
    };
  }

  private calculateInitialSize(width?: number | string, height?: number | string): { width: number; height: number } {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate width
    let calculatedWidth: number;
    if (typeof width === 'string' && width.includes('%')) {
      const percentage = parseInt(width.replace('%', '')) / 100;
      calculatedWidth = Math.min(screenWidth * percentage, screenWidth * 0.9);
    } else if (typeof width === 'number') {
      calculatedWidth = Math.min(width, screenWidth * 0.9);
    } else {
      calculatedWidth = screenWidth * 0.8; // default 80%
    }

    // Calculate height
    let calculatedHeight: number;
    if (typeof height === 'string' && height.includes('%')) {
      const percentage = parseInt(height.replace('%', '')) / 100;
      calculatedHeight = Math.min(screenHeight * percentage, screenHeight * 0.9);
    } else if (typeof height === 'number') {
      calculatedHeight = Math.min(height, screenHeight * 0.9);
    } else {
      calculatedHeight = screenHeight * 0.7; // default 70%
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight
    };
  }

  private implementsDynamicInterface(instance: any): instance is DynamicComponentInterface {
    return instance && typeof instance === 'object';
  }
}
