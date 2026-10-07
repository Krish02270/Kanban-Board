export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  columnId: string;
  createdAt: number;
  tags: string[];
}

export interface Column {
  id: string;
  title: string;
  accent: string;
  tasks: Task[];
}
