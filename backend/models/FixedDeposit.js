const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
  fdId: { type: String, unique: true },
  accountNumber: { type: String, required: true, ref: 'Account' },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenureMonths: { type: Number, required: true },
  maturityAmount: { type: Number },
  startDate: { type: Date, default: Date.now },
  maturityDate: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'MATURED', 'BROKEN'], default: 'ACTIVE' }
});

module.exports = mongoose.model('FixedDeposit', fixedDepositSchema);