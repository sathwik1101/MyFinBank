const accountService = require('../services/accountService');

const createAccount = async (req, res) => {
  try {
    const { customerId, accountType } = req.body;
    const account = await accountService.createAccount(customerId, accountType);
    res.status(201).json({ message: 'Account request submitted', account });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyAccounts = async (req, res) => {
  try {
    const accounts = await accountService.getAccountsByCustomer(req.user.id);
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAccountStatus = async (req, res) => {
  try {
    const { status, deactivationType } = req.body;
    const account = await accountService.updateAccountStatus(req.params.accountNumber, status, deactivationType);
    res.json({ message: 'Account status updated', account });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPendingAccounts = async (req, res) => {
  try {
    const accounts = await accountService.getAllPendingAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const accounts = await accountService.getAllAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAccount, getMyAccounts, updateAccountStatus, getAllPendingAccounts, getAllAccounts };