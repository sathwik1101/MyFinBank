const express = require('express');
const router = express.Router();
const controller = require('../controllers/fixedDepositController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('CUSTOMER'), controller.createFD);
router.get('/:accountNumber', authMiddleware('CUSTOMER'), controller.getMyFDs);

module.exports = router;