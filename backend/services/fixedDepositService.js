const FixedDeposit = require('../models/FixedDeposit');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateId = require('../utils/idGenerator');

const createFD = async (accountNumber, amount, interestRate, tenureMonths) => {
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  if (account.balance < amount) throw new Error('Insufficient balance');

  // Deduct from account
  account.balance -= amount;
  await account.save();

  const fdId = await generateId(FixedDeposit, 'fdId', 'MYFIN-FD');
  const startDate = new Date();
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

  // Simple interest: maturityAmount = P + (P * r * t / 100)
  const maturityAmount = amount + (amount * interestRate * (tenureMonths / 12)) / 100;

  const fd = new FixedDeposit({
    fdId,
    accountNumber,
    amount,
    interestRate,
    tenureMonths,
    maturityAmount: Math.round(maturityAmount * 100) / 100,
    startDate,
    maturityDate
  });

  await fd.save();

  // Create transaction record
  const txnCount = await Transaction.countDocuments();
  const txnId = `MYFIN-TXN-${String(txnCount + 1).padStart(6, '0')}`;

  const txn = new Transaction({
    txnId,
    accountNumber,
    transactionCategory: 'FD_INVESTMENT',
    type: 'DEBIT',
    amount,
    balanceAfterTxn: account.balance,
    description: `FD Created: ${fdId}`
  });
  await txn.save();

  return fd;
};

const getFDsByAccount = async (accountNumber) => {
  return await FixedDeposit.find({ accountNumber });
};

module.exports = { createFD, getFDsByAccount };