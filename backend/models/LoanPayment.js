const mongoose = require('mongoose');

const loanPaymentSchema = new mongoose.Schema({
  paymentId: { type: String, unique: true },
  loanId: { type: String, required: true, ref: 'Loan' },
  emiNumber: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: null },
  referenceId: { type: String, default: null },
  status: { type: String, enum: ['PENDING', 'PAID'], default: 'PENDING' }
});

module.exports = mongoose.model('LoanPayment', loanPaymentSchema);