const express = require('express');
const router = express.Router();
const controller = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/deposit', authMiddleware('CUSTOMER'), controller.deposit);
router.post('/withdraw', authMiddleware('CUSTOMER'), controller.withdraw);
router.post('/transfer', authMiddleware('CUSTOMER'), controller.transfer);
router.get('/passbook/:accountNumber', authMiddleware('CUSTOMER'), controller.getPassbook);

module.exports = router;