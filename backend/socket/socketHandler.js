const supportService = require('../services/supportService');

const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a ticket room
    socket.on('joinTicket', (ticketId) => {
      socket.join(ticketId);
      console.log(`📩 Joined ticket room: ${ticketId}`);
    });

    // Send a message
    socket.on('sendMessage', async (data) => {
      // data: { ticketId, senderType, senderId, message }
      const msg = await supportService.sendMessage(
        data.ticketId,
        data.senderType,
        data.senderId,
        data.message
      );
      // Emit to everyone in the ticket room
      io.to(data.ticketId).emit('newMessage', msg);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });
};

module.exports = initSocket;