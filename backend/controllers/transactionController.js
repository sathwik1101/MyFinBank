const transactionService = require('../services/transactionService');

const deposit = async (req, res) => {
  try {
    const { accountNumber, amount, description } = req.body;
    const txn = await transactionService.deposit(accountNumber, amount, description);
    res.json({ message: 'Deposit successful', transaction: txn });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const withdraw = async (req, res) => {
  try {
    const { accountNumber, amount, description } = req.body;
    const txn = await transactionService.withdraw(accountNumber, amount, description);
    res.json({ message: 'Withdrawal successful', transaction: txn });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const transfer = async (req, res) => {
  try {
    const { fromAccountNumber, toAccountNumber, amount, description } = req.body;
    const result = await transactionService.transfer(fromAccountNumber, toAccountNumber, amount, description);
    res.json({ message: 'Transfer successful', ...result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPassbook = async (req, res) => {
  try {
    const txns = await transactionService.getTransactionsByAccount(req.params.accountNumber);
    res.json(txns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { deposit, withdraw, transfer, getPassbook };