import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const createFD = createAsyncThunk('fd/create', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/fd', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMyFDs = createAsyncThunk('fd/fetchMy', async (accountNumber, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/fd/${accountNumber}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const fdSlice = createSlice({
  name: 'fd',
  initialState: { myFDs: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyFDs.fulfilled, (state, action) => { state.myFDs = action.payload; });
    builder.addCase(createFD.fulfilled, (state) => { state.success = 'Fixed Deposit created!'; });
    builder.addCase(createFD.rejected, (state, action) => { state.error = action.payload; });
  }
});

export const { clearMessages } = fdSlice.actions;
export default fdSlice.reducer;