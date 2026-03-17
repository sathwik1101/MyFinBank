import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAccounts, fetchPendingAccounts } from '../../store/slices/accountSlice';
import { fetchPendingLoans } from '../../store/slices/loanSlice';
import { fetchAllTickets } from '../../store/slices/supportSlice';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

const StatCard = ({ title, value, icon, color }) => (
  <Card elevation={4} sx={{ borderRadius: 3, background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: 'white' }}>
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{title}</Typography>
        <Typography variant="h4" fontWeight="bold">{value}</Typography>
      </Box>
      <Box sx={{ fontSize: 40, opacity: 0.8 }}>{icon}</Box>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { pendingAccounts, allAccounts } = useSelector((state) => state.accounts);
  const { pendingLoans } = useSelector((state) => state.loans);
  const { allTickets } = useSelector((state) => state.support);

  useEffect(() => {
    dispatch(fetchAllAccounts());
    dispatch(fetchPendingAccounts());
    dispatch(fetchPendingLoans());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const openTickets = allTickets.filter(t => t.status === 'OPEN').length;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Accounts" value={allAccounts.length} icon={<AccountBalanceIcon />} color="#0d47a1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Accounts" value={pendingAccounts.length} icon={<PeopleIcon />} color="#e65100" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Loans" value={pendingLoans.length} icon={<CreditCardIcon />} color="#1b5e20" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Open Tickets" value={openTickets} icon={<SupportAgentIcon />} color="#4a148c" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;