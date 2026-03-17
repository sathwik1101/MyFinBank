const Beneficiary = require('../models/Beneficiary');
const generateId = require('../utils/idGenerator');

const addBeneficiary = async (customerId, beneficiaryName, accountNumber, branch) => {
  const beneficiaryId = await generateId(Beneficiary, 'beneficiaryId', 'MYFIN-BEN');
  const ben = new Beneficiary({ beneficiaryId, customerId, beneficiaryName, accountNumber, branch });
  await ben.save();
  return ben;
};

const getBeneficiariesByCustomer = async (customerId) => {
  return await Beneficiary.find({ customerId, status: 'ACTIVE' });
};

const getAllPendingBeneficiaries = async () => {
  return await Beneficiary.find({ status: 'PENDING' });
};

const approveBeneficiary = async (beneficiaryId) => {
  return await Beneficiary.findOneAndUpdate(
    { beneficiaryId },
    { status: 'ACTIVE' },
    { new: true }
  );
};

module.exports = {
  addBeneficiary,
  getBeneficiariesByCustomer,
  getAllPendingBeneficiaries,
  approveBeneficiary
};