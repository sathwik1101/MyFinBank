const Account = require('../models/Account');
const generateId = require('../utils/idGenerator');

const createAccount = async (customerId, accountType) => {
  // Check: max 1 savings + 1 current per customer
  const existing = await Account.findOne({ customerId, accountType });
  if (existing) throw new Error(`Customer already has a ${accountType} account`);

  const prefix = accountType === 'SAVINGS' ? 'MYFIN-SACC' : 'MYFIN-CACC';
  const accountNumber = await generateId(Account, 'accountNumber', prefix);

  const account = new Account({ accountNumber, customerId, accountType });
  await account.save();
  return account;
};

const getAccountsByCustomer = async (customerId) => {
  return await Account.find({ customerId });
};

const getAccountByNumber = async (accountNumber) => {
  return await Account.findOne({ accountNumber });
};

const updateAccountStatus = async (accountNumber, status, deactivationType = null) => {
  const updateData = { status };
  if (deactivationType) updateData.deactivationType = deactivationType;
  if (status === 'AT_RISK') updateData.atRiskSince = new Date();
  if (status === 'ACTIVE') { updateData.atRiskSince = null; updateData.deactivationType = null; }

  return await Account.findOneAndUpdate({ accountNumber }, updateData, { new: true });
};

const getAllPendingAccounts = async () => {
  return await Account.find({ status: 'REQUESTED' });
};

const getAllAccounts = async () => {
  return await Account.find({});
};

module.exports = {
  createAccount,
  getAccountsByCustomer,
  getAccountByNumber,
  updateAccountStatus,
  getAllPendingAccounts,
  getAllAccounts
};