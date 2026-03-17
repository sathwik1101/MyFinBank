import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, useMediaQuery, useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1300,
        backgroundColor: 'white',
        borderBottom: '2px solid #c62828',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
        left: isMobile ? 0 : 240,
        width: isMobile ? '100%' : 'calc(100% - 240px)',
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important', px: isMobile ? 7 : 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0d47a1', letterSpacing: '0.01em' }}>
            {role === 'ADMIN' ? '🛡️ Admin Dashboard' : '📊 MyFin Bank'}
          </Typography>
        </Box>
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile && (
              <Chip
                label={`👋 ${user.name}${role === 'ADMIN' ? ' · Admin' : ''}`}
                size="small"
                sx={{
                  backgroundColor: '#fff8e1',
                  color: '#0d47a1',
                  border: '1px solid #f9a825',
                  fontWeight: 600,
                  fontSize: 12,
                }}
              />
            )}
            <Button
              onClick={handleLogout}
              size="small"
              sx={{
                border: '1.5px solid #c62828',
                color: '#c62828',
                borderRadius: 2,
                fontSize: 11,
                fontWeight: 600,
                px: 1.5,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#ffebee' },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
