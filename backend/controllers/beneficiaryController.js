const beneficiaryService = require('../services/beneficiaryService');

const addBeneficiary = async (req, res) => {
  try {
    const { beneficiaryName, accountNumber, branch } = req.body;
    const ben = await beneficiaryService.addBeneficiary(req.user.id, beneficiaryName, accountNumber, branch);
    res.status(201).json({ message: 'Beneficiary added, pending admin approval', beneficiary: ben });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBeneficiaries = async (req, res) => {
  try {
    const bens = await beneficiaryService.getBeneficiariesByCustomer(req.user.id);
    res.json(bens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPendingBeneficiaries = async (req, res) => {
  try {
    const bens = await beneficiaryService.getAllPendingBeneficiaries();
    res.json(bens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveBeneficiary = async (req, res) => {
  try {
    const ben = await beneficiaryService.approveBeneficiary(req.params.beneficiaryId);
    res.json({ message: 'Beneficiary approved', beneficiary: ben });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addBeneficiary, getMyBeneficiaries, getAllPendingBeneficiaries, approveBeneficiary };