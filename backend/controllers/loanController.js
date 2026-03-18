const loanService = require('../services/loanService');
const { sendLoanApprovalEmail } = require('../services/emailService');
const Customer = require('../models/Customer');
const Account = require('../models/Account');

const applyLoan = async (req, res) => {
  try {
    const { accountNumber, loanAmount, tenureMonths, purpose } = req.body;
    const loan = await loanService.applyLoan(accountNumber, Number(loanAmount), Number(tenureMonths), purpose);
    res.status(201).json({ message: 'Loan application submitted', loan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const calculateEMI = (req, res) => {
  try {
    const { loanAmount, interestRate, tenureMonths } = req.body;
    const emi = loanService.calculateEMI(loanAmount, interestRate, tenureMonths);
    res.json({ emi });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyLoans = async (req, res) => {
  try {
    const loans = await loanService.getLoansByAccount(req.params.accountNumber);
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPendingLoans = async (req, res) => {
  try {
    const loans = await loanService.getAllPendingLoans();
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLoanStatus = async (req, res) => {
  try {
    const loan = await loanService.updateLoanStatus(req.params.loanId, req.body.status, req.body.interestRate);
    if (req.body.status === 'ACTIVE') {
      try {
        const account = await Account.findOne({ accountNumber: loan.accountNumber });
        if (account) {
          const customer = await Customer.findOne({ customerId: account.customerId });
          if (customer) {
            await sendLoanApprovalEmail(
              customer.name,
              customer.email,
              loan.loanId,
              loan.loanAmount,
              loan.emiAmount,
              loan.tenureMonths,
              loan.interestRate
            );
          }
        }
      } catch (emailErr) {
        console.error('Loan approval email error:', emailErr.message);
      }
    }
    res.json({ message: `Loan ${req.body.status}`, loan });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getLoanPayments = async (req, res) => {
  try {
    const payments = await loanService.getLoanPayments(req.params.loanId);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payEMI = async (req, res) => {
  try {
    const { accountNumber } = req.body;
    const result = await loanService.payEMI(req.params.loanId, accountNumber);
    res.json({ message: 'EMI paid successfully', ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { applyLoan, calculateEMI, getMyLoans, getAllPendingLoans, updateLoanStatus, getLoanPayments, payEMI };