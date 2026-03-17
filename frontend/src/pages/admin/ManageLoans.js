import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  TextField, Alert, Divider, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingLoans, updateLoanStatus } from '../../store/slices/loanSlice';

const ManageLoans = () => {
  const dispatch = useDispatch();
  const { pendingLoans, success, error } = useSelector((state) => state.loans);
  const [interestRates, setInterestRates] = useState({});

  useEffect(() => { dispatch(fetchPendingLoans()); }, [dispatch]);

  const handleRateChange = (loanId, value) => {
    setInterestRates(prev => ({ ...prev, [loanId]: value }));
  };

  const handleApprove = (loanId) => {
    const rate = interestRates[loanId];
    dispatch(updateLoanStatus({
      loanId,
      status: 'ACTIVE',
      interestRate: rate ? Number(rate) : null
    })).then(() => dispatch(fetchPendingLoans()));
  };

  const handleReject = (loanId) => {
    dispatch(updateLoanStatus({ loanId, status: 'REJECTED' }))
      .then(() => dispatch(fetchPendingLoans()));
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
        Manage Loans
      </Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {pendingLoans.length === 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No pending loan applications</Typography>
        </Paper>
      )}

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {pendingLoans.map(loan => (
          <Grid item xs={12} md={6} key={loan.loanId}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>

                {/* Header */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 2,
                  gap: 1,
                }}>
                  <Box>
                    <Typography
                      fontWeight="bold"
                      sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                    >
                      {loan.loanId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{loan.purpose}</Typography>
                  </Box>
                  <Chip label="PENDING" color="warning" size="small" />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Loan Details */}
                <Grid container spacing={1.5} mb={2}>
                  {[
                    { label: 'Account', value: loan.accountNumber },
                    { label: 'Loan Amount', value: `₹${loan.loanAmount?.toLocaleString()}` },
                    { label: 'Tenure', value: `${loan.tenureMonths} months` },
                    { label: 'Suggested Rate', value: `${loan.interestRate}% p.a.`, color: '#1565c0' },
                    { label: 'Suggested EMI', value: `₹${loan.emiAmount?.toLocaleString()}`, color: '#2e7d32' },
                    { label: 'Applied On', value: new Date(loan.createdAt).toLocaleDateString() },
                  ].map((item) => (
                    <Grid item xs={6} key={item.label}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.label}
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        variant="body2"
                        color={item.color || 'text.primary'}
                        sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, wordBreak: 'break-word' }}
                      >
                        {item.value}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ mb: 2 }} />

                {/* Admin Sets Interest Rate */}
                <Box sx={{ backgroundColor: '#f3f4f6', borderRadius: 2, p: { xs: 1.5, md: 2 }, mb: 2 }}>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    mb={1}
                    color="#0d47a1"
                    sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    🏦 Set Final Interest Rate
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    mb={1.5}
                  >
                    Suggested rate is {loan.interestRate}%. You can override it below before approving.
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    label="Final Interest Rate (% p.a.)"
                    type="number"
                    placeholder={`Suggested: ${loan.interestRate}%`}
                    value={interestRates[loan.loanId] || ''}
                    onChange={(e) => handleRateChange(loan.loanId, e.target.value)}
                    inputProps={{ min: 1, max: 30, step: 0.5 }}
                    helperText="Leave empty to use suggested rate"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: { xs: 1, md: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(loan.loanId)}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(loan.loanId)}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                  >
                    ❌ Reject
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ManageLoans;