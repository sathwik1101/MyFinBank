const express = require('express');
const router = express.Router();
const controller = require('../controllers/beneficiaryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('CUSTOMER'), controller.addBeneficiary);
router.get('/my', authMiddleware('CUSTOMER'), controller.getMyBeneficiaries);
router.get('/pending', authMiddleware('ADMIN'), controller.getAllPendingBeneficiaries);
router.put('/:beneficiaryId/approve', authMiddleware('ADMIN'), controller.approveBeneficiary);

module.exports = router;