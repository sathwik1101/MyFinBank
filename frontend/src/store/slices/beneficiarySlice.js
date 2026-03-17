import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const addBeneficiary = createAsyncThunk('beneficiaries/add', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/beneficiaries', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMyBeneficiaries = createAsyncThunk('beneficiaries/fetchMy', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/beneficiaries/my');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchPendingBeneficiaries = createAsyncThunk('beneficiaries/fetchPending', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/beneficiaries/pending');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const approveBeneficiary = createAsyncThunk('beneficiaries/approve', async (beneficiaryId, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/beneficiaries/${beneficiaryId}/approve`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const beneficiarySlice = createSlice({
  name: 'beneficiaries',
  initialState: { myBeneficiaries: [], pendingBeneficiaries: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyBeneficiaries.fulfilled, (state, action) => { state.myBeneficiaries = action.payload; });
    builder.addCase(fetchPendingBeneficiaries.fulfilled, (state, action) => { state.pendingBeneficiaries = action.payload; });
    builder.addCase(addBeneficiary.fulfilled, (state) => { state.success = 'Beneficiary added! Pending admin approval.'; });
    builder.addCase(addBeneficiary.rejected, (state, action) => { state.error = action.payload; });
    builder.addCase(approveBeneficiary.fulfilled, (state) => { state.success = 'Beneficiary approved!'; });
  }
});

export const { clearMessages } = beneficiarySlice.actions;
export default beneficiarySlice.reducer;