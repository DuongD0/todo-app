import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo.types';

const todosRef = collection(db, 'todos');

export const createTodo = async (
  userId: string,
  todoData: CreateTodoData
): Promise<string> => {
  const cleanData: any = {
    userId,
    isDone: false,
    archived: false,
    dueDate: Timestamp.fromDate(todoData.dueDate),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    title: todoData.title,
    priority: todoData.priority,
    tags: todoData.tags,
  };

  if (todoData.description) {
    cleanData.description = todoData.description;
  }

  if (todoData.imageUrl) {
    cleanData.imageUrl = todoData.imageUrl;
  }

  const docRef = await addDoc(todosRef, cleanData);
  return docRef.id;
};

export const updateTodo = async (
  id: string,
  data: UpdateTodoData
): Promise<void> => {
  const updateData: any = {
    updatedAt: serverTimestamp(),
  };

  if (data.title) {
    updateData.title = data.title;
  }

  if (data.description) {
    updateData.description = data.description;
  }

  if (data.priority) {
    updateData.priority = data.priority;
  }

  if (data.tags) {
    updateData.tags = data.tags;
  }

  if (data.dueDate) {
    updateData.dueDate = Timestamp.fromDate(data.dueDate);
  }

  if (data.imageUrl) {
    updateData.imageUrl = data.imageUrl;
  }

  await updateDoc(doc(todosRef, id), updateData);
};

export const deleteTodo = async (id: string): Promise<void> => {
  await updateDoc(doc(todosRef, id), {
    archived: true,
    updatedAt: serverTimestamp(),
  });
};

export const toggleTodoStatus = async (
  id: string,
  isDone: boolean
): Promise<void> => {
  await updateDoc(doc(todosRef, id), {
    isDone,
    updatedAt: serverTimestamp(),
  });
};

export const listenTodos = (
  userId: string,
  callback: (todos: Todo[]) => void
) => {
  const q = query(
    todosRef,
    where('userId', '==', userId),
    where('archived', '==', false)
  );

  return onSnapshot(q, (snapshot) => {
    const todos: Todo[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Todo[];
    
    const sortedTodos = todos.sort((a, b) => {
      if (a.isDone !== b.isDone) {
        return a.isDone ? 1 : -1;
      }
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      const aTime = (a.dueDate as any)?.toDate ? (a.dueDate as any).toDate().getTime() : 
                   (a.dueDate as any)?.getTime ? (a.dueDate as any).getTime() : 
                   Date.now();
      const bTime = (b.dueDate as any)?.toDate ? (b.dueDate as any).toDate().getTime() : 
                   (b.dueDate as any)?.getTime ? (b.dueDate as any).getTime() : 
                   Date.now();
      return aTime - bTime;
    });
    
    callback(sortedTodos);
  });
};

