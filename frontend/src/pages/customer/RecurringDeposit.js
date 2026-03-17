import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, MenuItem, Alert, CircularProgress, Grid, Card, CardContent, Chip, LinearProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createRD, fetchMyRDs, payRDInstallment, clearMessages } from '../../store/slices/rdSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';

const RecurringDeposit = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { myRDs, loading, error, success } = useSelector((state) => state.rd);
  const [form, setForm] = useState({ accountNumber: '', monthlyAmount: '', tenureMonths: 12, interestRate: 6 });

  useEffect(() => {
    dispatch(fetchMyAccounts());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleAccountChange = (e) => {
    setForm({ ...form, accountNumber: e.target.value });
    dispatch(fetchMyRDs(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createRD({ ...form, monthlyAmount: Number(form.monthlyAmount), tenureMonths: Number(form.tenureMonths) }));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Recurring Deposits</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Create Recurring Deposit</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth select label="Account" value={form.accountNumber} onChange={handleAccountChange} sx={{ mb: 2 }} required>
                {myAccounts.filter(a => a.status === 'ACTIVE').map(a => (
                  <MenuItem key={a.accountNumber} value={a.accountNumber}>{a.accountNumber} — {a.accountType}</MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Monthly Amount (₹)" type="number" value={form.monthlyAmount}
                onChange={(e) => setForm({ ...form, monthlyAmount: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Tenure (Months)" type="number" value={form.tenureMonths}
                onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Interest Rate (%)" type="number" value={form.interestRate}
                onChange={(e) => setForm({ ...form, interestRate: e.target.value })} sx={{ mb: 3 }} required />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ backgroundColor: '#0d47a1' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create RD'}
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" mb={2} fontWeight="bold">My Recurring Deposits</Typography>
          {myRDs.map(rd => (
            <Card key={rd.rdId} elevation={3} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography fontWeight="bold">{rd.rdId}</Typography>
                  <Chip label={rd.status} color={rd.status === 'ACTIVE' ? 'success' : 'default'} size="small" />
                </Box>
                <Typography>Monthly: ₹{rd.monthlyAmount} | Tenure: {rd.tenureMonths} months</Typography>
                <Typography>Paid: {rd.paidInstallments} / {rd.tenureMonths} installments</Typography>
                <LinearProgress variant="determinate" value={(rd.paidInstallments / rd.tenureMonths) * 100} sx={{ my: 1, height: 8, borderRadius: 4 }} />
                <Typography variant="body2">Maturity: {new Date(rd.maturityDate).toLocaleDateString()}</Typography>
                {rd.status === 'ACTIVE' && rd.paidInstallments < rd.tenureMonths && (
                  <Button size="small" variant="outlined" sx={{ mt: 1 }} onClick={() => dispatch(payRDInstallment(rd.rdId))}>
                    Pay Next Installment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecurringDeposit;