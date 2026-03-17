const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountNumber: { type: String, unique: true },
  customerId: { type: String, required: true, ref: 'Customer' },
  accountType: { type: String, enum: ['SAVINGS', 'CURRENT'], required: true },
  balance: { type: Number, default: 0 },
  overdraftLimit: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['REQUESTED', 'ACTIVE', 'AT_RISK', 'DEACTIVATED', 'REJECTED'],
    default: 'REQUESTED'
  },
  deactivationType: { type: String, enum: ['AUTO', 'MANUAL', null], default: null },
  atRiskSince: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Account', accountSchema);