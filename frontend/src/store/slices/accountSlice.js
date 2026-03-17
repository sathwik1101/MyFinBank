import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchMyAccounts = createAsyncThunk('accounts/fetchMy', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/accounts/my');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchAllAccounts = createAsyncThunk('accounts/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/accounts/all');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchPendingAccounts = createAsyncThunk('accounts/fetchPending', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/accounts/pending');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateAccountStatus = createAsyncThunk('accounts/updateStatus', async ({ accountNumber, status, deactivationType }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/accounts/${accountNumber}/status`, { status, deactivationType });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const createAccount = createAsyncThunk('accounts/create', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/accounts', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    myAccounts: [],
    allAccounts: [],
    pendingAccounts: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyAccounts.fulfilled, (state, action) => { state.myAccounts = action.payload; });
    builder.addCase(fetchAllAccounts.fulfilled, (state, action) => { state.allAccounts = action.payload; });
    builder.addCase(fetchPendingAccounts.fulfilled, (state, action) => { state.pendingAccounts = action.payload; });
    builder.addCase(updateAccountStatus.fulfilled, (state) => { state.success = 'Account status updated'; });
    builder.addCase(createAccount.fulfilled, (state) => { state.success = 'Account request submitted'; });
    builder.addCase(createAccount.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearMessages } = accountSlice.actions;
export default accountSlice.reducer;