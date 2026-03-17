import React, { useState } from 'react';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Drawer, IconButton, useMediaQuery, useTheme
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SavingsIcon from '@mui/icons-material/Savings';
import RepeatIcon from '@mui/icons-material/Repeat';
import PeopleIcon from '@mui/icons-material/People';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const drawerWidth = 240;

const ShieldLogo = ({ size = 30 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L3 9V21C3 30.5 9.5 39 18 41C26.5 39 33 30.5 33 21V9L18 2Z" fill="#c62828" stroke="#f9a825" strokeWidth="1.5"/>
    <path d="M18 8L8 14V22C8 28 12.5 33.5 18 35.5C23.5 33.5 28 28 28 22V14L18 8Z" fill="#f9a825"/>
    <text x="18" y="27" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
  </svg>
);

const customerMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Deposit', icon: <AccountBalanceWalletIcon />, path: '/deposit' },
  { text: 'Withdraw', icon: <ArrowDownwardIcon />, path: '/withdraw' },
  { text: 'Transfer', icon: <SwapHorizIcon />, path: '/transfer' },
  { text: 'Passbook', icon: <ReceiptIcon />, path: '/passbook' },
  { text: 'Loans', icon: <CreditCardIcon />, path: '/loans' },
  { text: 'Fixed Deposit', icon: <SavingsIcon />, path: '/fixed-deposit' },
  { text: 'Recurring Deposit', icon: <RepeatIcon />, path: '/recurring-deposit' },
  { text: 'Beneficiaries', icon: <PeopleIcon />, path: '/beneficiaries' },
  { text: 'Support', icon: <SupportAgentIcon />, path: '/support' },
  { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
];

const adminMenuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
  { text: 'Accounts', icon: <ManageAccountsIcon />, path: '/admin/accounts' },
  { text: 'Loans', icon: <CreditCardIcon />, path: '/admin/loans' },
  { text: 'Beneficiaries', icon: <PeopleIcon />, path: '/admin/beneficiaries' },
  { text: 'Support', icon: <SupportAgentIcon />, path: '/admin/support' },
];

const SidebarContent = ({ menuItems, user, role, navigate, location, onClose }) => (
  <Box sx={{
    width: drawerWidth,
    height: '100vh',
    background: '#0d47a1',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0, left: 0, right: 0,
      height: '3px',
      background: '#f9a825',
    }
  }}>
    {/* Logo */}
    <Box sx={{
      p: '18px 14px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 1.2,
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      minHeight: '64px',
    }}>
      <ShieldLogo size={30} />
      <Box>
        <Typography sx={{ color: 'white', fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>MyFin Bank</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
          {role === 'ADMIN' ? 'Admin Portal' : 'Customer Portal'}
        </Typography>
      </Box>
    </Box>

    {/* User Info */}
    <Box sx={{ mx: 1.2, my: 1.2, background: 'rgba(255,255,255,0.06)', borderRadius: 2, p: 1.2, display: 'flex', alignItems: 'center', gap: 1.2, borderLeft: '3px solid #f9a825' }}>
      <Box sx={{
        width: 34, height: 34, borderRadius: '50%',
        backgroundColor: role === 'ADMIN' ? '#f9a825' : '#c62828',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: 14, flexShrink: 0,
        color: role === 'ADMIN' ? '#0d47a1' : 'white',
      }}>
        {user?.name?.charAt(0).toUpperCase()}
      </Box>
      <Box sx={{ overflow: 'hidden' }}>
        <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 600, lineHeight: 1.2 }} noWrap>{user?.name}</Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }} noWrap>
          {user?.customerId || user?.adminId}
        </Typography>
      </Box>
    </Box>

    {/* Menu Items */}
    <List sx={{ px: 1, py: 0.5, flexGrow: 1, overflowY: 'auto' }}>
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
            <ListItemButton
              onClick={() => { navigate(item.path); if (onClose) onClose(); }}
              sx={{
                borderRadius: 2,
                backgroundColor: isActive ? '#c62828' : 'transparent',
                borderLeft: isActive ? '3px solid #f9a825' : '3px solid transparent',
                color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                '&:hover': { backgroundColor: isActive ? '#c62828' : 'rgba(255,255,255,0.08)', color: 'white' },
                transition: 'all 0.2s ease',
                py: 0.9,
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36, '& svg': { fontSize: 18 } }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontSize: 12, fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>

    {/* Footer */}
    <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <Typography sx={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', display: 'block', textAlign: 'center' }}>
        MyFin Bank © 2026
      </Typography>
    </Box>
  </Box>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useSelector((state) => state.auth);
  const menuItems = role === 'ADMIN' ? adminMenuItems : customerMenuItems;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {isMobile && (
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            position: 'fixed', top: 12, left: 12, zIndex: 1400,
            color: 'white', backgroundColor: '#0d47a1',
            '&:hover': { backgroundColor: '#1565c0' },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', border: 'none' } }}
        >
          <SidebarContent menuItems={menuItems} user={user} role={role} navigate={navigate} location={location} onClose={() => setMobileOpen(false)} />
        </Drawer>
      ) : (
        <Box sx={{ width: drawerWidth, flexShrink: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1200, boxShadow: '2px 0 12px rgba(0,0,0,0.15)' }}>
          <SidebarContent menuItems={menuItems} user={user} role={role} navigate={navigate} location={location} />
        </Box>
      )}
    </>
  );
};

export default Sidebar;