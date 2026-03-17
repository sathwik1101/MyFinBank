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
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={{ xs: 2, md: 4 }}
        color="#0d47a1"
        sx={{ fontSize: { xs: '1.4rem', md: '2.125rem' } }}
      >
        Loans
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>

        {/* Apply for Loan */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Apply for Loan
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth select label="Select Account" value={form.accountNumber}
                onChange={handleAccountChange} sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} required>
                {myAccounts.filter(a => a.status === 'ACTIVE').map(a => (
                  <MenuItem key={a.accountNumber} value={a.accountNumber}>
                    {a.accountNumber} — {a.accountType}
                  </MenuItem>
                ))}
              </TextField>
              <TextField fullWidth label="Loan Amount (₹)" type="number" value={form.loanAmount}
                onChange={(e) => setForm({ ...form, loanAmount: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} required inputProps={{ min: 1000 }} />
              <TextField fullWidth label="Tenure (Months)" type="number" value={form.tenureMonths}
                onChange={(e) => setForm({ ...form, tenureMonths: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} required inputProps={{ min: 1, max: 60 }} />
              <TextField fullWidth select label="Purpose" value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
                {['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan', 'Medical Loan'].map(p => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </TextField>

              {suggestedRate && (
                <Box sx={{ backgroundColor: '#e8f4fd', border: '1px solid #90caf9', borderRadius: 2, p: { xs: 1.5, md: 2 }, mb: 2 }}>
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
                    <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {item.label}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color={item.color || 'text.primary'} sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                  <Divider sx={{ mt: 1.5, mb: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    ⚠️ Final interest rate will be decided by Admin. Actual EMI may vary.
                  </Typography>
                </Box>
              )}

              <Button fullWidth variant="contained" type="submit" disabled={loading}
                sx={{ backgroundColor: '#0d47a1', py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Loan Application'}
              </Button>
            </form>
          </Paper>

          {/* Interest Rate Guide */}
          <Paper elevation={2} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, mt: 2, backgroundColor: '#f8f9fa' }}>
            <Typography variant="body1" fontWeight="bold" mb={2} color="#0d47a1" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
              📊 Interest Rate Guide
            </Typography>
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
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.8, borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.75rem' } }}>
                  {item.range}
                </Typography>
                <Chip label={item.rate} size="small" color="primary" variant="outlined" />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* My Loans */}
        <Grid item xs={12} md={7}>
          <Typography variant="h6" mb={2} fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
            My Loans
          </Typography>
          {myLoans.length === 0 && (
            <Paper elevation={1} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">No loans found. Select an account to view loans.</Typography>
            </Paper>
          )}
          {myLoans.map(loan => (
            <Card key={loan.loanId} elevation={3} sx={{ mb: 2, borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                  <Box>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      {loan.loanId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{loan.purpose}</Typography>
                  </Box>
                  <Chip
                    label={loan.status}
                    size="small"
                    color={
                      loan.status === 'ACTIVE' ? 'success' :
                      loan.status === 'PENDING' ? 'warning' :
                      loan.status === 'CLOSED' ? 'default' : 'error'
                    }
                  />
                </Box>

                <Grid container spacing={1.5}>
                  {[
                    { label: 'Loan Amount', value: `₹${loan.loanAmount?.toLocaleString()}` },
                    { label: 'Interest Rate', value: `${loan.interestRate}% p.a.`, color: '#0d47a1' },
                    { label: 'Monthly EMI', value: `₹${loan.emiAmount?.toLocaleString()}`, color: '#2e7d32' },
                    { label: 'Tenure', value: `${loan.tenureMonths} months` },
                    { label: 'Remaining Balance', value: `₹${loan.remainingBalance?.toLocaleString()}`, color: '#c62828' },
                    ...(loan.startDate ? [{ label: 'Start Date', value: new Date(loan.startDate).toLocaleDateString() }] : []),
                  ].map(item => (
                    <Grid item xs={6} key={item.label}>
                      <Typography variant="caption" color="text.secondary" display="block">{item.label}</Typography>
                      <Typography fontWeight="bold" color={item.color || 'text.primary'} sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                        {item.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {loan.status === 'PENDING' && (
                  <Alert severity="info" sx={{ mt: 2, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    Your loan application is under review. Admin will set the final interest rate and EMI.
                  </Alert>
                )}

                {loan.status === 'CLOSED' && (
                  <Alert severity="success" sx={{ mt: 2, fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    🎉 Loan fully paid off! All EMIs cleared.
                  </Alert>
                )}

                {loan.status === 'ACTIVE' && (
                  <Box sx={{ mt: 2, display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PaymentIcon />}
                      onClick={() => handlePayEMI(loan.loanId)}
                      disabled={loading}
                      sx={{
                        backgroundColor: '#c62828',
                        '&:hover': { backgroundColor: '#b71c1c' },
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                      }}
                    >
                      {loading ? <CircularProgress size={18} color="inherit" /> : 'Pay EMI'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2, textTransform: 'none', fontSize: { xs: '0.75rem', md: '0.875rem' } }}
                      onClick={() => handleViewPayments(loan.loanId)}
                    >
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
              <Typography variant="h6" mb={2} fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                EMI Payment Schedule
              </Typography>
              <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3, overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead sx={{ backgroundColor: '#0d47a1' }}>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>EMI No.</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Amount</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Payment Date</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loanPayments.map(p => (
                      <TableRow key={p.paymentId} hover>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{p.emiNumber}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          ₹{p.amount?.toLocaleString()}
                        </TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, whiteSpace: 'nowrap' }}>
                          {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                        </TableCell>
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