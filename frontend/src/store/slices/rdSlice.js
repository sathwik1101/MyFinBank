import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const createRD = createAsyncThunk('rd/create', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/rd', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMyRDs = createAsyncThunk('rd/fetchMy', async (accountNumber, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/rd/${accountNumber}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const payRDInstallment = createAsyncThunk('rd/payInstallment', async (rdId, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/rd/${rdId}/pay`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const rdSlice = createSlice({
  name: 'rd',
  initialState: { myRDs: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyRDs.fulfilled, (state, action) => { state.myRDs = action.payload; });
    builder.addCase(createRD.fulfilled, (state) => { state.success = 'Recurring Deposit created!'; });
    builder.addCase(createRD.rejected, (state, action) => { state.error = action.payload; });
    builder.addCase(payRDInstallment.fulfilled, (state) => { state.success = 'Installment paid!'; });
  }
});

export const { clearMessages } = rdSlice.actions;
export default rdSlice.reducer;