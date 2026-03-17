import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import transactionReducer from './slices/transactionSlice';
import loanReducer from './slices/loanSlice';
import fdReducer from './slices/fdSlice';
import rdReducer from './slices/rdSlice';
import beneficiaryReducer from './slices/beneficiarySlice';
import supportReducer from './slices/supportSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    transactions: transactionReducer,
    loans: loanReducer,
    fd: fdReducer,
    rd: rdReducer,
    beneficiaries: beneficiaryReducer,
    support: supportReducer,
  }
});

export default store;