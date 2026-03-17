import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const createTicket = createAsyncThunk('support/createTicket', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/support/tickets', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMyTickets = createAsyncThunk('support/fetchMyTickets', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/support/tickets/my');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchAllTickets = createAsyncThunk('support/fetchAllTickets', async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get('/support/tickets/all');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const fetchMessages = createAsyncThunk('support/fetchMessages', async (ticketId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`/support/messages/${ticketId}`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const sendMessage = createAsyncThunk('support/sendMessage', async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post('/support/messages', data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const updateTicketStatus = createAsyncThunk('support/updateTicketStatus', async ({ ticketId, status }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/support/tickets/${ticketId}/status`, { status });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

const supportSlice = createSlice({
  name: 'support',
  initialState: { myTickets: [], allTickets: [], messages: [], loading: false, error: null, success: null },
  reducers: {
    clearMessages: (state) => { state.error = null; state.success = null; },
    addMessage: (state, action) => { state.messages.push(action.payload); }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyTickets.fulfilled, (state, action) => { state.myTickets = action.payload; });
    builder.addCase(fetchAllTickets.fulfilled, (state, action) => { state.allTickets = action.payload; });
    builder.addCase(fetchMessages.fulfilled, (state, action) => { state.messages = action.payload; });
    builder.addCase(createTicket.fulfilled, (state) => { state.success = 'Ticket created!'; });
    builder.addCase(updateTicketStatus.fulfilled, (state) => { state.success = 'Ticket status updated!'; });
  }
});

export const { clearMessages, addMessage } = supportSlice.actions;
export default supportSlice.reducer;