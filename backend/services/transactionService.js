const Transaction = require('../models/Transaction');
const Account = require('../models/Account');
const { sendZeroBalanceAlert } = require('./emailService');

const generateTxnId = () => {
  return `MYFIN-TXN-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
};

// DEPOSIT
const deposit = async (accountNumber, amount, description = 'Deposit') => {
  const account = await Account.findOne({ accountNumber });
  if (!account || (account.status !== 'ACTIVE' && account.status !== 'AT_RISK')) throw new Error('Account not active');

  const newBalance = account.balance + amount;
  account.balance = newBalance;

  // If account was AT_RISK and now has balance, restore to ACTIVE
  if (account.status === 'AT_RISK' && newBalance > 0) {
    account.status = 'ACTIVE';
    account.atRiskSince = null;
  }

  await account.save();

  const txnId = generateTxnId();
  const txn = new Transaction({
    txnId,
    accountNumber,
    transactionCategory: 'DEPOSIT',
    type: 'CREDIT',
    amount,
    balanceAfterTxn: newBalance,
    description
  });
  await txn.save();
  return txn;
};

// WITHDRAW
const withdraw = async (accountNumber, amount, description = 'Withdrawal') => {
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  if (account.balance < amount) throw new Error('Insufficient balance');

  const newBalance = account.balance - amount;
  account.balance = newBalance;

  if (newBalance === 0) {
    account.status = 'AT_RISK';
    account.atRiskSince = new Date();
    const Customer = require('../models/Customer');
    const customer = await Customer.findOne({ customerId: account.customerId });
    await sendZeroBalanceAlert(customer.name, accountNumber, customer.email);
  }

  await account.save();

  const txnId = generateTxnId();
  const txn = new Transaction({
    txnId,
    accountNumber,
    transactionCategory: 'WITHDRAW',
    type: 'DEBIT',
    amount,
    balanceAfterTxn: newBalance,
    description
  });
  await txn.save();
  return txn;
};

// FUND TRANSFER — creates 2 transaction records
const transfer = async (fromAccountNumber, toAccountNumber, amount, description = 'Fund Transfer') => {
  const fromAccount = await Account.findOne({ accountNumber: fromAccountNumber });
  const toAccount = await Account.findOne({ accountNumber: toAccountNumber });

  if (!fromAccount || fromAccount.status !== 'ACTIVE') throw new Error('Sender account not active');
  if (!toAccount || toAccount.status !== 'ACTIVE') throw new Error('Receiver account not active');
  if (fromAccount.balance < amount) throw new Error('Insufficient balance');

  const fromNewBalance = fromAccount.balance - amount;
  const toNewBalance = toAccount.balance + amount;

  fromAccount.balance = fromNewBalance;
  toAccount.balance = toNewBalance;

  if (fromNewBalance === 0) {
    fromAccount.status = 'AT_RISK';
    fromAccount.atRiskSince = new Date();
    const Customer = require('../models/Customer');
    const customer = await Customer.findOne({ customerId: fromAccount.customerId });
    await sendZeroBalanceAlert(customer.name, fromAccountNumber, customer.email);
  }

  await fromAccount.save();
  await toAccount.save();

  const { v4: uuidv4 } = require('uuid');
  const referenceId = `REF-${uuidv4().split('-')[0].toUpperCase()}`;

  const txnId1 = generateTxnId();
  await new Promise(r => setTimeout(r, 2));
  const txnId2 = generateTxnId();

  const debitTxn = new Transaction({
    txnId: txnId1,
    accountNumber: fromAccountNumber,
    referenceId,
    transactionCategory: 'TRANSFER',
    type: 'DEBIT',
    amount,
    balanceAfterTxn: fromNewBalance,
    description: `Transfer to ${toAccountNumber}`
  });

  const creditTxn = new Transaction({
    txnId: txnId2,
    accountNumber: toAccountNumber,
    referenceId,
    transactionCategory: 'TRANSFER',
    type: 'CREDIT',
    amount,
    balanceAfterTxn: toNewBalance,
    description: `Transfer from ${fromAccountNumber}`
  });

  await debitTxn.save();
  await creditTxn.save();

  return { debitTxn, creditTxn, referenceId };
};

const getTransactionsByAccount = async (accountNumber) => {
  return await Transaction.find({ accountNumber }).sort({ date: -1 });
};

module.exports = { deposit, withdraw, transfer, getTransactionsByAccount };