import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Task, Priority, Column } from '../models/task.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

export interface TaskDialogData {
  task?: Task;
  columns: Column[];
  defaultColumnId: string;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatChipsModule, MatIconModule
  ],
  template: `
    <div class="dialog-wrap">
      <h2 class="dialog-title">{{ isEdit ? 'Edit Task' : 'New Task' }}</h2>

      <form [formGroup]="form" class="task-form">
        <!-- Title -->
        <mat-form-field appearance="fill">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" placeholder="What needs to be done?" maxlength="80">
          <mat-error *ngIf="form.get('title')?.hasError('required')">Title is required</mat-error>
        </mat-form-field>

        <!-- Description -->
        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Add some context..."></textarea>
        </mat-form-field>

        <div class="row-2">
          <!-- Priority -->
          <mat-form-field appearance="fill">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="low">
                <span class="priority-dot low"></span> Low
              </mat-option>
              <mat-option value="medium">
                <span class="priority-dot medium"></span> Medium
              </mat-option>
              <mat-option value="high">
                <span class="priority-dot high"></span> High
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Column -->
          <mat-form-field appearance="fill">
            <mat-label>Column</mat-label>
            <mat-select formControlName="columnId">
              <mat-option *ngFor="let col of data.columns" [value]="col.id">
                {{ col.title }}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <!-- Tags -->
        <mat-form-field appearance="fill">
          <mat-label>Tags</mat-label>
          <mat-chip-grid #chipGrid>
            <mat-chip-row *ngFor="let tag of tags" (removed)="removeTag(tag)" class="chip">
              {{ tag }}
              <button matChipRemove><mat-icon>cancel</mat-icon></button>
            </mat-chip-row>
            <input placeholder="Add tag..."
              [matChipInputFor]="chipGrid"
              [matChipInputSeparatorKeyCodes]="separatorKeys"
              (matChipInputTokenEnd)="addTag($event)">
          </mat-chip-grid>
        </mat-form-field>
      </form>

      <div class="dialog-actions">
        <button mat-button (click)="cancel()" class="btn-cancel">Cancel</button>
        <button mat-flat-button (click)="submit()" class="btn-save"
                [disabled]="form.invalid">
          {{ isEdit ? 'Save Changes' : 'Create Task' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-wrap {
      padding: 28px;
      min-width: 480px;
      max-width: 560px;
    }
    .dialog-title {
      font-family: var(--font-head);
      font-size: 20px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 24px;
      letter-spacing: -0.3px;
    }
    .task-form { display: flex; flex-direction: column; gap: 8px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
    }
    .btn-cancel {
      color: var(--text-muted) !important;
      font-family: var(--font-head) !important;
    }
    .btn-save {
      background: var(--accent-1) !important;
      color: #fff !important;
      font-family: var(--font-head) !important;
      font-weight: 600 !important;
      border-radius: var(--radius-sm) !important;
      padding: 0 20px !important;
    }
    .btn-save:disabled { opacity: 0.4 !important; }
    .priority-dot {
      display: inline-block;
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-right: 6px;
      &.low    { background: #4ade80; }
      &.medium { background: #fbbf24; }
      &.high   { background: #f87171; }
    }
    .chip { background: var(--surface) !important; color: var(--text) !important; font-family: var(--font-mono) !important; font-size: 11px !important; }
    @media (max-width: 560px) {
      .dialog-wrap { min-width: unset; padding: 20px; }
      .row-2 { grid-template-columns: 1fr; }
    }
  `]
})
export class TaskDialogComponent implements OnInit {
  form!: FormGroup;
  tags: string[] = [];
  isEdit = false;
  separatorKeys = [ENTER, COMMA];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data.task;
    this.tags   = this.data.task?.tags ? [...this.data.task.tags] : [];

    this.form = this.fb.group({
      title:       [this.data.task?.title ?? '', [Validators.required, Validators.maxLength(80)]],
      description: [this.data.task?.description ?? ''],
      priority:    [this.data.task?.priority ?? 'medium'],
      columnId:    [this.data.task?.columnId ?? this.data.defaultColumnId],
    });
  }

  addTag(event: MatChipInputEvent): void {
    const val = (event.value ?? '').trim().toLowerCase();
    if (val && !this.tags.includes(val)) this.tags.push(val);
    event.chipInput?.clear();
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
  }

  submit(): void {
    if (this.form.invalid) return;
    this.dialogRef.close({ ...this.form.value, tags: this.tags });
  }

  cancel(): void { this.dialogRef.close(); }
}
