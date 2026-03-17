import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Card, CardContent, Chip, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTickets, fetchMessages, sendMessage, updateTicketStatus } from '../../store/slices/supportSlice';
import SendIcon from '@mui/icons-material/Send';

const AdminSupport = () => {
  const dispatch = useDispatch();
  const { allTickets, messages } = useSelector((state) => state.support);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => { dispatch(fetchAllTickets()); }, [dispatch]);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    dispatch(fetchMessages(ticket.ticketId));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    dispatch(sendMessage({ ticketId: selectedTicket.ticketId, message: messageText }));
    setMessageText('');
  };

  const handleResolve = () => {
    dispatch(updateTicketStatus({ ticketId: selectedTicket.ticketId, status: 'RESOLVED' })).then(() => dispatch(fetchAllTickets()));
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Support Tickets</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          {allTickets.map(ticket => (
            <Card key={ticket.ticketId} elevation={2} sx={{ mb: 1, borderRadius: 2, cursor: 'pointer', border: selectedTicket?.ticketId === ticket.ticketId ? '2px solid #0d47a1' : 'none' }}
              onClick={() => handleSelectTicket(ticket)}>
              <CardContent sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">{ticket.ticketId}</Typography>
                  <Chip label={ticket.status} color={ticket.status === 'OPEN' ? 'error' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>{ticket.subject}</Typography>
                <Typography variant="caption" color="text.secondary">{ticket.customerId}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedTicket ? (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">{selectedTicket.subject}</Typography>
                {selectedTicket.status !== 'RESOLVED' && (
                  <Button size="small" variant="contained" color="success" onClick={handleResolve}>Mark Resolved</Button>
                )}
              </Box>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {messages.map(msg => (
                  <Box key={msg._id} sx={{ display: 'flex', justifyContent: msg.senderType === 'ADMIN' ? 'flex-end' : 'flex-start', mb: 1 }}>
                    <Box sx={{ maxWidth: '70%', backgroundColor: msg.senderType === 'ADMIN' ? '#0d47a1' : '#e0e0e0', color: msg.senderType === 'ADMIN' ? 'white' : 'black', p: 1.5, borderRadius: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>{msg.senderType}</Typography>
                      <Typography variant="body2">{msg.message}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" placeholder="Type a reply..." value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <Button variant="contained" onClick={handleSendMessage} sx={{ backgroundColor: '#0d47a1' }}>
                  <SendIcon />
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography color="text.secondary">Select a ticket to view and reply</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminSupport;