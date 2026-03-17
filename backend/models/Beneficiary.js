const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  beneficiaryId: { type: String, unique: true },
  customerId: { type: String, required: true, ref: 'Customer' },
  beneficiaryName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  branch: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'ACTIVE'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);