const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const generateId = require('../utils/idGenerator');

// Register new customer
const registerCustomer = async (data, filePath) => {
  const existing = await Customer.findOne({ email: data.email });
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const customerId = await generateId(Customer, 'customerId', 'MYFIN-CUST');

  const customer = new Customer({
    customerId,
    name: data.name,
    email: data.email,
    password: hashedPassword,
    phone: data.phone,
    address: data.address,
    govIdType: data.govIdType,
    govIdNumber: data.govIdNumber,
    govIdDocumentPath: filePath
  });

  await customer.save();
  return customer;
};

// Login customer
const loginCustomer = async (email, password) => {
  const customer = await Customer.findOne({ email });
  if (!customer) throw new Error('Customer not found');
  if (customer.status !== 'ACTIVE') throw new Error('Account not active. Awaiting admin approval.');

  const isMatch = await bcrypt.compare(password, customer.password);
  if (!isMatch) throw new Error('Invalid password');

  return customer;
};

// Get all customers (admin use)
const getAllCustomers = async () => {
  return await Customer.find({}, { password: 0 }); // exclude password
};

// Get single customer
const getCustomerById = async (customerId) => {
  return await Customer.findOne({ customerId }, { password: 0 });
};

// Update customer status (admin: activate/deactivate/approve/reject)
const updateCustomerStatus = async (customerId, status) => {
  return await Customer.findOneAndUpdate(
    { customerId },
    { status },
    { new: true }
  );
};

// Update customer details
const updateCustomer = async (customerId, data) => {
  return await Customer.findOneAndUpdate(
    { customerId },
    { name: data.name, phone: data.phone, address: data.address },
    { new: true }
  );
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  updateCustomer
};