import React, { useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAccounts, updateAccountStatus } from '../../store/slices/accountSlice';

const ManageAccounts = () => {
  const dispatch = useDispatch();
  const { allAccounts } = useSelector((state) => state.accounts);

  useEffect(() => { dispatch(fetchAllAccounts()); }, [dispatch]);

  const handleStatus = (accountNumber, status, deactivationType = null) => {
    dispatch(updateAccountStatus({ accountNumber, status, deactivationType })).then(() => dispatch(fetchAllAccounts()));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Manage Accounts</Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0d47a1' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Account Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Type</TableCell>
              <TableCell sx={{ color: 'white' }}>Balance</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allAccounts.map(a => (
              <TableRow key={a.accountNumber} hover>
                <TableCell>{a.accountNumber}</TableCell>
                <TableCell>{a.customerId}</TableCell>
                <TableCell>{a.accountType}</TableCell>
                <TableCell>₹{a.balance?.toLocaleString()}</TableCell>
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
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained" color="success" onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Approve</Button>
                      <Button size="small" variant="contained" color="error" onClick={() => handleStatus(a.accountNumber, 'REJECTED')}>Reject</Button>
                    </Box>
                  )}
                  {a.status === 'ACTIVE' && (
                    <Button size="small" variant="outlined" color="error" onClick={() => handleStatus(a.accountNumber, 'DEACTIVATED', 'MANUAL')}>Deactivate</Button>
                  )}
                  {a.status === 'AT_RISK' && (
                    <Button size="small" variant="outlined" color="success" onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Activate</Button>
                  )}
                  {a.status === 'DEACTIVATED' && a.deactivationType === 'MANUAL' && (
                    <Button size="small" variant="outlined" color="success" onClick={() => handleStatus(a.accountNumber, 'ACTIVE')}>Activate</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageAccounts;