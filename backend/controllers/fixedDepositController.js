const fdService = require('../services/fixedDepositService');

const createFD = async (req, res) => {
  try {
    const { accountNumber, amount, interestRate, tenureMonths } = req.body;
    const fd = await fdService.createFD(accountNumber, amount, interestRate, tenureMonths);
    res.status(201).json({ message: 'FD created successfully', fd });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyFDs = async (req, res) => {
  try {
    const fds = await fdService.getFDsByAccount(req.params.accountNumber);
    res.json(fds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createFD, getMyFDs };