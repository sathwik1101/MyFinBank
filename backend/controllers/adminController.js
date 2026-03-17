const adminService = require('../services/adminService');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const admin = await adminService.registerAdmin(req.body);
    res.status(201).json({ message: 'Admin registered', adminId: admin.adminId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminService.loginAdmin(email, password);

    const token = jwt.sign(
      { id: admin.adminId, email: admin.email, role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ message: 'Admin login successful', token, admin: { adminId: admin.adminId, name: admin.name } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Admin logged out' });
};

module.exports = { register, login, logout };