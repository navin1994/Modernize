import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { DynamicComponentInterface } from '../window-system/models/window.interface';

@Component({
  selector: 'app-test-window',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  template: `
    <div class="test-window-content">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Test Window Component</mat-card-title>
          <mat-card-subtitle>This is a sample component inside a dynamic window</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="content-section">
            <h3>Received Data:</h3>
            <pre>{{ windowData | json }}</pre>
          </div>
          
          <div class="content-section">
            <mat-form-field appearance="outline">
              <mat-label>Test Input</mat-label>
              <input matInput [(ngModel)]="testValue" placeholder="Enter some text">
            </mat-form-field>
          </div>
          
          <div class="content-section">
            <h3>Window Controls:</h3>
            <p>You can drag this window using the title bar, resize it using the edges, or minimize/close it using the buttons in the title bar.</p>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="sendDataAndClose()">
            <mat-icon>check</mat-icon>
            Send Data & Close
          </button>
          
          <button mat-button (click)="minimizeWindow()">
            <mat-icon>minimize</mat-icon>
            Minimize
          </button>
          
          <button mat-button color="warn" (click)="closeWindow()">
            <mat-icon>close</mat-icon>
            Close
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-window-content {
      padding: 16px;
      height: 100%;
      overflow: auto;
    }
    
    .content-section {
      margin-bottom: 20px;
    }
    
    pre {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      font-size: 12px;
      max-height: 150px;
      overflow: auto;
    }
    
    mat-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    mat-card-content {
      flex: 1;
      overflow: auto;
    }
    
    mat-card-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    
    mat-form-field {
      width: 100%;
    }
  `]
})
export class TestWindowComponent implements OnInit, DynamicComponentInterface {
  windowData?: any;
  testValue = '';
  
  // Callbacks from window system
  onWindowClose?: (data?: any) => void;
  onWindowMinimize?: () => void;

  ngOnInit(): void {
    console.log('TestWindowComponent initialized with data:', this.windowData);
  }

  sendDataAndClose(): void {
    const resultData = {
      testValue: this.testValue,
      timestamp: new Date().toISOString(),
      action: 'completed'
    };
    
    if (this.onWindowClose) {
      this.onWindowClose(resultData);
    }
  }

  minimizeWindow(): void {
    if (this.onWindowMinimize) {
      this.onWindowMinimize();
    }
  }

  closeWindow(): void {
    if (this.onWindowClose) {
      this.onWindowClose({ action: 'cancelled' });
    }
  }
}
