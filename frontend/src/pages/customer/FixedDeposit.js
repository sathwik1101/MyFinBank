import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Alert, CircularProgress, Grid, Card, CardContent, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createFD, fetchMyFDs, clearMessages } from '../../store/slices/fdSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';

const FixedDeposit = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { myFDs, loading, error, success } = useSelector((state) => state.fd);
  const [form, setForm] = useState({ accountNumber: '', amount: '', interestRate: 7, tenureMonths: 12 });

  useEffect(() => {
    dispatch(fetchMyAccounts());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleAccountChange = (e) => {
    setForm({ ...form, accountNumber: e.target.value });
    dispatch(fetchMyFDs(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createFD({ ...form, amount: Number(form.amount), tenureMonths: Number(form.tenureMonths) }));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Fixed Deposits</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Create Fixed Deposit</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth select label="Account" value={form.accountNumber} onChange={handleAccountChange} sx={{ mb: 2 }} required>
                {myAccounts.filter(a => a.status === 'ACTIVE').map(a => (
                  <MenuItem key={a.accountNumber} value={a.accountNumber}>{a.accountNumber} — {a.accountType}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Amount (₹)" type="number" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Interest Rate (%)" type="number" value={form.interestRate}
                onChange={(e) => setForm({ ...form, interestRate: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Tenure (Months)" type="number" value={form.tenureMonths}
                onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} sx={{ mb: 3 }} required />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ backgroundColor: '#0d47a1' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create FD'}
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" mb={2} fontWeight="bold">My Fixed Deposits</Typography>
          {myFDs.map(fd => (
            <Card key={fd.fdId} elevation={3} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight="bold">{fd.fdId}</Typography>
                  <Chip label={fd.status} color={fd.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                </Box>
                <Typography>Amount: ₹{fd.amount?.toLocaleString()} | Rate: {fd.interestRate}%</Typography>
                <Typography>Maturity Amount: ₹{fd.maturityAmount?.toLocaleString()}</Typography>
                <Typography>Start: {new Date(fd.startDate).toLocaleDateString()} | Maturity: {new Date(fd.maturityDate).toLocaleDateString()}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default FixedDeposit;