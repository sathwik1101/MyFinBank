import React, { useEffect, useState } from 'react';
import { Box, Typography, MenuItem, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPassbook } from '../../store/slices/transactionSlice';
import { fetchMyAccounts } from '../../store/slices/accountSlice';

const Passbook = () => {
  const dispatch = useDispatch();
  const { myAccounts } = useSelector((state) => state.accounts);
  const { passbook } = useSelector((state) => state.transactions);
  const [selectedAccount, setSelectedAccount] = useState('');

  useEffect(() => { dispatch(fetchMyAccounts()); }, [dispatch]);

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
    dispatch(fetchPassbook(e.target.value));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Passbook</Typography>
      <TextField select label="Select Account" value={selectedAccount} onChange={handleAccountChange} sx={{ mb: 3, minWidth: 300 }}>
        {myAccounts.map(a => (
          <MenuItem key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} - {a.accountType}
          </MenuItem>
        ))}
      </TextField>
      {passbook.length > 0 && (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#0d47a1' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Date</TableCell>
                <TableCell sx={{ color: 'white' }}>Transaction ID</TableCell>
                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                <TableCell sx={{ color: 'white' }}>Type</TableCell>
                <TableCell sx={{ color: 'white' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white' }}>Balance After</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passbook.map((txn) => (
                <TableRow key={txn._id} hover>
                  <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                  <TableCell>{txn.txnId}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell>
                    <Chip label={txn.type} color={txn.type === 'CREDIT' ? 'success' : 'error'} size="small" />
                  </TableCell>
                  <TableCell sx={{ color: txn.type === 'CREDIT' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell>₹{txn.balanceAfterTxn?.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {selectedAccount && passbook.length === 0 && (
        <Typography color="text.secondary">No transactions found.</Typography>
      )}
    </Box>
  );
};

export default Passbook;