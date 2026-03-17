const express = require('express');
const router = express.Router();
const controller = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/apply', authMiddleware('CUSTOMER'), controller.applyLoan);
router.post('/calculate-emi', controller.calculateEMI);
router.get('/my/:accountNumber', authMiddleware('CUSTOMER'), controller.getMyLoans);
router.get('/pending', authMiddleware('ADMIN'), controller.getAllPendingLoans);
router.put('/:loanId/status', authMiddleware('ADMIN'), controller.updateLoanStatus);
router.get('/:loanId/payments', authMiddleware('CUSTOMER'), controller.getLoanPayments);
router.post('/:loanId/pay-emi', authMiddleware('CUSTOMER'), controller.payEMI);

module.exports = router;