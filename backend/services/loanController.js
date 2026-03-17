const loanService = require('../services/loanService');

const applyLoan = async (req, res) => {
  try {
    const { accountNumber, loanAmount, interestRate, tenureMonths } = req.body;
    const loan = await loanService.applyLoan(accountNumber, loanAmount, interestRate, tenureMonths);
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
    const loan = await loanService.updateLoanStatus(req.params.loanId, req.body.status);
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

module.exports = { applyLoan, calculateEMI, getMyLoans, getAllPendingLoans, updateLoanStatus, getLoanPayments };