import React, { useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { useState } from 'react';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    const res = await axiosInstance.get('/customers');
    setCustomers(res.data);
    setLoading(false);
  };

  const handleStatusUpdate = async (customerId, status) => {
    await axiosInstance.put(`/customers/${customerId}/status`, { status });
    fetchCustomers();
  };

  useEffect(() => { fetchCustomers(); }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Manage Customers</Typography>
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0d47a1' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Customer ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Email</TableCell>
                <TableCell sx={{ color: 'white' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white' }}>Gov ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Status</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.customerId} hover>
                  <TableCell>{c.customerId}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell>{c.govIdType}: {c.govIdNumber}</TableCell>
                  <TableCell>
                    <Chip label={c.status} color={c.status === 'ACTIVE' ? 'success' : c.status === 'PENDING_VERIFICATION' ? 'warning' : 'error'} size="small" />
                  </TableCell>
                  <TableCell>
                    {c.status === 'PENDING_VERIFICATION' && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(c.customerId, 'ACTIVE')}>Approve</Button>
                        <Button size="small" variant="contained" color="error" onClick={() => handleStatusUpdate(c.customerId, 'REJECTED')}>Reject</Button>
                      </Box>
                    )}
                    {c.status === 'ACTIVE' && (
                      <Button size="small" variant="outlined" color="error" onClick={() => handleStatusUpdate(c.customerId, 'REJECTED')}>Deactivate</Button>
                    )}
                    {c.status === 'REJECTED' && (
                      <Button size="small" variant="outlined" color="success" onClick={() => handleStatusUpdate(c.customerId, 'ACTIVE')}>Activate</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ManageCustomers;