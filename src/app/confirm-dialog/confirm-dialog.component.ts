import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-wrap">
      <div class="icon-wrap" [class.danger]="data.danger">
        <mat-icon>{{ data.danger ? 'warning' : 'help_outline' }}</mat-icon>
      </div>
      <h3 class="title">{{ data.title }}</h3>
      <p class="message">{{ data.message }}</p>
      <div class="actions">
        <button mat-button (click)="dialogRef.close(false)" class="btn-cancel">Cancel</button>
        <button mat-flat-button (click)="dialogRef.close(true)"
                [class.danger-btn]="data.danger" class="btn-confirm">
          {{ data.confirmLabel ?? 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-wrap {
      padding: 32px 28px;
      text-align: center;
      max-width: 380px;
    }
    .icon-wrap {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: rgba(129,140,248,.15);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
      mat-icon { color: var(--accent-1); font-size: 26px; }
      &.danger {
        background: rgba(248,113,113,.15);
        mat-icon { color: var(--danger); }
      }
    }
    .title {
      font-family: var(--font-head);
      font-size: 18px; font-weight: 700;
      color: var(--text);
      margin-bottom: 10px;
    }
    .message {
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .actions { display: flex; justify-content: center; gap: 10px; }
    .btn-cancel { color: var(--text-muted) !important; font-family: var(--font-head) !important; }
    .btn-confirm {
      background: var(--accent-1) !important;
      color: #fff !important;
      font-family: var(--font-head) !important;
      font-weight: 600 !important;
      border-radius: var(--radius-sm) !important;
      padding: 0 20px !important;
    }
    .danger-btn { background: var(--danger) !important; }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
