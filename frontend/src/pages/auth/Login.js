import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Tab, Tabs, Alert, CircularProgress, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { loginCustomer, loginAdmin, clearMessages } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const ShieldLogo = ({ size = 40 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L3 9V21C3 30.5 9.5 39 18 41C26.5 39 33 30.5 33 21V9L18 2Z" fill="#c62828" stroke="#f9a825" strokeWidth="1.5"/>
    <path d="M18 8L8 14V22C8 28 12.5 33.5 18 35.5C23.5 33.5 28 28 28 22V14L18 8Z" fill="#f9a825"/>
    <text x="18" y="27" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
  </svg>
);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, role } = useSelector((state) => state.auth);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (token && role === 'CUSTOMER') navigate('/dashboard');
    if (token && role === 'ADMIN') navigate('/admin/dashboard');
  }, [token, role, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 0) dispatch(loginCustomer(form));
    else dispatch(loginAdmin(form));
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      p: 2,
    }}>
      <Box sx={{
        display: 'flex',
        width: '100%',
        maxWidth: 860,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
        minHeight: 500,
      }}>

        {/* Left Panel */}
        <Box sx={{
          width: '42%',
          background: '#0d47a1',
          p: '36px 28px',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '4px',
            background: '#f9a825',
          },
          '&::after': {
            content: '"S"',
            position: 'absolute',
            right: '-18px',
            bottom: '-28px',
            fontSize: '180px',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
            pointerEvents: 'none',
            fontFamily: 'Arial Black, sans-serif',
          }
        }}>
          {/* Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShieldLogo size={38} />
            <Typography sx={{ color: 'white', fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>
              MyFin Bank
            </Typography>
          </Box>

          {/* Tagline */}
          <Box>
            <Typography sx={{ color: '#f9a825', fontSize: 28, fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
              Knull Banking.
            </Typography>
          </Box>

          {/* Trust items */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {['Real-time balance updates', '24/7 customer support'].map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', background: '#f9a825', flexShrink: 0 }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 13 }}>{item}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Panel */}
        <Box sx={{
          flex: 1,
          background: 'white',
          p: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          {/* Mobile brand */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
            <ShieldLogo size={32} />
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#0d47a1' }}>MyFin Bank</Typography>
          </Box>

          <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', mb: 0.5 }}>Welcome back</Typography>
          <Typography sx={{ fontSize: 13, color: '#607d8b', mb: 3 }}>Sign in to access your MyFin account</Typography>

          <Tabs
            value={tab}
            onChange={(e, v) => { setTab(v); dispatch(clearMessages()); }}
            sx={{
              mb: 3,
              border: '1px solid #dde3ea',
              borderRadius: 2,
              minHeight: 38,
              '& .MuiTabs-indicator': { background: '#c62828', height: 2 },
              '& .MuiTab-root': { fontSize: 12, fontWeight: 600, minHeight: 38, textTransform: 'none', color: '#607d8b' },
              '& .MuiTab-root.Mui-selected': { color: '#0d47a1' },
            }}
          >
            <Tab label="Customer Login" />
            <Tab label="Admin Login" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#607d8b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Email Address</Typography>
            <TextField
              fullWidth type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f5f7fa', fontSize: 13 } }}
              required
            />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#607d8b', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Password</Typography>
            <TextField
              fullWidth type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2, backgroundColor: '#f5f7fa', fontSize: 13 } }}
              required
            />
            <Button
              fullWidth variant="contained" type="submit" disabled={loading}
              sx={{
                backgroundColor: '#c62828',
                py: 1.4,
                borderRadius: 2,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '0.03em',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': { backgroundColor: '#b71c1c' },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0, right: 0,
                  width: '4px', height: '100%',
                  background: '#f9a825',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'SIGN IN'}
            </Button>
          </form>

          {tab === 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={() => navigate('/register')} sx={{ color: '#1565c0', fontSize: 12, textTransform: 'none' }}>
                Don't have an account? Register
              </Button>
              <Button onClick={() => navigate('/forgot-password')} sx={{ color: '#607d8b', fontSize: 12, textTransform: 'none' }}>
                Forgot Password?
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
