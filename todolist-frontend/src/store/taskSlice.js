import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getTasksApi,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi
} from '../api';
import { setSessionExpired } from './authSlice';

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { tasks: { filters } } = getState();
      const apiFilters = {};
      if (filters.completedFilter === 'active') apiFilters.completed = false;
      if (filters.completedFilter === 'completed') apiFilters.completed = true;
      if (filters.dueDateFilter) apiFilters.dueDate = filters.dueDateFilter;
      if (filters.search.trim()) apiFilters.search = filters.search.trim();

      const response = await getTasksApi(apiFilters);
      return response.result || [];
    } catch (error) {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        dispatch(setSessionExpired());
        return rejectWithValue('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
      }
      return rejectWithValue('Không thể tải danh sách công việc. Vui lòng thử lại.');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await createTaskApi(taskData);
      return response.result;
    } catch (error) {
      const message = error.response?.data?.message || 'Thêm công việc mới thất bại.';
      return rejectWithValue(message);
    }
  }
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await updateTaskApi(id, taskData);
      return response.result;
    } catch (error) {
      const message = error.response?.data?.message || 'Cập nhật công việc thất bại.';
      return rejectWithValue(message);
    }
  }
);

export const toggleTaskComplete = createAsyncThunk(
  'tasks/toggleTaskComplete',
  async (task, { rejectWithValue }) => {
    try {
      const updatedData = {
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        completed: !task.completed
      };
      const response = await updateTaskApi(task.id, updatedData);
      return { id: task.id, updatedTask: response.result, completed: !task.completed };
    } catch (error) {
      return rejectWithValue('Cập nhật trạng thái thất bại.');
    }
  }
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      await deleteTaskApi(id);
      return id;
    } catch (error) {
      return rejectWithValue('Xóa công việc thất bại.');
    }
  }
);

// Initial State
const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    completedFilter: 'all',
    dueDateFilter: ''
  },
  toast: null
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSearch(state, action) {
      state.filters.search = action.payload;
    },
    setCompletedFilter(state, action) {
      state.filters.completedFilter = action.payload;
    },
    setDueDateFilter(state, action) {
      state.filters.dueDateFilter = action.payload;
    },
    showToast(state, action) {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type || 'success'
      };
    },
    clearToast(state) {
      state.toast = null;
    },
    clearTasksError(state) {
      state.error = null;
    },
    clearTasks(state) {
      state.items = [];
      state.error = null;
      state.filters = {
        search: '',
        completedFilter: 'all',
        dueDateFilter: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Task
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.toast = { message: 'Đã thêm công việc mới.', type: 'success' };
      })
      // Edit Task
      .addCase(editTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.toast = { message: 'Đã cập nhật công việc.', type: 'success' };
      })
      // Toggle Task Complete
      .addCase(toggleTaskComplete.fulfilled, (state, action) => {
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload.updatedTask;
        }
        state.toast = {
          message: action.payload.completed ? 'Đã hoàn thành công việc!' : 'Đã đánh dấu chưa hoàn thành',
          type: 'success'
        };
      })
      .addCase(toggleTaskComplete.rejected, (state, action) => {
        state.toast = { message: action.payload, type: 'error' };
      })
      // Remove Task
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter(t => t.id !== action.payload);
        state.toast = { message: 'Đã xóa công việc.', type: 'success' };
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.toast = { message: action.payload, type: 'error' };
      });
  }
});

export const {
  setSearch,
  setCompletedFilter,
  setDueDateFilter,
  showToast,
  clearToast,
  clearTasksError,
  clearTasks
} = taskSlice.actions;

export default taskSlice.reducer;
