import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Customer Login
export const loginCustomer = createAsyncThunk('auth/loginCustomer', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/customers/login', data);
    return { ...res.data, role: 'CUSTOMER' };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Admin Login
export const loginAdmin = createAsyncThunk('auth/loginAdmin', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/admin/login', data);
    return { ...res.data, role: 'ADMIN' };
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

// Customer Register
export const registerCustomer = createAsyncThunk('auth/registerCustomer', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/customers/register', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    }
  },
  extraReducers: (builder) => {
    // Customer Login
    builder.addCase(loginCustomer.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginCustomer.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.customer;
      state.role = 'CUSTOMER';
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.customer));
      localStorage.setItem('role', 'CUSTOMER');
    });
    builder.addCase(loginCustomer.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Admin Login
    builder.addCase(loginAdmin.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.admin;
      state.role = 'ADMIN';
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.admin));
      localStorage.setItem('role', 'ADMIN');
    });
    builder.addCase(loginAdmin.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Register
    builder.addCase(registerCustomer.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(registerCustomer.fulfilled, (state) => { state.loading = false; state.success = 'Registration successful! Awaiting admin approval.'; });
    builder.addCase(registerCustomer.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;