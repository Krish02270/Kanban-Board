import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';

import { KanbanService } from '../services/kanban.service';
import { Task, Column } from '../models/task.model';
import { TaskDialogComponent, TaskDialogData } from '../task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CommonModule, FormsModule, DragDropModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatBadgeModule
  ],
  template: `
    <div class="board-shell">
      <!-- ── Header ────────────────────────────────────────────── -->
      <header class="topbar">
        <div class="brand">
          <div class="brand-icon">
            <span class="dot d1"></span>
            <span class="dot d2"></span>
            <span class="dot d3"></span>
          </div>
          <span class="brand-name">Kanban</span>
        </div>

        <div class="stats">
          <div class="stat-chip">
            <span class="stat-num">{{ kanban.totalTasks() }}</span>
            <span class="stat-label">Tasks</span>
          </div>
          <div class="stat-chip done">
            <span class="stat-num">{{ kanban.doneTasks() }}</span>
            <span class="stat-label">Done</span>
          </div>
          <div class="progress-bar-wrap" matTooltip="Overall completion">
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="completionPct()"></div>
            </div>
            <span class="pct-label">{{ completionPct() }}%</span>
          </div>
        </div>

        <div class="header-actions">
          <div class="search-wrap">
            <mat-icon class="search-icon">search</mat-icon>
            <input class="search-input" [(ngModel)]="searchQuery" placeholder="Search tasks…" />
            <button *ngIf="searchQuery" mat-icon-button class="clear-btn" (click)="searchQuery = ''">
              <mat-icon style="font-size:16px">close</mat-icon>
            </button>
          </div>

          <button mat-stroked-button class="btn-add-col" (click)="promptAddColumn()" matTooltip="Add column">
            <mat-icon>view_column</mat-icon> Add Column
          </button>
        </div>
      </header>

      <!-- ── Board ─────────────────────────────────────────────── -->
      <div class="board-scroll">
        <div class="board-inner">
          <div *ngFor="let col of kanban.columns(); trackBy: trackCol" class="column"
               [style.--col-accent]="col.accent">

            <!-- Column header -->
            <div class="col-header">
              <div class="col-left">
                <span class="col-dot"></span>
                <span *ngIf="!editingColId || editingColId !== col.id" class="col-title">
                  {{ col.title }}
                </span>
                <input *ngIf="editingColId === col.id" class="col-title-input"
                       [(ngModel)]="editingColTitle"
                       (blur)="saveColTitle(col)"
                       (keyup.enter)="saveColTitle(col)"
                       (keyup.escape)="editingColId = null"
                       #colInput />
                <span class="col-count">{{ filteredTasks(col).length }}</span>
              </div>
              <div class="col-actions">
                <button mat-icon-button class="icon-btn" (click)="openAddTask(col)" matTooltip="Add task">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button class="icon-btn" [matMenuTriggerFor]="colMenu">
                  <mat-icon>more_horiz</mat-icon>
                </button>
                <mat-menu #colMenu="matMenu" class="col-menu">
                  <button mat-menu-item (click)="startEditCol(col)">
                    <mat-icon>edit</mat-icon> Rename
                  </button>
                  <button mat-menu-item (click)="confirmDeleteCol(col)" class="danger-item">
                    <mat-icon>delete</mat-icon> Delete Column
                  </button>
                </mat-menu>
              </div>
            </div>

            <!-- Task list -->
            <div class="task-list"
                 cdkDropList
                 [id]="col.id"
                 [cdkDropListData]="col.tasks"
                 [cdkDropListConnectedTo]="connectedLists()"
                 (cdkDropListDropped)="onDrop($event, col)">

              <!-- Empty state -->
              <div *ngIf="filteredTasks(col).length === 0 && !searchQuery" class="empty-col">
                <mat-icon>inbox</mat-icon>
                <span>Drop tasks here</span>
              </div>

              <!-- Task cards -->
              <div *ngFor="let task of filteredTasks(col); trackBy: trackTask"
                   class="task-card" cdkDrag [cdkDragData]="task">

                <!-- Drag handle (visible on hover) -->
                <div class="drag-handle" cdkDragHandle>
                  <mat-icon>drag_indicator</mat-icon>
                </div>

                <!-- Priority stripe -->
                <div class="priority-stripe" [class]="'p-' + task.priority"></div>

                <div class="card-body">
                  <div class="card-top">
                    <span class="task-title">{{ task.title }}</span>
                    <button mat-icon-button class="icon-btn card-menu-btn"
                            [matMenuTriggerFor]="taskMenu" (click)="$event.stopPropagation()">
                      <mat-icon>more_vert</mat-icon>
                    </button>
                    <mat-menu #taskMenu="matMenu">
                      <button mat-menu-item (click)="openEditTask(task)">
                        <mat-icon>edit</mat-icon> Edit
                      </button>
                      <button mat-menu-item (click)="confirmDeleteTask(task)" class="danger-item">
                        <mat-icon>delete</mat-icon> Delete
                      </button>
                    </mat-menu>
                  </div>

                  <p *ngIf="task.description" class="task-desc">{{ task.description }}</p>

                  <div class="card-footer">
                    <span class="priority-badge" [class]="'p-' + task.priority">
                      {{ task.priority }}
                    </span>
                    <div class="tags" *ngIf="task.tags.length">
                      <span *ngFor="let tag of task.tags.slice(0, 3)" class="tag">#{{ tag }}</span>
                    </div>
                    <span class="task-date">{{ task.createdAt | date:'MMM d' }}</span>
                  </div>
                </div>

                <!-- Drag preview placeholder -->
                <div *cdkDragPlaceholder class="drag-placeholder"></div>
              </div>

              <!-- Search no-results -->
              <div *ngIf="filteredTasks(col).length === 0 && searchQuery" class="empty-col search-empty">
                <mat-icon>search_off</mat-icon>
                <span>No matches</span>
              </div>
            </div>

            <!-- Add task quick button -->
            <button class="btn-quick-add" (click)="openAddTask(col)">
              <mat-icon>add</mat-icon> Add task
            </button>
          </div>

          <!-- Add column placeholder -->
          <div class="col-placeholder" (click)="promptAddColumn()">
            <mat-icon>add</mat-icon>
            <span>New Column</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }

    /* ── Topbar ──────────────────────────────────────────────────────── */
    .topbar {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0 24px;
      height: 60px;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      position: relative;
      z-index: 10;
    }

    .brand { display: flex; align-items: center; gap: 10px; }
    .brand-icon {
      width: 28px; height: 28px;
      display: grid; grid-template-columns: 1fr 1fr; gap: 3px;
      padding: 5px;
    }
    .dot { display: block; border-radius: 2px; }
    .d1 { background: var(--accent-1); }
    .d2 { background: var(--accent-2); grid-column: 2; grid-row: 1; }
    .d3 { background: var(--accent-3); grid-column: 1 / span 2; }
    .brand-name {
      font-family: var(--font-head);
      font-weight: 800;
      font-size: 18px;
      letter-spacing: -0.5px;
      color: var(--text);
    }

    .stats { display: flex; align-items: center; gap: 10px; margin-left: 8px; }
    .stat-chip {
      display: flex; flex-direction: column; align-items: center;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 4px 12px;
      .stat-num { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--font-mono); }
      .stat-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: .5px; }
      &.done .stat-num { color: var(--accent-4); }
    }
    .progress-bar-wrap { display: flex; align-items: center; gap: 8px; }
    .progress-bar {
      width: 80px; height: 4px;
      background: var(--surface-2);
      border-radius: 99px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-1), var(--accent-4));
      border-radius: 99px;
      transition: width .4s ease;
    }
    .pct-label { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }

    .header-actions { display: flex; align-items: center; gap: 10px; margin-left: auto; }
    .search-wrap {
      display: flex; align-items: center; gap: 6px;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      padding: 0 10px;
      height: 36px;
      transition: border-color .2s;
      &:focus-within { border-color: var(--accent-1); }
    }
    .search-icon { font-size: 16px; color: var(--text-muted); }
    .search-input {
      background: transparent;
      border: none;
      outline: none;
      color: var(--text);
      font-family: var(--font-head);
      font-size: 13px;
      width: 180px;
      &::placeholder { color: var(--text-muted); }
    }
    .clear-btn { width: 24px !important; height: 24px !important; line-height: 24px !important; color: var(--text-muted) !important; }

    .btn-add-col {
      color: var(--text) !important;
      border-color: var(--border) !important;
      font-family: var(--font-head) !important;
      font-size: 13px !important;
      height: 36px !important;
      border-radius: var(--radius-sm) !important;
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      mat-icon { font-size: 16px; }
    }

    /* ── Board scroll ────────────────────────────────────────────────── */
    .board-scroll {
      flex: 1;
      overflow-x: auto;
      overflow-y: hidden;
      padding: 24px;
    }
    .board-inner {
      display: flex;
      gap: 16px;
      height: 100%;
      min-height: calc(100vh - 108px);
      align-items: flex-start;
    }

    /* ── Column ──────────────────────────────────────────────────────── */
    .column {
      width: 300px;
      flex-shrink: 0;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      display: flex;
      flex-direction: column;
      max-height: calc(100vh - 108px);
      position: relative;
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: var(--col-accent, var(--accent-1));
      }
    }

    .col-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 14px 10px;
      flex-shrink: 0;
    }
    .col-left { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; }
    .col-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--col-accent, var(--accent-1));
      flex-shrink: 0;
    }
    .col-title {
      font-weight: 700;
      font-size: 13px;
      letter-spacing: .3px;
      color: var(--text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .col-title-input {
      background: var(--surface-2);
      border: 1px solid var(--accent-1);
      border-radius: 4px;
      color: var(--text);
      font-family: var(--font-head);
      font-size: 13px;
      font-weight: 700;
      padding: 2px 6px;
      outline: none;
      width: 140px;
    }
    .col-count {
      background: var(--surface-2);
      color: var(--text-muted);
      border-radius: 99px;
      font-size: 11px;
      font-family: var(--font-mono);
      padding: 1px 7px;
      flex-shrink: 0;
    }
    .col-actions { display: flex; align-items: center; flex-shrink: 0; }
    .icon-btn {
      width: 28px !important; height: 28px !important;
      line-height: 28px !important;
      color: var(--text-muted) !important;
      mat-icon { font-size: 16px !important; }
      &:hover { color: var(--text) !important; }
    }

    /* ── Task list ───────────────────────────────────────────────────── */
    .task-list {
      flex: 1;
      overflow-y: auto;
      padding: 4px 12px 8px;
      min-height: 60px;
    }

    .empty-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 32px 0;
      color: var(--text-muted);
      border: 2px dashed var(--border);
      border-radius: var(--radius-sm);
      mat-icon { font-size: 28px; opacity: 0.4; }
      span { font-size: 12px; }
    }

    /* ── Task card ───────────────────────────────────────────────────── */
    .task-card {
      position: relative;
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      margin-bottom: 8px;
      cursor: grab;
      transition: box-shadow .15s, border-color .15s, transform .1s;
      display: flex;
      overflow: hidden;
      &:hover {
        border-color: rgba(255,255,255,.12);
        box-shadow: var(--shadow);
        .drag-handle { opacity: 1; }
        .card-menu-btn { opacity: 1; }
      }
      &:active { cursor: grabbing; }
    }

    .drag-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      color: var(--text-muted);
      opacity: 0;
      transition: opacity .15s;
      cursor: grab;
      flex-shrink: 0;
      mat-icon { font-size: 14px; }
    }

    .priority-stripe {
      width: 3px;
      flex-shrink: 0;
      &.p-low    { background: #4ade80; }
      &.p-medium { background: #fbbf24; }
      &.p-high   { background: #f87171; }
    }

    .card-body { flex: 1; padding: 10px 10px 10px 8px; min-width: 0; }

    .card-top {
      display: flex;
      align-items: flex-start;
      gap: 4px;
    }
    .task-title {
      flex: 1;
      font-size: 13px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.4;
    }
    .card-menu-btn {
      opacity: 0;
      transition: opacity .15s;
      margin-top: -4px;
      margin-right: -4px;
    }

    .task-desc {
      font-size: 11.5px;
      color: var(--text-muted);
      margin-top: 5px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-footer {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .priority-badge {
      font-size: 10px;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: .5px;
      padding: 1px 6px;
      border-radius: 4px;
      &.p-low    { color: #4ade80; background: rgba(74,222,128,.12); }
      &.p-medium { color: #fbbf24; background: rgba(251,191,36,.12); }
      &.p-high   { color: #f87171; background: rgba(248,113,113,.12); }
    }
    .tags { display: flex; gap: 4px; flex-wrap: wrap; flex: 1; }
    .tag {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: rgba(255,255,255,.04);
      border-radius: 4px;
      padding: 1px 5px;
    }
    .task-date {
      font-size: 10px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      margin-left: auto;
    }

    /* ── Quick-add button ────────────────────────────────────────────── */
    .btn-quick-add {
      display: flex;
      align-items: center;
      gap: 4px;
      width: 100%;
      padding: 10px 14px;
      background: transparent;
      border: none;
      border-top: 1px solid var(--border);
      color: var(--text-muted);
      font-family: var(--font-head);
      font-size: 12px;
      cursor: pointer;
      transition: color .15s, background .15s;
      flex-shrink: 0;
      mat-icon { font-size: 16px; }
      &:hover { color: var(--text); background: rgba(255,255,255,.03); }
    }

    /* ── Add column placeholder ──────────────────────────────────────── */
    .col-placeholder {
      width: 240px;
      flex-shrink: 0;
      height: 120px;
      border: 2px dashed var(--border);
      border-radius: var(--radius);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--text-muted);
      cursor: pointer;
      transition: border-color .2s, color .2s;
      font-size: 13px;
      mat-icon { font-size: 24px; }
      &:hover { border-color: var(--accent-1); color: var(--text); }
    }

    /* ── Menus ───────────────────────────────────────────────────────── */
    .danger-item { color: var(--danger) !important; mat-icon { color: var(--danger) !important; } }
  `]
})
export class BoardComponent {
  kanban = inject(KanbanService);
  private dialog = inject(MatDialog);
  private snack  = inject(MatSnackBar);

  searchQuery   = '';
  editingColId: string | null = null;
  editingColTitle = '';

  completionPct = computed(() => {
    const total = this.kanban.totalTasks();
    if (!total) return 0;
    return Math.round((this.kanban.doneTasks() / total) * 100);
  });

  connectedLists = computed(() => this.kanban.columns().map(c => c.id));

  trackCol  = (_: number, c: Column) => c.id;
  trackTask = (_: number, t: Task)   => t.id;

  filteredTasks(col: Column): Task[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return col.tasks;
    return col.tasks.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q))
    );
  }

  // ── DnD ──────────────────────────────────────────────────────────────────
  onDrop(event: CdkDragDrop<Task[]>, targetCol: Column): void {
    const task: Task = event.item.data;

    if (event.previousContainer === event.container) {
      this.kanban.reorderTask(targetCol.id, event.previousIndex, event.currentIndex);
    } else {
      const sourceColId = event.previousContainer.id;
      this.kanban.moveTask(task.id, sourceColId, targetCol.id, event.previousIndex, event.currentIndex);
      this.notify(`Moved to "${targetCol.title}"`, '✓');
    }
  }

  // ── Task CRUD ─────────────────────────────────────────────────────────────
  openAddTask(col: Column): void {
    this.dialog.open(TaskDialogComponent, {
      data: { columns: this.kanban.columns(), defaultColumnId: col.id } as TaskDialogData,
      autoFocus: true, disableClose: false
    }).afterClosed().subscribe(result => {
      if (!result) return;
      this.kanban.addTask(result.columnId, result.title, result.description, result.priority, result.tags);
      this.notify('Task created', '🎉');
    });
  }

  openEditTask(task: Task): void {
    this.dialog.open(TaskDialogComponent, {
      data: { task, columns: this.kanban.columns(), defaultColumnId: task.columnId } as TaskDialogData,
    }).afterClosed().subscribe(result => {
      if (!result) return;

      const original = task.columnId;
      const updated: Task = { ...task, ...result };

      // If column changed, delete from old and add to new
      if (result.columnId !== original) {
        this.kanban.deleteTask(task.id);
        this.kanban.addTask(result.columnId, result.title, result.description, result.priority, result.tags);
      } else {
        this.kanban.updateTask(updated);
      }
      this.notify('Task updated', '✏️');
    });
  }

  confirmDeleteTask(task: Task): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: 'Delete Task', message: `"${task.title}" will be permanently deleted.`, confirmLabel: 'Delete', danger: true }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.kanban.deleteTask(task.id);
      this.notify('Task deleted', '🗑️');
    });
  }

  // ── Column CRUD ───────────────────────────────────────────────────────────
  promptAddColumn(): void {
    const title = window.prompt('Column name:')?.trim();
    if (!title) return;
    this.kanban.addColumn(title);
    this.notify(`Column "${title}" added`, '📋');
  }

  startEditCol(col: Column): void {
    this.editingColId    = col.id;
    this.editingColTitle = col.title;
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('.col-title-input')?.focus();
    }, 50);
  }

  saveColTitle(col: Column): void {
    const t = this.editingColTitle.trim();
    if (t && t !== col.title) this.kanban.renameColumn(col.id, t);
    this.editingColId = null;
  }

  confirmDeleteCol(col: Column): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Column',
        message: `Delete "${col.title}" and all its ${col.tasks.length} task(s)?`,
        confirmLabel: 'Delete Column',
        danger: true
      }
    }).afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.kanban.deleteColumn(col.id);
      this.notify(`Column deleted`, '🗑️');
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private notify(msg: string, icon: string): void {
    this.snack.open(`${icon} ${msg}`, undefined, {
      duration: 2800,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
