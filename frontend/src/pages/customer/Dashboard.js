import React, { useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, Chip, CircularProgress, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyAccounts } from '../../store/slices/accountSlice';
import { fetchPassbook } from '../../store/slices/transactionSlice';
import { fetchMyLoans } from '../../store/slices/loanSlice';
import { useNavigate } from 'react-router-dom';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import RepeatIcon from '@mui/icons-material/Repeat';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalculateIcon from '@mui/icons-material/Calculate';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myAccounts, loading } = useSelector((state) => state.accounts);
  const { passbook } = useSelector((state) => state.transactions);
  const { myLoans } = useSelector((state) => state.loans);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => { dispatch(fetchMyAccounts()); }, [dispatch]);

  useEffect(() => {
    if (myAccounts.length > 0) {
      const savingsAccount = myAccounts.find(a => a.accountType === 'SAVINGS');
      if (savingsAccount) {
        dispatch(fetchPassbook(savingsAccount.accountNumber));
        dispatch(fetchMyLoans(savingsAccount.accountNumber));
      }
    }
  }, [myAccounts, dispatch]);

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'success';
    if (status === 'AT_RISK') return 'warning';
    if (status === 'DEACTIVATED') return 'error';
    return 'default';
  };

  const totalBalance = myAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const activeAccounts = myAccounts.filter(a => a.status === 'ACTIVE').length;
  const activeLoans = myLoans.filter(l => l.status === 'ACTIVE').length;
  const recentTransactions = passbook.slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const quickActions = [
    { label: 'Deposit', icon: <AddCircleOutlineIcon />, path: '/deposit', color: '#0d47a1', bg: '#e3f2fd' },
    { label: 'Withdraw', icon: <AccountBalanceWalletIcon />, path: '/withdraw', color: '#b71c1c', bg: '#ffebee' },
    { label: 'Transfer', icon: <SwapHorizIcon />, path: '/transfer', color: '#1b5e20', bg: '#e8f5e9' },
    { label: 'Apply Loan', icon: <CreditCardIcon />, path: '/loans', color: '#e65100', bg: '#fff3e0' },
    { label: 'Fixed Deposit', icon: <SavingsOutlinedIcon />, path: '/fixed-deposit', color: '#4a148c', bg: '#f3e5f5' },
    { label: 'Recurring Deposit', icon: <RepeatIcon />, path: '/recurring-deposit', color: '#006064', bg: '#e0f7fa' },
    { label: 'EMI Calculator', icon: <CalculateIcon />, path: '/emi-calculator', color: '#37474f', bg: '#f5f5f5' },
    { label: 'Support', icon: <SupportAgentIcon />, path: '/support', color: '#880e4f', bg: '#fce4ec' },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>

      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 1.5, sm: 0 },
        mb: { xs: 2, md: 4 },
        pb: { xs: 2, md: 3 },
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#0d47a1"
            sx={{ fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2.125rem' } }}
          >
            {greeting}, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={0.5}>
            Here's your financial overview
          </Typography>
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            backgroundColor: 'white',
            px: 2, py: 1,
            borderRadius: 2,
            boxShadow: 1,
            fontSize: { xs: '0.7rem', sm: '0.875rem' },
            whiteSpace: { xs: 'normal', sm: 'nowrap' },
          }}
        >
          📅 {today}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* Stats Row */}
          <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 4 }}>
            {[
              { label: 'Total Balance', value: `₹${totalBalance.toLocaleString()}`, color: '#0d47a1', border: '#0d47a1', icon: '💰' },
              { label: 'Active Accounts', value: activeAccounts, color: '#2e7d32', border: '#2e7d32', icon: '🏦' },
              { label: 'Active Loans', value: activeLoans, color: '#e65100', border: '#e65100', icon: '💳' },
              { label: 'Pending Requests', value: myAccounts.filter(a => a.status === 'REQUESTED').length, color: '#6a1b9a', border: '#6a1b9a', icon: '⏳' },
            ].map((stat) => (
              <Grid item xs={6} sm={6} md={3} key={stat.label}>
                <Card elevation={2} sx={{
                  borderRadius: 3,
                  borderTop: `4px solid ${stat.border}`,
                  borderLeft: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
                }}>
                  <CardContent sx={{ p: { xs: 1.5, md: 3 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" mb={1} sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                          {stat.label}
                        </Typography>
                        <Typography fontWeight="bold" color={stat.color} sx={{ fontSize: { xs: '1.2rem', md: '2.125rem' } }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: { xs: 24, md: 36 } }}>{stat.icon}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Accounts + Transactions */}
          <Grid container spacing={{ xs: 2, md: 3 }} mb={{ xs: 2, md: 4 }}>

            {/* My Accounts */}
            <Grid item xs={12} md={5}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      🏦 My Accounts
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}
                      onClick={() => navigate('/passbook')}>View All →</Button>
                  </Box>
                  {myAccounts.map(account => (
                    <Box key={account.accountNumber} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: { xs: 1.5, md: 2.5 },
                      mb: 2,
                      borderRadius: 2,
                      background: account.accountType === 'SAVINGS'
                        ? 'linear-gradient(135deg, #e8eaf6, #c5cae9)'
                        : 'linear-gradient(135deg, #ffebee, #ffcdd2)',
                      border: `1px solid ${account.accountType === 'SAVINGS' ? '#9fa8da' : '#ef9a9a'}`,
                      flexWrap: { xs: 'wrap', sm: 'nowrap' },
                      gap: 1,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {account.accountType === 'SAVINGS'
                          ? <SavingsIcon sx={{ color: '#0d47a1', fontSize: { xs: 28, md: 36 } }} />
                          : <AccountBalanceIcon sx={{ color: '#b71c1c', fontSize: { xs: 28, md: 36 } }} />}
                        <Box>
                          <Typography fontWeight="bold" variant="body1"
                            color={account.accountType === 'SAVINGS' ? '#0d47a1' : '#b71c1c'}
                            sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                            {account.accountNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', md: '0.875rem' } }}>
                            {account.accountType} Account
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography fontWeight="bold"
                          color={account.accountType === 'SAVINGS' ? '#0d47a1' : '#b71c1c'}
                          sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          ₹{account.balance?.toLocaleString()}
                        </Typography>
                        <Chip label={account.status} color={getStatusColor(account.status)} size="small" sx={{ mt: 0.5 }} />
                      </Box>
                    </Box>
                  ))}
                  {myAccounts.length === 0 && (
                    <Typography color="text.secondary" textAlign="center" py={4}>No accounts found</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Transactions */}
            <Grid item xs={12} md={7}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                      📋 Recent Transactions
                    </Typography>
                    <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}
                      onClick={() => navigate('/passbook')}>View All →</Button>
                  </Box>
                  {recentTransactions.length > 0 ? recentTransactions.map((txn, index) => (
                    <Box key={txn._id} sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1.5,
                      px: { xs: 1, md: 2 },
                      mb: 1,
                      borderRadius: 2,
                      backgroundColor: index % 2 === 0 ? '#fafafa' : 'white',
                      border: '1px solid #f0f0f0',
                      '&:hover': { backgroundColor: '#f5f5f5' },
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 } }}>
                        <Box sx={{
                          width: { xs: 36, md: 44 }, height: { xs: 36, md: 44 },
                          borderRadius: '50%',
                          backgroundColor: txn.type === 'CREDIT' ? '#e8f5e9' : '#ffebee',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          {txn.type === 'CREDIT'
                            ? <ArrowUpwardIcon sx={{ color: '#2e7d32', fontSize: { xs: 18, md: 22 } }} />
                            : <ArrowDownwardIcon sx={{ color: '#c62828', fontSize: { xs: 18, md: 22 } }} />}
                        </Box>
                        <Box>
                          <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                            {txn.transactionCategory}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
                            {new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' • '}
                            {new Date(txn.date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography fontWeight="bold"
                        color={txn.type === 'CREDIT' ? '#2e7d32' : '#c62828'}
                        sx={{ fontSize: { xs: '0.9rem', md: '1.25rem' }, flexShrink: 0 }}>
                        {txn.type === 'CREDIT' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                      </Typography>
                    </Box>
                  )) : (
                    <Typography color="text.secondary" textAlign="center" py={4}>No transactions yet</Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Quick Actions */}
          <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" fontWeight="bold" mb={2} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
                ⚡ Quick Actions
              </Typography>
              <Grid container spacing={{ xs: 1, md: 2 }}>
                {quickActions.map((action) => (
                  <Grid item xs={4} sm={3} md={1.5} key={action.label}>
                    <Box onClick={() => navigate(action.path)} sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: { xs: 1.5, md: 2.5 },
                      borderRadius: 3,
                      backgroundColor: action.bg,
                      cursor: 'pointer',
                      gap: 1,
                      minHeight: { xs: 75, md: 95 },
                      border: `1px solid ${action.color}22`,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 20px ${action.color}33`,
                        border: `1px solid ${action.color}55`,
                      },
                    }}>
                      <Box sx={{ color: action.color, fontSize: { xs: 22, md: 28 } }}>{action.icon}</Box>
                      <Typography fontWeight="bold" color={action.color} textAlign="center"
                        sx={{ fontSize: { xs: '0.6rem', md: '0.688rem' }, lineHeight: 1.3 }}>
                        {action.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* AT_RISK Warning */}
          {myAccounts.some(a => a.status === 'AT_RISK') && (
            <Box sx={{
              backgroundColor: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: 3,
              p: { xs: 2, md: 3 },
            }}>
              <Typography color="#e65100" fontWeight="bold" variant="body1" sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}>
                ⚠️ One or more accounts are AT RISK! Please deposit money within 24 hours to avoid auto-deactivation.
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Dashboard;