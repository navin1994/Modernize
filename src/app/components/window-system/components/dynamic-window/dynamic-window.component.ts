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
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
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
    CdkDrag,
    CdkDragHandle,
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

  @ViewChild('windowElement', { static: true }) windowElement!: ElementRef<HTMLElement>;
  @ViewChild('titleBar', { static: true }) titleBar!: ElementRef<HTMLElement>;
  @ViewChild('contentContainer', { static: false, read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  @ViewChild(CdkDrag, { static: true }) cdkDrag!: CdkDrag;

  private readonly destroyRef = inject(DestroyRef);
  
  private isResizing = signal(false);
  private resizeDirection = signal('');
  private initialMousePos = signal({ x: 0, y: 0 });
  private initialWindowSize = signal({ width: 0, height: 0 });
  private initialWindowPos = signal({ x: 0, y: 0 });
  // Component reference signal - public for template access
  componentRef = signal<ComponentRef<any> | null>(null);
  private dragStartPosition = signal<WindowPosition>({ x: 0, y: 0 });
  private isDragging = signal(false);

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
      
      // Reset CDK drag position when window position changes externally (but not during dragging)
      if (changes['windowState'].currentValue?.position && 
          changes['windowState'].previousValue?.position &&
          !this.isDragging() && 
          this.cdkDrag) {
        
        const prevPos = changes['windowState'].previousValue.position;
        const currPos = changes['windowState'].currentValue.position;
        
        // Check if position actually changed
        if (prevPos.x !== currPos.x || prevPos.y !== currPos.y) {
          // Reset the CDK drag to sync with the new position
          setTimeout(() => {
            if (this.cdkDrag) {
              this.cdkDrag.reset();
            }
          });
        }
      }
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
      
      // Always try to set windowData directly
      if (componentRef.instance && this.windowState().data) {
        componentRef.instance.windowData = this.windowState().data;
      }
      
      // Trigger change detection
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
    if (currentComponent && this.implementsDynamicInterface(currentComponent.instance)) {
      currentComponent.instance.windowData = this.windowState().data;
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

  onDragMoved(event: any): void {
    // Get the current position from CDK drag
    const cdkPosition = event.source.getFreeDragPosition();
    const basePosition = this.dragStartPosition();
    
    const position: WindowPosition = {
      x: basePosition.x + cdkPosition.x,
      y: basePosition.y + cdkPosition.y
    };
    
    this.positionChange.emit({ 
      id: this.windowState().id, 
      position 
    });
  }

  onDragStarted(): void {
    // Store the starting position when drag begins
    this.dragStartPosition.set({ ...this.windowState().position });
    this.isDragging.set(true);
    
    // Add dragging class to disable transitions
    this.windowElement.nativeElement.classList.add('cdk-drag-dragging');
  }

  onDragEnded(): void {
    this.isDragging.set(false);
    
    // Remove dragging class to re-enable transitions
    this.windowElement.nativeElement.classList.remove('cdk-drag-dragging');
  }

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
