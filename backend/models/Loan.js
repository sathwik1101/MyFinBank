const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanId: { type: String, unique: true },
  accountNumber: { type: String, required: true, ref: 'Account' },
  loanAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  emiAmount: { type: Number },
  remainingBalance: { type: Number },
  purpose: { type: String, default: 'Personal Loan' },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'CLOSED'],
    default: 'PENDING'
  },
  startDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Loan', loanSchema);