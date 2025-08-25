import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
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
  private currentZIndex = signal(2000); // Start at 2000 to leave room for UI elements

  // Z-index constants for different layers
  private readonly Z_INDEX_LAYERS = {
    WINDOWS_BASE: 2000,        // Base z-index for windows
    TASKBAR: 9000,             // Taskbar always on top
    MODAL_OVERLAY: 10000       // For future modal overlays
  } as const;

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

  // Public getter for current max z-index (useful for other UI components)
  public readonly maxWindowZIndex = computed(() => this.currentZIndex());

  private windowResults = new Map<string, Subject<WindowResult>>();

  // Cached screen dimensions for performance
  private screenDimensions = computed(() => ({
    width: typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1200,
    height: typeof globalThis.window !== 'undefined' ? globalThis.window.innerHeight : 800
  }));

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

  // === CORE WINDOW OPERATIONS ===

  /**
   * Generic window state updater - reduces repetitive code
   */
  private updateWindow(windowId: string, updates: Partial<WindowState>, emitResult?: WindowResult): boolean {
    const window = this.windowsMap().get(windowId);
    if (!window) return false;

    this.windowsMap.update(windows => {
      const newWindows = new Map(windows);
      const windowState = newWindows.get(windowId);
      if (windowState) {
        newWindows.set(windowId, { ...windowState, ...updates });
      }
      return newWindows;
    });

    // Emit result if provided
    if (emitResult) {
      const resultSubject = this.windowResults.get(windowId);
      if (resultSubject) {
        resultSubject.next(emitResult);
      }
    }

    return true;
  }

  /**
   * Get next z-index and increment counter
   */
  private getNextZIndex(): number {
    const newZIndex = this.currentZIndex() + 1;
    this.currentZIndex.set(newZIndex);
    return newZIndex;
  }

  /**
   * Calculate optimal center position with constraints
   */
  private calculateCenterPosition(windowSize: { width: number; height: number }): WindowPosition {
    const screen = this.screenDimensions();
    const minMargin = 20;
    const maxX = screen.width - windowSize.width - minMargin;
    const maxY = screen.height - windowSize.height - minMargin;
    
    return {
      x: Math.max(minMargin, Math.min(maxX, (screen.width - windowSize.width) / 2)),
      y: Math.max(minMargin, Math.min(maxY, (screen.height - windowSize.height) / 2))
    };
  }

  /**
   * Open a new window with the specified component
   */
  openWindow<T>(config: WindowConfig): Observable<WindowResult> {
    // Generate unique ID if not provided
    config.id = config.id || this.generateWindowId();

    const currentWindows = this.windowsMap();
    
    // Check if window already exists
    if (currentWindows.has(config.id)) {
      this.focusWindow(config.id);
      return this.windowResults.get(config.id)!.asObservable();
    }

    // Merge with default config and calculate properties
    const finalConfig = { ...this.defaultConfig, ...config };
    const position = this.calculateInitialPosition(finalConfig.position);
    const size = this.calculateInitialSize(finalConfig.width, finalConfig.height);
    
    const windowState: WindowState = {
      id: config.id,
      title: finalConfig.title!,
      isMinimized: false,
      isMaximized: false,
      isCentered: false,
      isVisible: true,
      zIndex: this.getNextZIndex(),
      position,
      size,
      component: finalConfig.component!,
      data: finalConfig.data,
      config: finalConfig
    };

    // Update windows map
    this.windowsMap.update(windows => new Map(windows).set(config.id, windowState));

    // Create and return result subject
    const resultSubject = new Subject<WindowResult>();
    this.windowResults.set(config.id, resultSubject);

    return resultSubject.asObservable().pipe(takeUntilDestroyed(this.destroyRef));
  }

  /**
   * Close a window
   */
  closeWindow(windowId: string, data?: any): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    // Emit result and cleanup
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
    this.updateWindow(windowId, {
      isMinimized: true,
      isCentered: false,
      isVisible: false
    }, { action: 'minimize' });
  }

  /**
   * Maximize or restore a window
   */
  maximizeWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    const screen = this.screenDimensions();
    const margin = 20;
    const isCurrentlyMaximized = window.isMaximized;
    
    const updates: Partial<WindowState> = isCurrentlyMaximized 
      ? {
          // Restore
          isMaximized: false,
          isCentered: false,
          size: window.previousSize || window.size,
          position: window.previousPosition || window.position
        }
      : {
          // Maximize
          isMaximized: true,
          isCentered: false,
          previousSize: window.size,
          previousPosition: window.position,
          size: { 
            width: screen.width - (margin * 2), 
            height: screen.height - (margin * 2) 
          },
          position: { x: margin, y: margin }
        };

    this.updateWindow(windowId, updates, {
      action: isCurrentlyMaximized ? 'restore' : 'maximize'
    });
    
    this.focusWindow(windowId);
  }

  /**
   * Center and focus a window (convenience method for taskbar clicks)
   */
  centerAndFocusWindow(windowId: string): void {
    const window = this.windowsMap().get(windowId);
    if (!window) return;

    // If window is maximized or minimized, restore it first
    if (window.isMaximized || window.isMinimized) {
      return;
    } else {
      // Just center the window at its current size
      this.updateWindow(windowId, {
        isCentered: true,
        position: this.calculateCenterPosition(window.size)
      }, { action: 'center' });
    }
    
    this.focusWindow(windowId);
  }

  /**
   * Restore a minimized window
   */
  restoreWindow(windowId: string): void {
    this.updateWindow(windowId, {
      isMinimized: false,
      isCentered: false,
      isVisible: true,
      zIndex: this.getNextZIndex()
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
      this.updateWindow(windowId, { zIndex: this.getNextZIndex() });
    }
  }

  /**
   * Update window position
   */
  updateWindowPosition(windowId: string, position: WindowPosition): void {
    this.updateWindow(windowId, { position });
  }

  /**
   * Update window size
   */
  updateWindowSize(windowId: string, size: { width: number; height: number }): void {
    this.updateWindow(windowId, { size });
  }

  /**
   * Update window state with partial changes
   */
  updateWindowState(windowId: string, changes: Partial<WindowState>): void {
    this.updateWindow(windowId, changes);
  }

  /**
   * Close all windows
   */
  closeAllWindows(): void {
    const windowIds = Array.from(this.windowsMap().keys());
    windowIds.forEach(id => this.closeWindow(id));
  }

  // === PRIVATE HELPER METHODS ===

  private generateWindowId(): string {
    return 'window_' + Math.random().toString(36).substr(2, 9);
  }

  private calculateInitialPosition(preferredPosition?: WindowPosition): WindowPosition {
    if (preferredPosition) {
      // Validate and constrain preferred position to screen bounds
      const screen = this.screenDimensions();
      const minMargin = 20;
      
      return {
        x: Math.max(minMargin, Math.min(preferredPosition.x, screen.width - 300 - minMargin)),
        y: Math.max(minMargin, Math.min(preferredPosition.y, screen.height - 200 - minMargin))
      };
    }

    // Cascade windows with better spacing
    const openWindows = this.visibleWindows().length;
    const offset = (openWindows % 10) * 40; // Reset offset every 10 windows to prevent going off-screen
    const baseX = 60;
    const baseY = 60;
    
    return { x: baseX + offset, y: baseY + offset };
  }

  private calculateInitialSize(width?: number | string, height?: number | string): { width: number; height: number } {
    const screen = this.screenDimensions();
    
    // Account for margins and ensure windows don't exceed screen bounds
    const maxWidth = screen.width - 40; // 20px margin on each side
    const maxHeight = screen.height - 80; // 40px margin top/bottom for taskbar/decorations

    // Calculate dimensions with a reusable function
    const calculateDimension = (dimension: number | string | undefined, screenSize: number, maxSize: number, defaultPercent: number): number => {
      if (typeof dimension === 'string' && dimension.includes('%')) {
        const percentage = parseInt(dimension.replace('%', '')) / 100;
        return Math.min(screenSize * percentage, maxSize);
      } else if (typeof dimension === 'number') {
        return Math.min(dimension, maxSize);
      } else {
        return Math.min(screenSize * defaultPercent, maxSize);
      }
    };

    const calculatedWidth = calculateDimension(width, screen.width, maxWidth, 0.8);
    const calculatedHeight = calculateDimension(height, screen.height, maxHeight, 0.7);

    // Ensure minimum sizes
    return {
      width: Math.max(calculatedWidth, 300),
      height: Math.max(calculatedHeight, 200)
    };
  }

  private implementsDynamicInterface(instance: any): instance is DynamicComponentInterface {
    return instance && typeof instance === 'object';
  }
}
