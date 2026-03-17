const express = require('express');
const router = express.Router();
const controller = require('../controllers/accountController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('CUSTOMER'), controller.createAccount);
router.get('/my', authMiddleware('CUSTOMER'), controller.getMyAccounts);
router.get('/pending', authMiddleware('ADMIN'), controller.getAllPendingAccounts);
router.get('/all', authMiddleware('ADMIN'), controller.getAllAccounts);
router.put('/:accountNumber/status', authMiddleware('ADMIN'), controller.updateAccountStatus);

module.exports = router;