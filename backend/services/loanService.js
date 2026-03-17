const Loan = require('../models/Loan');
const LoanPayment = require('../models/LoanPayment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const generateId = require('../utils/idGenerator');

const suggestInterestRate = (loanAmount, tenureMonths) => {
  if (loanAmount <= 50000) return tenureMonths <= 12 ? 10 : 11;
  else if (loanAmount <= 200000) return tenureMonths <= 12 ? 9 : 9.5;
  else return tenureMonths <= 12 ? 8 : 8.5;
};

const calculateEMI = (principal, annualRate, tenureMonths) => {
  const r = annualRate / 12 / 100;
  const n = tenureMonths;
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi * 100) / 100;
};

const applyLoan = async (accountNumber, loanAmount, tenureMonths, purpose) => {
  const loanId = await generateId(Loan, 'loanId', 'MYFIN-LN');
  const suggestedRate = suggestInterestRate(loanAmount, tenureMonths);
  const emiAmount = calculateEMI(loanAmount, suggestedRate, tenureMonths);
  const loan = new Loan({
    loanId, accountNumber, loanAmount,
    interestRate: suggestedRate, tenureMonths, emiAmount,
    remainingBalance: loanAmount,
    purpose: purpose || 'Personal Loan',
  });
  await loan.save();
  return loan;
};

const getLoansByAccount = async (accountNumber) => {
  return await Loan.find({ accountNumber });
};

const getAllPendingLoans = async () => {
  return await Loan.find({ status: 'PENDING' });
};

const updateLoanStatus = async (loanId, status, adminInterestRate = null) => {
  const updateData = { status };
  if (status === 'ACTIVE') {
    updateData.startDate = new Date();
    if (adminInterestRate) {
      updateData.interestRate = adminInterestRate;
      const existingLoan = await Loan.findOne({ loanId });
      updateData.emiAmount = calculateEMI(existingLoan.loanAmount, adminInterestRate, existingLoan.tenureMonths);
    }
  }
  const loan = await Loan.findOneAndUpdate({ loanId }, updateData, { new: true });
  if (status === 'ACTIVE') {
    await LoanPayment.deleteMany({ loanId });
    for (let i = 1; i <= loan.tenureMonths; i++) {
      const paymentId = await generateId(LoanPayment, 'paymentId', 'MYFIN-PAY');
      const payment = new LoanPayment({ paymentId, loanId, emiNumber: i, amount: loan.emiAmount, status: 'PENDING' });
      await payment.save();
    }
  }
  return loan;
};

const getLoanPayments = async (loanId) => {
  return await LoanPayment.find({ loanId }).sort({ emiNumber: 1 });
};

// PAY EMI — deducts from account, marks payment as PAID, updates loan remaining balance
const payEMI = async (loanId, accountNumber) => {
  const loan = await Loan.findOne({ loanId });
  if (!loan) throw new Error('Loan not found');
  if (loan.status !== 'ACTIVE') throw new Error('Loan is not active');

  // Find the next pending EMI
  const nextPayment = await LoanPayment.findOne({ loanId, status: 'PENDING' }).sort({ emiNumber: 1 });
  if (!nextPayment) throw new Error('No pending EMI payments found');

  // Check account balance
  const account = await Account.findOne({ accountNumber });
  if (!account || account.status !== 'ACTIVE') throw new Error('Account not active');
  if (account.balance < nextPayment.amount) throw new Error('Insufficient balance to pay EMI');

  // Deduct EMI from account
  const newBalance = account.balance - nextPayment.amount;
  account.balance = newBalance;
  await account.save();

  // Create transaction record
  const txnId = `MYFIN-TXN-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
  const txn = new Transaction({
    txnId,
    accountNumber,
    transactionCategory: 'LOAN_EMI',
    type: 'DEBIT',
    amount: nextPayment.amount,
    balanceAfterTxn: newBalance,
    description: `EMI Payment - ${loanId} (EMI #${nextPayment.emiNumber})`,
  });
  await txn.save();

  // Mark this EMI as PAID
  nextPayment.status = 'PAID';
  nextPayment.paymentDate = new Date();
  nextPayment.referenceId = txnId;
  await nextPayment.save();

  // Update loan remaining balance
  const newRemainingBalance = Math.max(0, loan.remainingBalance - nextPayment.amount);
  loan.remainingBalance = newRemainingBalance;

  // Check if all EMIs paid — close the loan
  const pendingCount = await LoanPayment.countDocuments({ loanId, status: 'PENDING' });
  if (pendingCount === 0) {
    loan.status = 'CLOSED';
  }
  await loan.save();

  return { payment: nextPayment, transaction: txn, loan };
};

module.exports = {
  suggestInterestRate, calculateEMI, applyLoan,
  getLoansByAccount, getAllPendingLoans, updateLoanStatus,
  getLoanPayments, payEMI
};