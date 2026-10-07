import { Injectable, signal, computed } from '@angular/core';
import { Column, Task, Priority } from '../models/task.model';

const STORAGE_KEY = 'kanban_board_v2';

const DEFAULT_COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To-Do',
    accent: '#818cf8',
    tasks: [
      { id: 'demo1', title: 'Design wireframes', description: 'Create low-fidelity wireframes for the new dashboard.', priority: 'high', columnId: 'todo', createdAt: Date.now() - 86400000, tags: ['design', 'ui'] },
      { id: 'demo2', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', priority: 'medium', columnId: 'todo', createdAt: Date.now() - 72000000, tags: ['devops'] },
    ]
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    accent: '#38bdf8',
    tasks: [
      { id: 'demo3', title: 'Implement authentication', description: 'Add JWT-based auth with refresh token support.', priority: 'high', columnId: 'inprogress', createdAt: Date.now() - 48000000, tags: ['backend', 'security'] },
    ]
  },
  {
    id: 'review',
    title: 'Review',
    accent: '#fbbf24',
    tasks: [
      { id: 'demo4', title: 'API documentation', description: 'Document all REST endpoints using OpenAPI spec.', priority: 'low', columnId: 'review', createdAt: Date.now() - 24000000, tags: ['docs'] },
    ]
  },
  {
    id: 'done',
    title: 'Done',
    accent: '#4ade80',
    tasks: [
      { id: 'demo5', title: 'Project setup', description: 'Initialize repository and configure basic project structure.', priority: 'low', columnId: 'done', createdAt: Date.now() - 120000000, tags: ['setup'] },
    ]
  },
];

@Injectable({ providedIn: 'root' })
export class KanbanService {
  columns = signal<Column[]>(this.loadFromStorage());

  totalTasks = computed(() => this.columns().reduce((acc, c) => acc + c.tasks.length, 0));
  doneTasks  = computed(() => this.columns().find(c => c.id === 'done')?.tasks.length ?? 0);

  // ── Persistence ────────────────────────────────────────────────────────────
  private loadFromStorage(): Column[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_COLUMNS;
    } catch {
      return DEFAULT_COLUMNS;
    }
  }

  private persist(): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.columns())); } catch {}
  }

  // ── Column ops ─────────────────────────────────────────────────────────────
  addColumn(title: string): void {
    const accents = ['#c084fc','#fb923c','#34d399','#f472b6','#a78bfa'];
    const accent  = accents[Math.floor(Math.random() * accents.length)];
    const id = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    this.columns.update(cols => [...cols, { id, title, accent, tasks: [] }]);
    this.persist();
  }

  deleteColumn(colId: string): void {
    this.columns.update(cols => cols.filter(c => c.id !== colId));
    this.persist();
  }

  renameColumn(colId: string, newTitle: string): void {
    this.columns.update(cols =>
      cols.map(c => c.id === colId ? { ...c, title: newTitle } : c)
    );
    this.persist();
  }

  // ── Task ops ───────────────────────────────────────────────────────────────
  addTask(columnId: string, title: string, description: string, priority: Priority, tags: string[]): Task {
    const task: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      title, description, priority, columnId,
      createdAt: Date.now(),
      tags
    };
    this.columns.update(cols =>
      cols.map(c => c.id === columnId ? { ...c, tasks: [...c.tasks, task] } : c)
    );
    this.persist();
    return task;
  }

  updateTask(task: Task): void {
    this.columns.update(cols =>
      cols.map(c => ({
        ...c,
        tasks: c.tasks.map(t => t.id === task.id ? task : t)
      }))
    );
    this.persist();
  }

  deleteTask(taskId: string): void {
    this.columns.update(cols =>
      cols.map(c => ({ ...c, tasks: c.tasks.filter(t => t.id !== taskId) }))
    );
    this.persist();
  }

  // ── DnD ────────────────────────────────────────────────────────────────────
  moveTask(taskId: string, fromColId: string, toColId: string, prevIndex: number, currIndex: number): void {
    this.columns.update(cols => {
      const colsCopy = cols.map(c => ({ ...c, tasks: [...c.tasks] }));
      const fromCol  = colsCopy.find(c => c.id === fromColId)!;
      const toCol    = colsCopy.find(c => c.id === toColId)!;

      const [task] = fromCol.tasks.splice(prevIndex, 1);
      task.columnId = toColId;
      toCol.tasks.splice(currIndex, 0, task);
      return colsCopy;
    });
    this.persist();
  }

  reorderTask(colId: string, prevIndex: number, currIndex: number): void {
    this.columns.update(cols => {
      return cols.map(c => {
        if (c.id !== colId) return c;
        const tasks = [...c.tasks];
        const [moved] = tasks.splice(prevIndex, 1);
        tasks.splice(currIndex, 0, moved);
        return { ...c, tasks };
      });
    });
    this.persist();
  }

  resetToDefault(): void {
    this.columns.set(DEFAULT_COLUMNS);
    this.persist();
  }
}
