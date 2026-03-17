const rdService = require('../services/recurringDepositService');

const createRD = async (req, res) => {
  try {
    const { accountNumber, monthlyAmount, tenureMonths, interestRate } = req.body;
    const rd = await rdService.createRD(accountNumber, monthlyAmount, tenureMonths, interestRate);
    res.status(201).json({ message: 'RD created successfully', rd });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRDs = async (req, res) => {
  try {
    const rds = await rdService.getRDsByAccount(req.params.accountNumber);
    res.json(rds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const payInstallment = async (req, res) => {
  try {
    const rd = await rdService.payRDInstallment(req.params.rdId);
    res.json({ message: 'Installment paid', rd });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createRD, getMyRDs, payInstallment };