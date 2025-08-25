import { 
  Component, 
  ElementRef, 
  ViewChild, 
  OnInit,
  AfterViewInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
  ViewContainerRef,
  ComponentRef,
  OnChanges,
  SimpleChanges,
  inject,
  DestroyRef,
  input,
  output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WindowState, WindowPosition, DynamicComponentInterface } from '../../models/window.interface';

@Component({
  selector: 'app-dynamic-window',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './dynamic-window.component.html',
  styleUrls: ['./dynamic-window.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicWindowComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  // Modern Angular inputs/outputs
  windowState = input.required<WindowState>();
  
  windowClose = output<string>();
  windowMinimize = output<string>();
  windowMaximize = output<string>();
  windowFocus = output<string>();
  positionChange = output<{ id: string; position: WindowPosition }>();
  sizeChange = output<{ id: string; size: { width: number; height: number } }>();

  @ViewChild('windowElement', { static: false }) windowElement?: ElementRef<HTMLElement>;
  @ViewChild('contentContainer', { static: false, read: ViewContainerRef }) contentContainer!: ViewContainerRef;

  private readonly destroyRef = inject(DestroyRef);
  
  private isResizing = signal(false);
  private resizeDirection = signal('');
  private initialMousePos = signal({ x: 0, y: 0 });
  private initialWindowSize = signal({ width: 0, height: 0 });
  private initialWindowPos = signal({ x: 0, y: 0 });
  // Component reference signal - public for template access
  componentRef = signal<ComponentRef<any> | null>(null);
  
  ngOnInit(): void {
    this.setupResizeListeners();
  }

  ngAfterViewInit(): void {
    // Create dynamic component after view is initialized
    setTimeout(() => {
      this.createDynamicComponent();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['windowState'] && this.windowState()) {
      // Handle window state changes
      this.updateDynamicComponent();
    }
  }

  ngOnDestroy(): void {
    this.removeResizeListeners();
    this.destroyDynamicComponent();
  }

  private createDynamicComponent(): void {
    if (this.contentContainer && this.windowState().component) {
      // Clear any existing content first
      this.contentContainer.clear();
      
      const componentRef = this.contentContainer.createComponent(this.windowState().component);
      this.componentRef.set(componentRef);
      
      // Safe data passing: Only set inputs if data exists
      // This will gracefully handle components with or without inputs
      const windowData = this.windowState().data;
      if (windowData) {
        this.setComponentInputs(componentRef, windowData);
      } else {
        console.debug('No data provided for dynamic component - component will use default values');
      }
      
      // Trigger change detection to apply any input changes
      componentRef.changeDetectorRef.detectChanges();
      
      // Set up callbacks if component implements the interface
      if (this.implementsDynamicInterface(componentRef.instance)) {
        componentRef.instance.onWindowClose = (data?: any) => {
          this.windowClose.emit(this.windowState().id);
        };
        
        componentRef.instance.onWindowMinimize = () => {
          this.windowMinimize.emit(this.windowState().id);
        };
        
        componentRef.instance.onWindowMaximize = () => {
          this.windowMaximize.emit(this.windowState().id);
        };
      }
    }
  }

  private updateDynamicComponent(): void {
    const currentComponent = this.componentRef();
    const windowData = this.windowState().data;
    
    if (currentComponent) {
      // Only update inputs if data exists
      if (windowData) {
        this.setComponentInputs(currentComponent, windowData);
      }
      // Always trigger change detection to ensure updates are reflected
      currentComponent.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Robust data passing that safely handles:
   * 1. @Input() decorators via ComponentRef.setInput()
   * 2. input() signal functions via ComponentRef.setInput()
   * 3. Graceful handling when no inputs exist (no errors thrown)
   * 4. Backward compatibility with windowData interface
   */
  private setComponentInputs(componentRef: ComponentRef<any>, data: any): void {
    if (!data || typeof data !== 'object') {
      return; // Nothing to set
    }

    const instance = componentRef.instance;
    let inputsSet = 0;

    // Check if component has any @Input() or input() signals first
    // by introspecting the component's input definitions
    const hasInputs = this.componentHasInputs(componentRef);

    if (hasInputs && componentRef.setInput) {
      // Primary Method: Use ComponentRef.setInput() for both @Input() and input() signals
      // This is the recommended Angular approach that works with both types
      Object.keys(data).forEach(key => {
        try {
          componentRef.setInput(key, data[key]);
          inputsSet++;
          console.debug(`✓ Successfully set input '${key}' via setInput`);
        } catch (error) {
          // Input doesn't exist - this is expected and not an error
          // Silently ignore to prevent console spam
        }
      });
    } else if (!hasInputs) {
      // Component has no inputs - skip trying to set any
      console.debug('Component has no @Input() or input() declarations - skipping input assignment');
    }

    // Fallback Method: Direct property assignment for edge cases
    // Only for properties that exist and aren't functions (to avoid overwriting methods)
    if (inputsSet === 0 && hasInputs) {
      Object.keys(data).forEach(key => {
        try {
          if (key in instance && typeof instance[key] !== 'function') {
            // Check if it's a signal with set method (input() signals)
            if (instance[key] && typeof instance[key].set === 'function') {
              instance[key].set(data[key]);
              inputsSet++;
              console.debug(`✓ Set signal input '${key}' via .set() method`);
            } else {
              // Traditional property assignment
              instance[key] = data[key];
              inputsSet++;
              console.debug(`✓ Set property '${key}' via direct assignment`);
            }
          }
        } catch (error) {
          // Silently ignore assignment errors
        }
      });
    }

    // Legacy Support: Set windowData for backward compatibility
    // Only if the component has this property and no specific inputs were set
    if (inputsSet === 0 && ('windowData' in instance || instance.windowData !== undefined)) {
      try {
        instance.windowData = data;
        console.debug('✓ Set windowData for backward compatibility');
      } catch (error) {
        // Silently ignore windowData assignment errors
      }
    }

    // Log result - this helps with debugging but doesn't throw errors
    if (inputsSet > 0) {
      console.debug(`Successfully set ${inputsSet} input(s) on component`);
    } else {
      console.debug('No inputs set - component either has no inputs or data properties don\'t match input names');
    }
  }

  /**
   * Check if a component has any @Input() decorators or input() signals
   * by examining the component's input definitions
   */
  private componentHasInputs(componentRef: ComponentRef<any>): boolean {
    try {
      // Angular 16+ provides input definitions on the component type
      const componentType = componentRef.componentType as any;
      
      // Check for input definitions (Angular 16+)
      if (componentType.ɵcmp?.inputs) {
        const inputs = componentType.ɵcmp.inputs;
        return Object.keys(inputs).length > 0;
      }

      // Fallback: Check for common input properties on the instance
      const instance = componentRef.instance;
      const commonInputProps = ['title', 'data', 'value', 'config', 'windowData'];
      
      return commonInputProps.some(prop => {
        // Check if property exists and is not a method
        return prop in instance && typeof instance[prop] !== 'function';
      });
    } catch (error) {
      // If we can't determine, assume it might have inputs to be safe
      return true;
    }
  }

  private destroyDynamicComponent(): void {
    const componentRef = this.componentRef();
    if (componentRef) {
      componentRef.destroy();
      this.componentRef.set(null);
    }
  }

  private implementsDynamicInterface(instance: any): instance is DynamicComponentInterface {
    return instance && typeof instance === 'object';
  }

  onWindowClick(): void {
    this.windowFocus.emit(this.windowState().id);
  }

  // === WINDOW CONTROL HANDLERS ===
  onClose(event: Event): void {
    event.stopPropagation();
    this.windowClose.emit(this.windowState().id);
  }

  onMinimize(event: Event): void {
    event.stopPropagation();
    this.windowMinimize.emit(this.windowState().id);
  }

  onMaximize(event: Event): void {
    event.stopPropagation();
    this.windowMaximize.emit(this.windowState().id);
  }

  // === RESIZE HANDLERS ===
  startResize(event: MouseEvent, direction: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isResizing.set(true);
    this.resizeDirection.set(direction);
    this.initialMousePos.set({ x: event.clientX, y: event.clientY });
    this.initialWindowSize.set({ ...this.windowState().size });
    this.initialWindowPos.set({ ...this.windowState().position });
    
    document.body.style.cursor = this.getCursorForDirection(direction);
    document.body.style.userSelect = 'none';
  }

  private setupResizeListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private removeResizeListeners(): void {
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.isResizing()) return;

    const deltaX = event.clientX - this.initialMousePos().x;
    const deltaY = event.clientY - this.initialMousePos().y;

    const minWidth = this.windowState().config.minWidth || 300;
    const minHeight = this.windowState().config.minHeight || 200;
    const maxWidth = this.windowState().config.maxWidth || window.innerWidth * 0.9;
    const maxHeight = this.windowState().config.maxHeight || window.innerHeight * 0.9;

    let newWidth = this.initialWindowSize().width;
    let newHeight = this.initialWindowSize().height;
    let newX = this.initialWindowPos().x;
    let newY = this.initialWindowPos().y;

    switch (this.resizeDirection()) {
      case 'e':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width + deltaX));
        break;
      case 'w':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width - deltaX));
        newX = this.initialWindowPos().x + (this.initialWindowSize().width - newWidth);
        break;
      case 's':
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height + deltaY));
        break;
      case 'n':
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height - deltaY));
        newY = this.initialWindowPos().y + (this.initialWindowSize().height - newHeight);
        break;
      case 'se':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width + deltaX));
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height + deltaY));
        break;
      case 'sw':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width - deltaX));
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height + deltaY));
        newX = this.initialWindowPos().x + (this.initialWindowSize().width - newWidth);
        break;
      case 'ne':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width + deltaX));
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height - deltaY));
        newY = this.initialWindowPos().y + (this.initialWindowSize().height - newHeight);
        break;
      case 'nw':
        newWidth = Math.max(minWidth, Math.min(maxWidth, this.initialWindowSize().width - deltaX));
        newHeight = Math.max(minHeight, Math.min(maxHeight, this.initialWindowSize().height - deltaY));
        newX = this.initialWindowPos().x + (this.initialWindowSize().width - newWidth);
        newY = this.initialWindowPos().y + (this.initialWindowSize().height - newHeight);
        break;
    }

    // Update size
    this.sizeChange.emit({
      id: this.windowState().id,
      size: { width: newWidth, height: newHeight }
    });

    // Update position if changed
    if (newX !== this.initialWindowPos().x || newY !== this.initialWindowPos().y) {
      this.positionChange.emit({
        id: this.windowState().id,
        position: { x: newX, y: newY }
      });
    }
  }

  private onMouseUp(): void {
    if (this.isResizing()) {
      this.isResizing.set(false);
      this.resizeDirection.set('');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }

  private getCursorForDirection(direction: string): string {
    const cursors: { [key: string]: string } = {
      'n': 'n-resize',
      's': 's-resize',
      'e': 'e-resize',
      'w': 'w-resize',
      'ne': 'ne-resize',
      'nw': 'nw-resize',
      'se': 'se-resize',
      'sw': 'sw-resize'
    };
    return cursors[direction] || 'default';
  }
}
