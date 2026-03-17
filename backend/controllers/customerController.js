const customerService = require('../services/customerService');
const accountService = require('../services/accountService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const filePath = req.file ? req.file.path : null;
    const customer = await customerService.registerCustomer(req.body, filePath);
    res.status(201).json({ message: 'Registration successful. Awaiting admin approval.', customerId: customer.customerId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await customerService.loginCustomer(email, password);

    const token = jwt.sign(
      { id: customer.customerId, email: customer.email, role: 'CUSTOMER' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Login successful', token, customer: { customerId: customer.customerId, name: customer.name, email: customer.email } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerById = async (req, res) => {
  try {
    const customer = await customerService.getCustomerById(req.params.customerId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await customerService.updateCustomerStatus(req.params.customerId, status);

    // Auto-create SAVINGS account when admin approves customer
    if (status === 'ACTIVE') {
      try {
        await accountService.createAccount(customer.customerId, 'SAVINGS');
      } catch (accErr) {
        // Account may already exist, ignore duplicate error
      }
    }

    res.json({ message: 'Status updated', customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const customer = await customerService.updateCustomer(req.params.customerId, req.body);
    res.json({ message: 'Customer updated', customer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login, logout, getAllCustomers, getCustomerById, updateCustomerStatus, updateCustomer };