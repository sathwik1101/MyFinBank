const express = require('express');
const router = express.Router();
const controller = require('../controllers/recurringDepositController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('CUSTOMER'), controller.createRD);
router.get('/:accountNumber', authMiddleware('CUSTOMER'), controller.getMyRDs);
router.put('/:rdId/pay', authMiddleware('CUSTOMER'), controller.payInstallment);

module.exports = router;