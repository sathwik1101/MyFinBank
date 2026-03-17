import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, CircularProgress, Card, CardContent, Chip, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addBeneficiary, fetchMyBeneficiaries, clearMessages } from '../../store/slices/beneficiarySlice';

const Beneficiaries = () => {
  const dispatch = useDispatch();
  const { myBeneficiaries, loading, error, success } = useSelector((state) => state.beneficiaries);
  const [form, setForm] = useState({ beneficiaryName: '', accountNumber: '', branch: '' });

  useEffect(() => {
    dispatch(fetchMyBeneficiaries());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBeneficiary(form));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Beneficiaries</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Add Beneficiary</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <TextField fullWidth label="Beneficiary Name" value={form.beneficiaryName}
                onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Account Number" value={form.accountNumber}
                onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} sx={{ mb: 2 }} required />
              <TextField fullWidth label="Branch" value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })} sx={{ mb: 3 }} required />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ backgroundColor: '#0d47a1' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Beneficiary'}
              </Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" mb={2} fontWeight="bold">My Beneficiaries</Typography>
          {myBeneficiaries.map(b => (
            <Card key={b.beneficiaryId} elevation={2} sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography fontWeight="bold">{b.beneficiaryName}</Typography>
                  <Typography variant="body2" color="text.secondary">{b.accountNumber} | {b.branch}</Typography>
                </Box>
                <Chip label={b.status} color={b.status === 'ACTIVE' ? 'success' : 'warning'} size="small" />
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Beneficiaries;