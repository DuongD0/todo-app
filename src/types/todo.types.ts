import { Timestamp } from 'firebase/firestore';

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description?: string;
  priority: 1 | 2 | 3; // 1 = High, 2 = Medium, 3 = Low
  tags: string[];
  dueDate: Timestamp;
  isDone: boolean;
  imageUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archived: boolean;
}

export interface CreateTodoData {
  title: string;
  description?: string;
  priority: 1 | 2 | 3;
  tags: string[];
  dueDate: Date;
  imageUrl?: string;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  priority?: 1 | 2 | 3;
  tags?: string[];
  dueDate?: Date;
  isDone?: boolean;
  imageUrl?: string;
}

