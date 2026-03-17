const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Public routes
router.post('/register', upload.single('govIdDocument'), controller.register);
router.post('/login', controller.login);
router.post('/logout', controller.logout);

// Customer protected routes
router.get('/profile', authMiddleware('CUSTOMER'), controller.getCustomerById);

// Admin only routes
router.get('/', authMiddleware('ADMIN'), controller.getAllCustomers);
router.get('/:customerId', authMiddleware('ADMIN'), controller.getCustomerById);
router.put('/:customerId/status', authMiddleware('ADMIN'), controller.updateCustomerStatus);
router.put('/:customerId', authMiddleware('ADMIN'), controller.updateCustomer);

module.exports = router;