import React, { useEffect, useState } from 'react';
import {
  Box, Typography, MenuItem, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Chip
} from '@mui/material';
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
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        color="#0d47a1"
        sx={{ fontSize: { xs: '1.4rem', md: '2.125rem' } }}
      >
        Passbook
      </Typography>

      <TextField
        select
        label="Select Account"
        value={selectedAccount}
        onChange={handleAccountChange}
        sx={{
          mb: 3,
          width: { xs: '100%', sm: 300 },
          '& .MuiOutlinedInput-root': { borderRadius: 2 }
        }}
      >
        {myAccounts.map(a => (
          <MenuItem key={a.accountNumber} value={a.accountNumber}>
            {a.accountNumber} - {a.accountType}
          </MenuItem>
        ))}
      </TextField>

      {passbook.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 600 }}>
            <TableHead sx={{ backgroundColor: '#0d47a1' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Transaction ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Amount</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'nowrap' }}>Balance After</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {passbook.map((txn) => (
                <TableRow key={txn._id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    {new Date(txn.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                    {txn.txnId}
                  </TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, maxWidth: { xs: 120, md: 'none' }, wordBreak: 'break-word' }}>
                    {txn.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={txn.type}
                      color={txn.type === 'CREDIT' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{
                    color: txn.type === 'CREDIT' ? 'green' : 'red',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    fontSize: { xs: '0.75rem', md: '0.875rem' }
                  }}>
                    {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                    ₹{txn.balanceAfterTxn?.toLocaleString()}
                  </TableCell>
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