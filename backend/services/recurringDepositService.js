const RecurringDeposit = require('../models/RecurringDeposit');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateId = require('../utils/idGenerator');

const createRD = async (accountNumber, monthlyAmount, tenureMonths, interestRate) => {
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  if (account.balance < monthlyAmount) throw new Error('Insufficient balance for first installment');

  // Deduct first installment
  account.balance -= monthlyAmount;
  await account.save();

  const rdId = await generateId(RecurringDeposit, 'rdId', 'MYFIN-RD');
  const startDate = new Date();
  const maturityDate = new Date(startDate);
  maturityDate.setMonth(maturityDate.getMonth() + tenureMonths);

  const rd = new RecurringDeposit({
    rdId,
    accountNumber,
    monthlyAmount,
    tenureMonths,
    interestRate,
    startDate,
    maturityDate,
    paidInstallments: 1
  });

  await rd.save();

  // Create first installment transaction
  const txnCount = await Transaction.countDocuments();
  const txnId = `MYFIN-TXN-${String(txnCount + 1).padStart(6, '0')}`;

  const txn = new Transaction({
    txnId,
    accountNumber,
    transactionCategory: 'RD_INSTALLMENT',
    type: 'DEBIT',
    amount: monthlyAmount,
    balanceAfterTxn: account.balance,
    description: `RD Installment 1: ${rdId}`
  });
  await txn.save();

  return rd;
};

const getRDsByAccount = async (accountNumber) => {
  return await RecurringDeposit.find({ accountNumber });
};

// Pay next installment
const payRDInstallment = async (rdId) => {
  const rd = await RecurringDeposit.findOne({ rdId });
  if (!rd || rd.status !== 'ACTIVE') throw new Error('RD not active');
  if (rd.paidInstallments >= rd.tenureMonths) throw new Error('All installments paid');

  const account = await Account.findOne({ accountNumber: rd.accountNumber });
  if (account.balance < rd.monthlyAmount) throw new Error('Insufficient balance');

  account.balance -= rd.monthlyAmount;
  await account.save();

  rd.paidInstallments += 1;
  if (rd.paidInstallments === rd.tenureMonths) rd.status = 'MATURED';
  await rd.save();

  const txnCount = await Transaction.countDocuments();
  const txnId = `MYFIN-TXN-${String(txnCount + 1).padStart(6, '0')}`;

  const txn = new Transaction({
    txnId,
    accountNumber: rd.accountNumber,
    transactionCategory: 'RD_INSTALLMENT',
    type: 'DEBIT',
    amount: rd.monthlyAmount,
    balanceAfterTxn: account.balance,
    description: `RD Installment ${rd.paidInstallments}: ${rdId}`
  });
  await txn.save();

  return rd;
};

module.exports = { createRD, getRDsByAccount, payRDInstallment };   