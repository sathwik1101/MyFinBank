const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  govIdType: { type: String, enum: ['AADHAAR', 'PAN'], required: true },
  govIdNumber: { type: String, required: true },
  govIdDocumentPath: { type: String },
  status: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'ACTIVE', 'REJECTED'],
    default: 'PENDING_VERIFICATION'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);