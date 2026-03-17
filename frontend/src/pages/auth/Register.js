import React, { useState } from 'react';
import { Box, Button, TextField, Typography, MenuItem, Alert, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const ShieldLogo = ({ size = 36 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L3 9V21C3 30.5 9.5 39 18 41C26.5 39 33 30.5 33 21V9L18 2Z" fill="#c62828" stroke="#f9a825" strokeWidth="1.5"/>
    <path d="M18 8L8 14V22C8 28 12.5 33.5 18 35.5C23.5 33.5 28 28 28 22V14L18 8Z" fill="#f9a825"/>
    <text x="18" y="27" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
  </svg>
);

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '', govIdType: 'AADHAAR', govIdNumber: '' });
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) formData.append('govIdDocument', file);
    dispatch(registerCustomer(formData));
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa', py: 4 }}>
      <Box sx={{ width: 500, background: 'white', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', overflow: 'hidden' }}>

        {/* Top accent bar */}
        <Box sx={{ height: '4px', background: 'linear-gradient(90deg, #0d47a1, #c62828, #f9a825)' }} />

        <Box sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1 }}>
            <ShieldLogo size={40} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0d47a1' }}>Create Account</Typography>
            <Typography sx={{ fontSize: 13, color: '#607d8b' }}>Join MyFin Bank today</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit}>
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Password', key: 'password', type: 'password' },
              { label: 'Phone', key: 'phone', type: 'text' },
              { label: 'Address', key: 'address', type: 'text' },
            ].map(({ label, key, type }) => (
              <TextField key={key} fullWidth label={label} type={type} value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }} required />
            ))}

            <TextField fullWidth select label="ID Type" value={form.govIdType}
              onChange={(e) => setForm({ ...form, govIdType: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }}>
              <MenuItem value="AADHAAR">Aadhaar</MenuItem>
              <MenuItem value="PAN">PAN</MenuItem>
            </TextField>

            <TextField fullWidth label="ID Number" value={form.govIdNumber}
              onChange={(e) => setForm({ ...form, govIdNumber: e.target.value })}
              sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }} required />

            <Button variant="outlined" component="label" fullWidth
              sx={{ mb: 2, borderRadius: 2, borderColor: '#1565c0', color: '#1565c0', textTransform: 'none', fontWeight: 600 }}>
              Upload ID Document
              <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
            </Button>

            {file && <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>✅ {file.name}</Typography>}

            <Button fullWidth variant="contained" type="submit" disabled={loading}
              sx={{
                backgroundColor: '#c62828', py: 1.4, borderRadius: 2,
                fontWeight: 700, fontSize: 14, letterSpacing: '0.03em',
                position: 'relative', overflow: 'hidden', textTransform: 'none',
                '&:hover': { backgroundColor: '#b71c1c' },
                '&::after': { content: '""', position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: '#f9a825' }
              }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button onClick={() => navigate('/login')} sx={{ color: '#1565c0', fontSize: 12, textTransform: 'none' }}>
              Already have an account? Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
