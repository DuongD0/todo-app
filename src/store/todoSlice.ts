import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  listenTodos,
} from '@/services/todo.repository';
import { Todo, CreateTodoData, UpdateTodoData } from '@/types/todo.types';

interface TodoState {
  list: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  list: [],
  loading: false,
  error: null,
};

export const subscribeTodos = createAsyncThunk(
  'todos/subscribe',
  async (userId: string, { dispatch }) => {
    return new Promise<void>((resolve) => {
      listenTodos(userId, (todos) => {
        dispatch(todoSlice.actions.setTodos(todos));
        resolve();
      });
    });
  }
);

export const addNewTodo = createAsyncThunk(
  'todos/add',
  async ({ userId, todoData }: { userId: string; todoData: CreateTodoData }) => {
    const id = await createTodo(userId, todoData);
    return id;
  }
);

export const updateExistingTodo = createAsyncThunk(
  'todos/update',
  async ({ id, data }: { id: string; data: UpdateTodoData }) => {
    await updateTodo(id, data);
    return { id, data };
  }
);

export const removeExistingTodo = createAsyncThunk(
  'todos/delete',
  async (id: string) => {
    await deleteTodo(id);
    return id;
  }
);

export const toggleTodoComplete = createAsyncThunk(
  'todos/toggle',
  async ({ id, isDone }: { id: string; isDone: boolean }) => {
    await toggleTodoStatus(id, isDone);
    return { id, isDone };
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearTodos: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeTodos.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(subscribeTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to subscribe to todos';
      })
      .addCase(addNewTodo.pending, (state) => {
        state.loading = true;
      })
      .addCase(addNewTodo.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addNewTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add todo';
      })
      .addCase(updateExistingTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update todo';
      })
      .addCase(removeExistingTodo.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to delete todo';
      })
      .addCase(toggleTodoComplete.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to toggle todo';
      });
  },
});

export const { setTodos, clearTodos } = todoSlice.actions;
export default todoSlice.reducer;

