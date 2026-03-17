import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Paper, MenuItem,
  Alert, CircularProgress, Card, CardContent, Chip,
  Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Divider
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { applyLoan, fetchMyLoans, fetchLoanPayments, payEMI, clearMessages } from '../../store/slices/loanSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';
import InfoIcon from '@mui/icons-material/Info';
import PaymentIcon from '@mui/icons-material/Payment';

const suggestInterestRate = (loanAmount, tenureMonths) => {
  if (!loanAmount || !tenureMonths) return null;
  if (loanAmount <= 50000) return tenureMonths <= 12 ? 10 : 11;
  else if (loanAmount <= 200000) return tenureMonths <= 12 ? 9 : 9.5;
  else return tenureMonths <= 12 ? 8 : 8.5;
};

const calcEMI = (principal, annualRate, tenureMonths) => {
  if (!principal || !annualRate || !tenureMonths) return null;
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
};

const Loans = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { myLoans, loanPayments, loading, error, success } = useSelector((state) => state.loans);
  const [form, setForm] = useState({ accountNumber: '', loanAmount: '', tenureMonths: '', purpose: 'Personal Loan' });
  const [selectedLoan, setSelectedLoan] = useState(null);

  const suggestedRate = suggestInterestRate(Number(form.loanAmount), Number(form.tenureMonths));
  const previewEMI = calcEMI(Number(form.loanAmount), suggestedRate, Number(form.tenureMonths));
  const totalPayment = previewEMI ? (previewEMI * Number(form.tenureMonths)).toFixed(2) : null;
  const totalInterest = totalPayment ? (totalPayment - Number(form.loanAmount)).toFixed(2) : null;

  useEffect(() => {
    dispatch(fetchMyAccounts());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleAccountChange = (e) => {
    setForm({ ...form, accountNumber: e.target.value });
    dispatch(fetchMyLoans(e.target.value));
  };

  const handleViewPayments = (loanId) => {
    setSelectedLoan(loanId);
    dispatch(fetchLoanPayments(loanId));
  };

  const handlePayEMI = (loanId) => {
    const loan = myLoans.find(l => l.loanId === loanId);
    if (!loan) return;
    dispatch(payEMI({ loanId, accountNumber: loan.accountNumber })).then(() => {
      dispatch(fetchMyLoans(loan.accountNumber));
      dispatch(fetchLoanPayments(loanId));
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(applyLoan({
      accountNumber: form.accountNumber,
      loanAmount: Number(form.loanAmount),
      tenureMonths: Number(form.tenureMonths),
      purpose: form.purpose,
    }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" fontWeight="bold" mb={4} color="#0d47a1">Loans</Typography>
      <Grid container spacing={3}>

        {/* Apply for Loan */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">Apply for Loan</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth select label="Select Account" value={form.accountNumber}
                onChange={handleAccountChange} sx={{ mb: 2 }} required>
                {myAccounts.filter(a => a.status === 'ACTIVE').map(a => (
                  <MenuItem key={a.accountNumber} value={a.accountNumber}>
                    {a.accountNumber} — {a.accountType}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Loan Amount (₹)" type="number" value={form.loanAmount}
                onChange={(e) => setForm({ ...form, loanAmount: e.target.value })}
                sx={{ mb: 2 }} required inputProps={{ min: 1000 }} />
              <TextField fullWidth label="Tenure (Months)" type="number" value={form.tenureMonths}
                onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
                sx={{ mb: 2 }} required inputProps={{ min: 1, max: 60 }} />
              <TextField fullWidth select label="Purpose" value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })} sx={{ mb: 2 }}>
                {['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan', 'Medical Loan'].map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>

              {suggestedRate && (
                <Box sx={{ backgroundColor: '#e8f4fd', border: '1px solid #90caf9', borderRadius: 2, p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <InfoIcon sx={{ color: '#1565c0', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="bold" color="#1565c0">Loan Preview</Typography>
                  </Box>
                  <Divider sx={{ mb: 1.5 }} />
                  {[
                    { label: 'Suggested Interest Rate', value: `${suggestedRate}% per annum`, color: '#1565c0' },
                    { label: 'Estimated Monthly EMI', value: `₹${previewEMI?.toLocaleString()}`, color: '#2e7d32' },
                    { label: 'Total Payment', value: `₹${Number(totalPayment)?.toLocaleString()}` },
                    { label: 'Total Interest', value: `₹${Number(totalInterest)?.toLocaleString()}`, color: '#c62828' },
                  ].map(item => (
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight="bold" color={item.color || 'text.primary'}>{item.value}</Typography>
                    </Box>
                  ))}
                  <Divider sx={{ mt: 1.5, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    ⚠️ Final interest rate will be decided by Admin. Actual EMI may vary.
                  </Typography>
                </Box>
              )}

              <Button fullWidth variant="contained" type="submit" disabled={loading}
                sx={{ backgroundColor: '#0d47a1', py: 1.5, borderRadius: 2 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Loan Application'}
              </Button>
            </form>
          </Paper>

          {/* Interest Rate Guide */}
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" fontWeight="bold" mb={2} color="#0d47a1">📊 Interest Rate Guide</Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
              Rates are indicative and subject to admin approval
            </Typography>
            {[
              { range: 'Up to ₹50,000 (≤12 months)', rate: '10%' },
              { range: 'Up to ₹50,000 (>12 months)', rate: '11%' },
              { range: '₹50,001 – ₹2,00,000 (≤12 months)', rate: '9%' },
              { range: '₹50,001 – ₹2,00,000 (>12 months)', rate: '9.5%' },
              { range: 'Above ₹2,00,000 (≤12 months)', rate: '8%' },
              { range: 'Above ₹2,00,000 (>12 months)', rate: '8.5%' },
            ].map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="caption" color="text.secondary">{item.range}</Typography>
                <Chip label={item.rate} size="small" color="primary" variant="outlined" />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* My Loans */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" mb={2} fontWeight="bold">My Loans</Typography>
          {myLoans.length === 0 && (
            <Paper elevation={1} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No loans found. Select an account to view loans.</Typography>
            </Paper>
          )}
          {myLoans.map(loan => (
            <Card key={loan.loanId} elevation={3} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box>
                    <Typography fontWeight="bold" variant="h6">{loan.loanId}</Typography>
                    <Typography variant="body2" color="text.secondary">{loan.purpose}</Typography>
                  </Box>
                  <Chip
                    label={loan.status}
                    color={loan.status === 'ACTIVE' ? 'success' : loan.status === 'PENDING' ? 'warning' : loan.status === 'CLOSED' ? 'default' : 'error'}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Loan Amount</Typography>
                    <Typography fontWeight="bold">₹{loan.loanAmount?.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                    <Typography fontWeight="bold" color="#0d47a1">{loan.interestRate}% p.a.</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Monthly EMI</Typography>
                    <Typography fontWeight="bold" color="#2e7d32">₹{loan.emiAmount?.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tenure</Typography>
                    <Typography fontWeight="bold">{loan.tenureMonths} months</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Remaining Balance</Typography>
                    <Typography fontWeight="bold" color="#c62828">₹{loan.remainingBalance?.toLocaleString()}</Typography>
                  </Grid>
                  {loan.startDate && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Start Date</Typography>
                      <Typography fontWeight="bold">{new Date(loan.startDate).toLocaleDateString()}</Typography>
                    </Grid>
                  )}
                </Grid>

                {loan.status === 'PENDING' && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Your loan application is under review. Admin will set the final interest rate and EMI.
                  </Alert>
                )}

                {loan.status === 'CLOSED' && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    🎉 Loan fully paid off! All EMIs cleared.
                  </Alert>
                )}

                {loan.status === 'ACTIVE' && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1.5 }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={() => handlePayEMI(loan.loanId)}
                      disabled={loading}
                      sx={{ backgroundColor: '#c62828', '&:hover': { backgroundColor: '#b71c1c' }, borderRadius: 2 }}
                    >
                      {loading ? <CircularProgress size={18} color="inherit" /> : 'Pay EMI'}
                    </Button>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}
                      onClick={() => handleViewPayments(loan.loanId)}>
                      View EMI Schedule
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}

          {/* EMI Schedule */}
          {selectedLoan && loanPayments.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" mb={2} fontWeight="bold">EMI Payment Schedule</Typography>
              <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#0d47a1' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white' }}>EMI No.</TableCell>
                      <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                      <TableCell sx={{ color: 'white' }}>Payment Date</TableCell>
                      <TableCell sx={{ color: 'white' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loanPayments.map(p => (
                      <TableRow key={p.paymentId} hover>
                        <TableCell>{p.emiNumber}</TableCell>
                        <TableCell>₹{p.amount?.toLocaleString()}</TableCell>
                        <TableCell>{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>
                          <Chip label={p.status} color={p.status === 'PAID' ? 'success' : 'warning'} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Loans;