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
      <Typography variant="h4" fontWeight="bold" mb={4} color="#0d47a1">Manage Loans</Typography>

      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {pendingLoans.length === 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No pending loan applications</Typography>
        </Paper>
      )}

      <Grid container spacing={3}>
        {pendingLoans.map(loan => (
          <Grid item xs={12} md={6} key={loan.loanId}>
            <Card elevation={3} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography fontWeight="bold" variant="h6">{loan.loanId}</Typography>
                    <Typography variant="body2" color="text.secondary">{loan.purpose}</Typography>
                  </Box>
                  <Chip label="PENDING" color="warning" />
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Loan Details */}
                <Grid container spacing={1.5} mb={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Account</Typography>
                    <Typography fontWeight="bold" variant="body2">{loan.accountNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Loan Amount</Typography>
                    <Typography fontWeight="bold" variant="body2">₹{loan.loanAmount?.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tenure</Typography>
                    <Typography fontWeight="bold" variant="body2">{loan.tenureMonths} months</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Suggested Rate</Typography>
                    <Typography fontWeight="bold" variant="body2" color="#1565c0">{loan.interestRate}% p.a.</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Suggested EMI</Typography>
                    <Typography fontWeight="bold" variant="body2" color="#2e7d32">₹{loan.emiAmount?.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Applied On</Typography>
                    <Typography fontWeight="bold" variant="body2">{new Date(loan.createdAt).toLocaleDateString()}</Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />

                {/* Admin Sets Interest Rate */}
                <Box sx={{ backgroundColor: '#f3f4f6', borderRadius: 2, p: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold" mb={1} color="#0d47a1">
                    🏦 Set Final Interest Rate
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
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
                  />
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={() => handleApprove(loan.loanId)}
                  >
                    ✅ Approve
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    onClick={() => handleReject(loan.loanId)}
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