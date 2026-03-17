const express = require('express');
const router = express.Router();
const controller = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/tickets', authMiddleware('CUSTOMER'), controller.createTicket);
router.get('/tickets/my', authMiddleware('CUSTOMER'), controller.getMyTickets);
router.get('/tickets/all', authMiddleware('ADMIN'), controller.getAllTickets);
router.put('/tickets/:ticketId/status', authMiddleware('ADMIN'), controller.updateTicketStatus);
router.post('/messages', authMiddleware(), controller.sendMessage);
router.get('/messages/:ticketId', authMiddleware(), controller.getMessages);

module.exports = router;