import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-simple-test-window',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="simple-window-content">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <mat-icon>info</mat-icon>
            Simple Component (No Inputs)
          </mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <p>This is a simple component that has <strong>no &#64;Input() decorators</strong> and <strong>no input() signals</strong>.</p>
          <p>It should load without any errors even when data is passed to it.</p>
          
          <div class="info-section">
            <h4>Component Features:</h4>
            <ul>
              <li>✅ No inputs defined</li>
              <li>✅ Standalone component</li>
              <li>✅ Uses Material Design</li>
              <li>✅ Graceful data handling</li>
            </ul>
          </div>
          
          <div class="status-info">
            <p><strong>Status:</strong> Component loaded successfully!</p>
            <p><strong>Timestamp:</strong> {{ currentTime }}</p>
          </div>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-raised-button color="primary">
            <mat-icon>thumb_up</mat-icon>
            Works Great!
          </button>
          <button mat-button>
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .simple-window-content {
      padding: 16px;
      max-width: 100%;
    }
    
    .info-section {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      margin: 16px 0;
    }
    
    .info-section h4 {
      margin-top: 0;
      color: #1976d2;
    }
    
    .info-section ul {
      margin-bottom: 0;
    }
    
    .info-section li {
      margin-bottom: 4px;
    }
    
    .status-info {
      background: #e8f5e8;
      padding: 12px;
      border-radius: 4px;
      border-left: 4px solid #4caf50;
    }
    
    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    mat-card-actions {
      display: flex;
      gap: 8px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTestWindowComponent {
  currentTime = new Date().toLocaleString();
  
  constructor() {
    console.log('SimpleTestWindowComponent created successfully - no inputs required!');
  }
}
