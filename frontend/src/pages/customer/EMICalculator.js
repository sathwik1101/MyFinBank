import React, { useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { calculateEMI } from '../../store/slices/loanSlice';

const EMICalculator = () => {
  const dispatch = useDispatch();
  const { emi } = useSelector((state) => state.loans);
  const [form, setForm] = useState({ loanAmount: '', interestRate: '', tenureMonths: '' });

  const handleCalculate = (e) => {
    e.preventDefault();
    dispatch(calculateEMI({
      loanAmount: Number(form.loanAmount),
      interestRate: Number(form.interestRate),
      tenureMonths: Number(form.tenureMonths)
    }));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">EMI Calculator</Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, borderRadius: 3 }}>
        <form onSubmit={handleCalculate}>
          <TextField fullWidth label="Loan Amount (₹)" type="number" value={form.loanAmount}
            onChange={(e) => setForm({ ...form, loanAmount: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Annual Interest Rate (%)" type="number" value={form.interestRate}
            onChange={(e) => setForm({ ...form, interestRate: e.target.value })} sx={{ mb: 2 }} required />
          <TextField fullWidth label="Tenure (Months)" type="number" value={form.tenureMonths}
            onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })} sx={{ mb: 3 }} required />
          <Button fullWidth variant="contained" type="submit" sx={{ backgroundColor: '#0d47a1', py: 1.5 }}>
            Calculate EMI
          </Button>
        </form>
        {emi && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="h6">Monthly EMI: <strong>₹{emi}</strong></Typography>
            <Typography variant="body2">Total Payment: ₹{(emi * Number(form.tenureMonths)).toFixed(2)}</Typography>
            <Typography variant="body2">Total Interest: ₹{(emi * Number(form.tenureMonths) - Number(form.loanAmount)).toFixed(2)}</Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default EMICalculator;