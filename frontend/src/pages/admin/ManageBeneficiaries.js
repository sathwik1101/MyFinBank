import React, { useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingBeneficiaries, approveBeneficiary } from '../../store/slices/beneficiarySlice';

const ManageBeneficiaries = () => {
  const dispatch = useDispatch();
  const { pendingBeneficiaries } = useSelector((state) => state.beneficiaries);

  useEffect(() => { dispatch(fetchPendingBeneficiaries()); }, [dispatch]);

  const handleApprove = (beneficiaryId) => {
    dispatch(approveBeneficiary(beneficiaryId)).then(() => dispatch(fetchPendingBeneficiaries()));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Manage Beneficiaries</Typography>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#0d47a1' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Beneficiary ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
              <TableCell sx={{ color: 'white' }}>Name</TableCell>
              <TableCell sx={{ color: 'white' }}>Account Number</TableCell>
              <TableCell sx={{ color: 'white' }}>Branch</TableCell>
              <TableCell sx={{ color: 'white' }}>Status</TableCell>
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingBeneficiaries.map(b => (
              <TableRow key={b.beneficiaryId} hover>
                <TableCell>{b.beneficiaryId}</TableCell>
                <TableCell>{b.customerId}</TableCell>
                <TableCell>{b.beneficiaryName}</TableCell>
                <TableCell>{b.accountNumber}</TableCell>
                <TableCell>{b.branch}</TableCell>
                <TableCell><Chip label={b.status} color="warning" size="small" /></TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="success" onClick={() => handleApprove(b.beneficiaryId)}>Approve</Button>
                </TableCell>
              </TableRow>
            ))}
            {pendingBeneficiaries.length === 0 && (
              <TableRow><TableCell colSpan={7} align="center">No pending beneficiaries</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageBeneficiaries;