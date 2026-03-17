const SupportTicket = require('../models/SupportTicket');
const SupportMessage = require('../models/SupportMessage');
const generateId = require('../utils/idGenerator');

const createTicket = async (customerId, subject) => {
  const ticketId = await generateId(SupportTicket, 'ticketId', 'MYFIN-TKT');
  const ticket = new SupportTicket({ ticketId, customerId, subject });
  await ticket.save();
  return ticket;
};

const getTicketsByCustomer = async (customerId) => {
  return await SupportTicket.find({ customerId }).sort({ createdAt: -1 });
};

const getAllTickets = async () => {
  return await SupportTicket.find({}).sort({ createdAt: -1 });
};

const updateTicketStatus = async (ticketId, status) => {
  return await SupportTicket.findOneAndUpdate({ ticketId }, { status }, { new: true });
};

const sendMessage = async (ticketId, senderType, senderId, message) => {
  const msgCount = await SupportMessage.countDocuments();
  const messageId = `MYFIN-MSG-${String(msgCount + 1).padStart(4, '0')}`;

  const msg = new SupportMessage({ messageId, ticketId, senderType, senderId, message });
  await msg.save();
  return msg;
};

const getMessagesByTicket = async (ticketId) => {
  return await SupportMessage.find({ ticketId }).sort({ timestamp: 1 });
};

module.exports = {
  createTicket,
  getTicketsByCustomer,
  getAllTickets,
  updateTicketStatus,
  sendMessage,
  getMessagesByTicket
};