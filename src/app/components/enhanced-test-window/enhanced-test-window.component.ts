import { Component, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { DynamicComponentInterface } from '../window-system/models/window.interface';

// === INTERFACES ===
interface UserData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

@Component({
  selector: 'app-enhanced-test-window',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule
  ],
  template: `
    <div class="enhanced-test-window">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Enhanced Input Test Component</mat-card-title>
          <mat-card-subtitle>All inputs converted to modern input() signals</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <!-- Modern input() signals -->
          <div class="input-section">
            <h3>Basic input() Signals</h3>
            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>Title (input signal)</mat-label>
                <input matInput [value]="title()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Description (input signal)</mat-label>
                <input matInput [value]="description()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Message (input signal)</mat-label>
                <input matInput [value]="message()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Count (input signal)</mat-label>
                <input matInput [value]="count()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Is Active (input signal)</mat-label>
                <input matInput [value]="isActive()" readonly>
              </mat-form-field>
            </div>
            
            <!-- input() Array -->
            @if (items() && items().length > 0) {
              <div class="form-group">
                <h4>Items Array (input signal)</h4>
                <mat-chip-set>
                  @for (item of items(); track item) {
                    <mat-chip>{{ item }}</mat-chip>
                  }
                </mat-chip-set>
              </div>
            }
            
            <!-- input() Object -->
            @if (user()) {
              <div class="form-group">
                <h4>User Object (input signal)</h4>
                <mat-card appearance="outlined">
                  <mat-card-content>
                    <p><strong>Name:</strong> {{ user()?.name }}</p>
                    <p><strong>Age:</strong> {{ user()?.age }}</p>
                    <p><strong>Email:</strong> {{ user()?.email }}</p>
                  </mat-card-content>
                </mat-card>
              </div>
            }
          </div>

          <!-- Signal-based input() Properties -->
          <div class="input-section">
            <h3>Additional input() Signals</h3>
            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>Signal Message (input signal)</mat-label>
                <input matInput [value]="signalMessage()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Signal Number (input signal)</mat-label>
                <input matInput [value]="signalNumber()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Signal Flag (input signal)</mat-label>
                <input matInput [value]="signalFlag()" readonly>
              </mat-form-field>
            </div>
          </div>

          <!-- Modern input() signals -->
          <div class="input-section">
            <h3>More input() Signals</h3>
            <div class="form-group">
              <mat-form-field appearance="outline">
                <mat-label>User ID (signal)</mat-label>
                <input matInput [value]="userId()" readonly>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>Theme (signal)</mat-label>
                <input matInput [value]="theme()" readonly>
              </mat-form-field>
            </div>
            
            <!-- Config Object -->
            @if (config() && this.hasConfigData()) {
              <div class="form-group">
                <h4>Config Object (signal)</h4>
                <pre class="config-display">{{ config() | json }}</pre>
              </div>
            }
          </div>

          <!-- User Data Object -->
          @if (userData()) {
            <div class="input-section">
              <h3>User Data Object (signal)</h3>
              <div class="user-card">
                <mat-card appearance="outlined">
                  <mat-card-content>
                    <p><strong>ID:</strong> {{ userData()?.id }}</p>
                    <p><strong>Name:</strong> {{ userData()?.name }}</p>
                    <p><strong>Email:</strong> {{ userData()?.email }}</p>
                    <p><strong>Role:</strong> {{ userData()?.role }}</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>
          }

          <!-- WindowData for backward compatibility -->
          @if (windowData()) {
            <div class="input-section">
              <h3>WindowData (input signal)</h3>
              <pre>{{ windowData() | json }}</pre>
            </div>
          }

          <!-- Interactive Test -->
          <div class="input-section">
            <h3>Interactive Test</h3>
            <mat-form-field appearance="outline">
              <mat-label>Your Message</mat-label>
              <input matInput [(ngModel)]="userMessage" placeholder="Type something...">
            </mat-form-field>
            <div class="button-group">
              <button mat-raised-button color="primary" (click)="sendMessage()">
                <mat-icon>send</mat-icon>
                Send Message
              </button>
              <button mat-raised-button color="warn" (click)="closeWindow()">
                <mat-icon>close</mat-icon>
                Close Window
              </button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* === MAIN LAYOUT === */
    .enhanced-test-window {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    /* === SECTIONS === */
    .input-section {
      margin-bottom: 24px;
    }

    .input-section h3 {
      color: #1976d2;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 500;
    }
      
    .input-section h4 {
      color: #424242;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 500;
    }

    /* === FORM LAYOUT === */
    .form-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    /* === DISPLAY ELEMENTS === */
    .config-display {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 12px;
      white-space: pre-wrap;
      overflow-x: auto;
    }

    .user-card {
      margin-top: 8px;
    }

    /* === MATERIAL COMPONENTS === */
    mat-card-header {
      margin-bottom: 20px;
    }

    mat-chip-set {
      margin-top: 8px;
    }

    pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
  `]
})
export class EnhancedTestWindowComponent implements OnInit, DynamicComponentInterface {
  // === INPUT SIGNALS ===
  // Basic properties
  title = input<string>('Default Title');
  description = input<string>('Default Description');
  message = input<string>('Default Message');
  priority = input<number>(1);
  count = input<number>(0);
  isActive = input<boolean>(false);
  
  // Complex properties
  items = input<string[]>([]);
  user = input<any>(null); // Keep as any for flexible testing
  userData = input<UserData | null>(null);
  windowData = input<Record<string, unknown> | null>(null);
  config = input<Record<string, unknown>>({});
  
  // Additional signals
  userId = input<string>('default-user');
  theme = input<string>('light');
  signalMessage = input<string>('');
  signalNumber = input<number>(0);
  signalFlag = input<boolean>(false);

  // === COMPONENT STATE ===
  userMessage = '';

  // === INTERFACE CALLBACKS ===
  onWindowClose?: (data?: Record<string, unknown>) => void;
  onWindowMinimize?: () => void;
  onWindowMaximize?: () => void;

  // === LIFECYCLE ===
  ngOnInit(): void {
    console.log('EnhancedTestWindowComponent initialized');
    console.log('All input signal values:', {
      title: this.title(),
      description: this.description(),
      message: this.message(),
      priority: this.priority(),
      count: this.count(),
      isActive: this.isActive(),
      items: this.items(),
      user: this.user(),
      userData: this.userData(),
      windowData: this.windowData(),
      config: this.config(),
      userId: this.userId(),
      theme: this.theme(),
      signalMessage: this.signalMessage(),
      signalNumber: this.signalNumber(),
      signalFlag: this.signalFlag()
    });
  }

  // === UTILITY METHODS ===
  hasConfigData(): boolean {
    const configValue = this.config();
    return configValue && Object.keys(configValue).length > 0;
  }

  // === EVENT HANDLERS ===

  sendMessage(): void {
    console.log('Sending message:', this.userMessage);
    // Simulate sending message to parent or service
    if (this.onWindowClose) {
      this.onWindowClose({
        action: 'message',
        data: this.userMessage
      });
    }
  }

  closeWindow(): void {
    console.log('Closing window');
    if (this.onWindowClose) {
      this.onWindowClose({
        action: 'close',
        data: {
          message: this.userMessage,
          timestamp: new Date().toISOString()
        }
      });
    }
  }
}
