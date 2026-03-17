import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, CircularProgress, Stepper, Step, StepLabel } from '@mui/material';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const ShieldLogo = ({ size = 36 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 36 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2L3 9V21C3 30.5 9.5 39 18 41C26.5 39 33 30.5 33 21V9L18 2Z" fill="#c62828" stroke="#f9a825" strokeWidth="1.5"/>
    <path d="M18 8L8 14V22C8 28 12.5 33.5 18 35.5C23.5 33.5 28 28 28 22V14L18 8Z" fill="#f9a825"/>
    <text x="18" y="27" textAnchor="middle" fill="#0d47a1" fontSize="13" fontWeight="900" fontFamily="Arial Black, sans-serif">M</text>
  </svg>
);

const steps = ['Enter Email', 'Enter OTP', 'Reset Password'];

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await axiosInstance.post('/password-reset/request', { email });
      setSuccess('OTP sent to your email!');
      setActiveStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (!otp) { setError('Please enter OTP'); return; }
    setError(null);
    setSuccess('OTP verified! Set your new password.');
    setActiveStep(2);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError(null);
    try {
      await axiosInstance.post('/password-reset/reset', { email, otp, newPassword });
      setSuccess('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  const inputSx = { mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } };
  const btnSx = {
    backgroundColor: '#c62828', py: 1.4, borderRadius: 2,
    fontWeight: 700, fontSize: 14, textTransform: 'none',
    position: 'relative', overflow: 'hidden',
    '&:hover': { backgroundColor: '#b71c1c' },
    '&::after': { content: '""', position: 'absolute', top: 0, right: 0, width: '4px', height: '100%', background: '#f9a825' }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fa' }}>
      <Box sx={{ width: 450, background: 'white', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
        <Box sx={{ height: '4px', background: 'linear-gradient(90deg, #0d47a1, #c62828, #f9a825)' }} />
        <Box sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3, gap: 1 }}>
            <ShieldLogo size={38} />
            <Typography sx={{ fontSize: 22, fontWeight: 700, color: '#0d47a1' }}>Forgot Password</Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{
            mb: 4,
            '& .MuiStepIcon-root.Mui-active': { color: '#0d47a1' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#c62828' },
          }}>
            {steps.map((label) => (
              <Step key={label}><StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: 12 } }}>{label}</StepLabel></Step>
            ))}
          </Stepper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {activeStep === 0 && (
            <form onSubmit={handleRequestOTP}>
              <TextField fullWidth label="Registered Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} sx={inputSx} required />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={btnSx}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
              </Button>
            </form>
          )}

          {activeStep === 1 && (
            <form onSubmit={handleVerifyOTP}>
              <Typography sx={{ fontSize: 13, color: '#607d8b', mb: 2 }}>
                Enter the 6-digit OTP sent to <strong>{email}</strong>
              </Typography>
              <TextField fullWidth label="Enter OTP" value={otp}
                onChange={(e) => setOtp(e.target.value)} sx={inputSx} required inputProps={{ maxLength: 6 }} />
              <Button fullWidth variant="contained" type="submit" sx={btnSx}>Verify OTP</Button>
              <Button fullWidth sx={{ mt: 1, color: '#607d8b', textTransform: 'none' }}
                onClick={() => { setActiveStep(0); setError(null); setSuccess(null); }}>Back</Button>
            </form>
          )}

          {activeStep === 2 && (
            <form onSubmit={handleResetPassword}>
              <TextField fullWidth label="New Password" type="password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} sx={inputSx} required />
              <TextField fullWidth label="Confirm New Password" type="password" value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} sx={{ ...inputSx, mb: 3 }} required />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={btnSx}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
              </Button>
            </form>
          )}

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button onClick={() => navigate('/login')} sx={{ color: '#1565c0', fontSize: 12, textTransform: 'none' }}>
              Back to Login
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
