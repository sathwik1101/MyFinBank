const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const generateId = require('../utils/idGenerator');

const registerAdmin = async (data) => {
  const existing = await Admin.findOne({ email: data.email });
  if (existing) throw new Error('Admin email already exists');

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const adminId = await generateId(Admin, 'adminId', 'MYFIN-ADMIN');

  const admin = new Admin({
    adminId,
    name: data.name,
    email: data.email,
    password: hashedPassword
  });

  await admin.save();
  return admin;
};

const loginAdmin = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Admin not found');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid password');

  return admin;
};

module.exports = { registerAdmin, loginAdmin };