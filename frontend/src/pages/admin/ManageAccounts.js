import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAccounts, updateAccountStatus, createAccount } from '../../store/slices/accountSlice';
import AddIcon from '@mui/icons-material/Add';

const ManageAccounts = () => {
  const dispatch = useDispatch();
  const { allAccounts, success, error } = useSelector((state) => state.accounts);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ customerId: '', accountType: 'SAVINGS' });
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  useEffect(() => { dispatch(fetchAllAccounts()); }, [dispatch]);

  const handleStatus = (accountNumber, status, deactivationType = null) => {
    dispatch(updateAccountStatus({ accountNumber, status, deactivationType })).then(() => dispatch(fetchAllAccounts()));
  };

  const handleCreateAccount = () => {
    if (!form.customerId) { setLocalError('Please enter a Customer ID'); return; }
    setLocalError(null);
    dispatch(createAccount({ customerId: form.customerId, accountType: form.accountType }))
      .then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setLocalSuccess('Account created successfully!');
          setForm({ customerId: '', accountType: 'SAVINGS' });
          dispatch(fetchAllAccounts());
          setTimeout(() => { setOpenDialog(false); setLocalSuccess(null); }, 1500);
        } else {
          setLocalError(res.payload || 'Failed to create account');
        }
      });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 3,
      }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color="#0d47a1"
          sx={{ fontSize: { xs: '1.4rem', md: '2.125rem' } }}
        >
          Manage Accounts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            backgroundColor: '#c62828',
            borderRadius: 2,
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#b71c1c' },
            '&::after': { content: '""', position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: '#f9a825' },
            position: 'relative', overflow: 'hidden',
          }}
        >
          Create Account
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: '#0d47a1' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Account Number</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Customer ID</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Balance</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allAccounts.map(a => (
              <TableRow key={a.accountNumber} hover>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{a.accountNumber}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{a.customerId}</TableCell>
                <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>{a.accountType}</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>₹{a.balance?.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={a.status}
                    color={
                      a.status === 'ACTIVE' ? 'success' :
                      a.status === 'REQUESTED' ? 'warning' :
                      a.status === 'AT_RISK' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {a.status === 'REQUESTED' && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Button size="small" variant="contained" color="success"
                        sx={{ textTransform: 'none', fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                        onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Approve</Button>
                      <Button size="small" variant="contained" color="error"
                        sx={{ textTransform: 'none', fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                        onClick={() => handleStatus(a.accountNumber, 'REJECTED')}>Reject</Button>
                    </Box>
                  )}
                  {a.status === 'ACTIVE' && (
                    <Button size="small" variant="outlined" color="error"
                      sx={{ textTransform: 'none', fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                      onClick={() => handleStatus(a.accountNumber, 'DEACTIVATED', 'MANUAL')}>Deactivate</Button>
                  )}
                  {a.status === 'AT_RISK' && (
                    <Button size="small" variant="outlined" color="success"
                      sx={{ textTransform: 'none', fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                      onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Activate</Button>
                  )}
                  {a.status === 'DEACTIVATED' && a.deactivationType === 'MANUAL' && (
                    <Button size="small" variant="outlined" color="success"
                      sx={{ textTransform: 'none', fontSize: { xs: '0.7rem', md: '0.8rem' } }}
                      onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Activate</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Account Dialog */}
      <Dialog open={openDialog} onClose={() => { setOpenDialog(false); setLocalError(null); setLocalSuccess(null); }} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: '#0d47a1' }}>Create New Account</DialogTitle>
        <DialogContent>
          {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
          {localSuccess && <Alert severity="success" sx={{ mb: 2 }}>{localSuccess}</Alert>}
          <TextField
            fullWidth
            label="Customer ID"
            placeholder="e.g. MYFIN-CUST-0001"
            value={form.customerId}
            onChange={(e) => setForm({ ...form, customerId: e.target.value })}
            sx={{ mb: 2, mt: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            select
            label="Account Type"
            value={form.accountType}
            onChange={(e) => setForm({ ...form, accountType: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            <MenuItem value="SAVINGS">Savings</MenuItem>
            <MenuItem value="CURRENT">Current</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setOpenDialog(false); setLocalError(null); setLocalSuccess(null); }}
            sx={{ textTransform: 'none', color: '#607d8b' }}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAccount}
            sx={{ backgroundColor: '#c62828', textTransform: 'none', borderRadius: 2, '&:hover': { backgroundColor: '#b71c1c' } }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageAccounts;