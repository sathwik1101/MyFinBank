import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { transferMoney, clearMessages } from '../../store/slices/transactionSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';
import { fetchMyBeneficiaries } from '../../store/slices/beneficiarySlice';

const Transfer = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { myBeneficiaries } = useSelector((state) => state.beneficiaries);
  const { loading, error, success } = useSelector((state) => state.transactions);
  const [form, setForm] = useState({ fromAccountNumber: '', toAccountNumber: '', amount: '', description: 'Fund Transfer' });

  useEffect(() => {
    dispatch(fetchMyAccounts());
    dispatch(fetchMyBeneficiaries());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleBeneficiarySelect = (accountNumber) => {
    setForm({ ...form, toAccountNumber: accountNumber });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(transferMoney({ ...form, amount: Number(form.amount) }));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Fund Transfer</Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, borderRadius: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth select label="From Account" value={form.fromAccountNumber}
            onChange={(e) => setForm({ ...form, fromAccountNumber: e.target.value })} sx={{ mb: 2 }} required>
            {myAccounts.filter(a => a.status === 'ACTIVE').map(a => (
              <MenuItem key={a.accountNumber} value={a.accountNumber}>
                {a.accountNumber} — {a.accountType}
              </MenuItem>
            ))}
          </TextField>
          {myBeneficiaries.length > 0 && (
            <TextField fullWidth select label="Select Beneficiary (Optional)" value=""
              onChange={(e) => handleBeneficiarySelect(e.target.value)} sx={{ mb: 2 }}>
              {myBeneficiaries.map(b => (
                <MenuItem key={b.beneficiaryId} value={b.accountNumber}>
                  {b.beneficiaryName} - {b.accountNumber}
                </MenuItem>
              ))}
            </TextField>
          )}
          <TextField fullWidth label="To Account Number" value={form.toAccountNumber}
            onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Amount (₹)" type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} sx={{ mb: 2 }} required inputProps={{ min: 1 }} />
          <TextField fullWidth label="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mb: 3 }} />
          <Button fullWidth variant="contained" type="submit" disabled={loading}
            sx={{ backgroundColor: '#0d47a1', py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Transfer Money'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Transfer;