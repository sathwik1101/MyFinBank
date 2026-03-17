import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const depositMoney = createAsyncThunk('transactions/deposit', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/transactions/deposit', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const withdrawMoney = createAsyncThunk('transactions/withdraw', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/transactions/withdraw', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const transferMoney = createAsyncThunk('transactions/transfer', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/transactions/transfer', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchPassbook = createAsyncThunk('transactions/passbook', async (accountNumber, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/transactions/passbook/${accountNumber}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    passbook: [],
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPassbook.fulfilled, (state, action) => { state.passbook = action.payload; });
    builder.addCase(depositMoney.fulfilled, (state) => { state.success = 'Deposit successful!'; });
    builder.addCase(depositMoney.rejected, (state, action) => { state.error = action.payload; });
    builder.addCase(withdrawMoney.fulfilled, (state) => { state.success = 'Withdrawal successful!'; });
    builder.addCase(withdrawMoney.rejected, (state, action) => { state.error = action.payload; });
    builder.addCase(transferMoney.fulfilled, (state) => { state.success = 'Transfer successful!'; });
    builder.addCase(transferMoney.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearMessages } = transactionSlice.actions;
export default transactionSlice.reducer;