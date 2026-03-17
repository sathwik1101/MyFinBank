import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, Alert, Card, CardContent, Chip, Grid, List, ListItem, ListItemText } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket, fetchMyTickets, fetchMessages, sendMessage, clearMessages } from '../../store/slices/supportSlice';
import SendIcon from '@mui/icons-material/Send';

const Support = () => {
  const dispatch = useDispatch();
  const { myTickets, messages, error, success } = useSelector((state) => state.support);
  const { user } = useSelector((state) => state.auth);
  const [subject, setSubject] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    dispatch(fetchMyTickets());
    return () => dispatch(clearMessages());
  }, [dispatch]);

  const handleCreateTicket = (e) => {
    e.preventDefault();
    dispatch(createTicket({ subject }));
    setSubject('');
  };

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    dispatch(fetchMessages(ticket.ticketId));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    dispatch(sendMessage({ ticketId: selectedTicket.ticketId, message: messageText }));
    setMessageText('');
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3} color="#0d47a1">Support</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Raise Ticket</Typography>
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
            <form onSubmit={handleCreateTicket}>
              <TextField fullWidth label="Subject" value={subject}
                onChange={(e) => setSubject(e.target.value)} sx={{ mb: 2 }} required />
              <Button fullWidth variant="contained" type="submit" sx={{ backgroundColor: '#0d47a1' }}>
                Create Ticket
              </Button>
            </form>
          </Paper>
          <Typography variant="h6" mb={1} fontWeight="bold">My Tickets</Typography>
          {myTickets.map(ticket => (
            <Card key={ticket.ticketId} elevation={2} sx={{ mb: 1, borderRadius: 2, cursor: 'pointer', border: selectedTicket?.ticketId === ticket.ticketId ? '2px solid #0d47a1' : 'none' }}
              onClick={() => handleSelectTicket(ticket)}>
              <CardContent sx={{ py: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">{ticket.ticketId}</Typography>
                  <Chip label={ticket.status} color={ticket.status === 'OPEN' ? 'error' : ticket.status === 'IN_PROGRESS' ? 'warning' : 'success'} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>{ticket.subject}</Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedTicket ? (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" fontWeight="bold" mb={1}>{selectedTicket.subject}</Typography>
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1 }}>
                {messages.map(msg => (
                  <Box key={msg._id} sx={{ display: 'flex', justifyContent: msg.senderType === 'CUSTOMER' ? 'flex-end' : 'flex-start', mb: 1 }}>
                    <Box sx={{ maxWidth: '70%', backgroundColor: msg.senderType === 'CUSTOMER' ? '#0d47a1' : '#e0e0e0', color: msg.senderType === 'CUSTOMER' ? 'white' : 'black', p: 1.5, borderRadius: 2 }}>
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>{new Date(msg.timestamp).toLocaleTimeString()}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField fullWidth size="small" placeholder="Type a message..." value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <Button variant="contained" onClick={handleSendMessage} sx={{ backgroundColor: '#0d47a1' }}>
                  <SendIcon />
                </Button>
              </Box>
            </Paper>
          ) : (
            <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography color="text.secondary">Select a ticket to view messages</Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Support;