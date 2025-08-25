import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { WindowManagerService } from '../../components/window-system/services/window-manager.service';
import { TestWindowComponent } from '../../components/test-window/test-window.component';
import { EnhancedTestWindowComponent } from '../../components/enhanced-test-window/enhanced-test-window.component';
import { SimpleTestWindowComponent } from '../../components/simple-test-window/simple-test-window.component';
import { DiscloseFormComponent } from '../../disclosures/disclose-form/disclose-form.component';

@Component({
  selector: 'app-window-demo',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="window-demo-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>window</mat-icon>
            Dynamic Window System Demo
          </mat-card-title>
          <mat-card-subtitle>
            Test the window management system with drag, resize, minimize, and multiple windows
          </mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="demo-section">
            <h3>Basic Window Operations</h3>
            <div class="button-group">
              <button mat-raised-button color="primary" (click)="openTestWindow()">
                <mat-icon>add</mat-icon>
                Open Test Window
              </button>
              
              <button mat-raised-button color="accent" (click)="openDiscloseForm()">
                <mat-icon>assignment</mat-icon>
                Open Disclose Form
              </button>
              
              <button mat-raised-button color="warn" (click)="openMultipleWindows()">
                <mat-icon>view_module</mat-icon>
                Open Multiple Windows
              </button>
              
              <button mat-raised-button color="accent" (click)="openEnhancedInputWindow()">
                <mat-icon>input</mat-icon>
                Enhanced Input Test
              </button>
              
              <button mat-raised-button color="primary" (click)="openSimpleWindow()">
                <mat-icon>lightbulb</mat-icon>
                Simple Component (No Inputs)
              </button>
            </div>
          </div>
          
          <div class="demo-section">
            <h3>Custom Window Configuration</h3>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Window Title</mat-label>
                <input matInput [(ngModel)]="customTitle" placeholder="Enter window title">
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Custom Data</mat-label>
                <input matInput [(ngModel)]="customData" placeholder="Enter custom data">
              </mat-form-field>
            </div>
            
            <button mat-raised-button color="primary" (click)="openCustomWindow()">
              <mat-icon>settings</mat-icon>
              Open Custom Window
            </button>
          </div>
          
          <div class="demo-section">
            <h3>Window Features</h3>
            <div class="feature-list">
              <div class="feature-item">
                <mat-icon>drag_indicator</mat-icon>
                <span><strong>Draggable:</strong> Drag windows by title bar</span>
              </div>
              <div class="feature-item">
                <mat-icon>fullscreen</mat-icon>
                <span><strong>Resizable:</strong> Resize windows from edges and corners</span>
              </div>
              <div class="feature-item">
                <mat-icon>minimize</mat-icon>
                <span><strong>Minimizable:</strong> Minimize to taskbar at bottom</span>
              </div>
              <div class="feature-item">
                <mat-icon>layers</mat-icon>
                <span><strong>Multiple Windows:</strong> Support for multiple simultaneous windows</span>
              </div>
              <div class="feature-item">
                <mat-icon>input</mat-icon>
                <span><strong>Data Communication:</strong> Pass data to/from components</span>
              </div>
              <div class="feature-item">
                <mat-icon>mobile_friendly</mat-icon>
                <span><strong>Responsive:</strong> Adapts to different screen sizes</span>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .window-demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .demo-section {
      margin-bottom: 32px;
    }
    
    .demo-section h3 {
      margin-bottom: 16px;
      color: #1976d2;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .form-row mat-form-field {
      flex: 1;
    }
    
    .feature-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #1976d2;
    }
    
    .feature-item mat-icon {
      color: #1976d2;
    }
    
    mat-card-header {
      margin-bottom: 20px;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .window-demo-container {
        padding: 16px;
      }
      
      .button-group {
        flex-direction: column;
      }
      
      .form-row {
        flex-direction: column;
      }
      
      .feature-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WindowDemoComponent {
  customTitle = 'My Custom Window';
  customData = 'Hello from demo!';

  constructor(private windowManager: WindowManagerService) {}

  openTestWindow(): void {
    this.windowManager.openWindow({
      id: 'test-window-' + Date.now(),
      title: 'Test Window',
      component: TestWindowComponent,
      data: {
        message: 'This is test data passed to the window',
        timestamp: new Date().toISOString(),
        userId: 'demo-user'
      },
      width: 600,
      height: 500
    }).subscribe(result => {
      console.log('Test window result:', result);
    });
  }

  openDiscloseForm(): void {
    this.windowManager.openWindow({
      id: 'disclose-form-' + Date.now(),
      title: 'Disclosure Form',
      component: DiscloseFormComponent,
      data: {
        formConfig: 'demo-config',
        mode: 'edit'
      },
      width: '85%',
      height: '80%'
    }).subscribe(result => {
      console.log('Disclose form result:', result);
    });
  }

  openCustomWindow(): void {
    this.windowManager.openWindow({
      id: 'custom-window-' + Date.now(),
      title: this.customTitle || 'Custom Window',
      component: TestWindowComponent,
      data: {
        customData: this.customData,
        windowType: 'custom',
        createdAt: new Date().toISOString()
      },
      width: 500,
      height: 400,
      position: { x: 150, y: 150 }
    }).subscribe(result => {
      console.log('Custom window result:', result);
    });
  }

  openMultipleWindows(): void {
    // Open multiple windows to demonstrate the system
    const windows = [
      {
        title: 'Window 1',
        data: { windowNumber: 1, color: 'blue' },
        position: { x: 100, y: 100 }
      },
      {
        title: 'Window 2', 
        data: { windowNumber: 2, color: 'green' },
        position: { x: 200, y: 150 }
      },
      {
        title: 'Window 3',
        data: { windowNumber: 3, color: 'red' },
        position: { x: 300, y: 200 }
      }
    ];

    windows.forEach((config, index) => {
      setTimeout(() => {
        this.windowManager.openWindow({
          id: 'multi-window-' + index + '-' + Date.now(),
          title: config.title,
          component: TestWindowComponent,
          data: config.data,
          width: 450,
          height: 350,
          position: config.position
        }).subscribe(result => {
          console.log(`${config.title} result:`, result);
        });
      }, index * 200); // Stagger the opening
    });
  }

  openEnhancedInputWindow() {
    // Test data for enhanced input system - supports @Input(), input() signals, and windowData
    const testData = {
      // For @Input() properties
      title: 'Enhanced Input Test',
      description: 'Testing enhanced input data passing system',
      count: 42,
      isActive: true,
      items: ['Item 1', 'Item 2', 'Item 3'],
      user: { name: 'John Doe', age: 30, email: 'john@example.com' },
      
      // For input() signals (same data, different mechanism)
      signalMessage: 'This is a signal-based input!',
      signalNumber: 123,
      signalFlag: false,
      
      // For windowData interface
      windowData: {
        id: 'enhanced-test',
        metadata: {
          version: '1.0',
          created: new Date().toISOString(),
          features: ['@Input() decorators', 'input() signals', 'windowData interface']
        }
      }
    };

    this.windowManager.openWindow({
      id: 'enhanced-test-window-' + Date.now(),
      title: 'Enhanced Input Test Window',
      component: EnhancedTestWindowComponent,
      data: testData,
      width: 600,
      height: 500,
      position: { x: 100, y: 100 }
    }).subscribe((result: any) => {
      console.log('Enhanced Input Test window result:', result);
    });
  }

  openSimpleWindow() {
    // Test data that will be passed to a component with NO inputs
    // This should NOT cause any errors - the system should handle it gracefully
    const testData = {
      someProperty: 'This data will not be used',
      anotherProperty: 42,
      complexData: {
        nested: 'object',
        array: [1, 2, 3],
        boolean: true
      }
    };

    this.windowManager.openWindow({
      id: 'simple-test-window-' + Date.now(),
      title: 'Simple Component Test',
      component: SimpleTestWindowComponent,
      data: testData, // Data provided but component has no inputs - should be safe
      width: 500,
      height: 400,
      position: { x: 150, y: 150 }
    }).subscribe((result: any) => {
      console.log('Simple Test window result:', result);
    });
  }
}
