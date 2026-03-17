const supportService = require('../services/supportService');

const createTicket = async (req, res) => {
  try {
    const ticket = await supportService.createTicket(req.user.id, req.body.subject);
    res.status(201).json({ message: 'Ticket created', ticket });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyTickets = async (req, res) => {
  try {
    const tickets = await supportService.getTicketsByCustomer(req.user.id);
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTickets = async (req, res) => {
  try {
    const tickets = await supportService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await supportService.updateTicketStatus(req.params.ticketId, req.body.status);
    res.json({ message: 'Ticket status updated', ticket });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { ticketId, message } = req.body;
    const senderType = req.user.role === 'ADMIN' ? 'ADMIN' : 'CUSTOMER';
    const msg = await supportService.sendMessage(ticketId, senderType, req.user.id, message);
    res.json({ message: 'Message sent', msg });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await supportService.getMessagesByTicket(req.params.ticketId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, getMyTickets, getAllTickets, updateTicketStatus, sendMessage, getMessages };