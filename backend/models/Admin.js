const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  adminId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'ADMIN' }
});

module.exports = mongoose.model('Admin', adminSchema);