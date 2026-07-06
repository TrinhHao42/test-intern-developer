import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginApi, registerApi } from '../api';

// Async Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await loginApi(username, password);
      const user = { name: response.name || username };
      localStorage.setItem('todo_user', JSON.stringify(user));
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      return rejectWithValue(message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, password, name }, { rejectWithValue }) => {
    try {
      await registerApi(username, password, name);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.';
      return rejectWithValue(message);
    }
  }
);

// Initial State
const savedUser = localStorage.getItem('todo_user');
const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  loading: false,
  error: null,
  registerSuccess: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      state.registerSuccess = false;
      localStorage.removeItem('todo_user');
    },
    clearAuthError(state) {
      state.error = null;
    },
    resetRegisterSuccess(state) {
      state.registerSuccess = false;
    },
    setSessionExpired(state) {
      state.user = null;
      localStorage.removeItem('todo_user');
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.registerSuccess = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.registerSuccess = false;
      });
  }
});

export const { logout, clearAuthError, resetRegisterSuccess, setSessionExpired } = authSlice.actions;
export default authSlice.reducer;
