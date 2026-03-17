import React from 'react';
import { Box, Typography, Paper, Avatar, Grid, Chip } from '@mui/material';
import { useSelector } from 'react-redux';
import PersonIcon from '@mui/icons-material/Person';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">My Profile</Typography>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, backgroundColor: '#0d47a1', mr: 3 }}>
            <PersonIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{user?.name}</Typography>
            <Chip label="CUSTOMER" color="primary" size="small" />
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}><Typography color="text.secondary">Customer ID</Typography><Typography fontWeight="bold">{user?.customerId}</Typography></Grid>
          <Grid item xs={6}><Typography color="text.secondary">Email</Typography><Typography fontWeight="bold">{user?.email}</Typography></Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;