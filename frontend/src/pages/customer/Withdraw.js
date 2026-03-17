import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { withdrawMoney, clearMessages } from '../../store/slices/transactionSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';

const Withdraw = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { loading, error, success } = useSelector((state) => state.transactions);
  const [form, setForm] = useState({ accountNumber: '', amount: '', description: 'Withdrawal' });

  useEffect(() => { dispatch(fetchMyAccounts()); return () => dispatch(clearMessages()); }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(withdrawMoney({ ...form, amount: Number(form.amount) }));
  };

  const activeAccounts = myAccounts.filter(a => a.status === 'ACTIVE');

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Withdraw Money</Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, borderRadius: 3 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth select label="Select Account" value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} sx={{ mb: 2 }} required>
            {activeAccounts.map(a => (
              <MenuItem key={a.accountNumber} value={a.accountNumber}>
              {a.accountNumber} — {a.accountType}
              </MenuItem>
            ))}
          </TextField>
          <TextField fullWidth label="Amount (₹)" type="number" value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} sx={{ mb: 2 }} required inputProps={{ min: 1 }} />
          <TextField fullWidth label="Description" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mb: 3 }} />
          <Button fullWidth variant="contained" type="submit" disabled={loading}
            sx={{ backgroundColor: '#b71c1c', py: 1.5 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Withdraw Money'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Withdraw;