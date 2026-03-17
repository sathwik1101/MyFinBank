const PasswordResetToken = require('../models/PasswordResetToken');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const generateId = require('../utils/idGenerator');
const { sendOTPEmail } = require('./emailService');

const requestPasswordReset = async (email) => {
  const customer = await Customer.findOne({ email });
  if (!customer) throw new Error('Email not found');

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const tokenId = await generateId(PasswordResetToken, 'tokenId', 'MYFIN-OTP');

  await PasswordResetToken.create({
    tokenId,
    customerId: customer.customerId,
    otp,
    expiresAt
  });

  await sendOTPEmail(email, otp);
  return { message: 'OTP sent to email' };
};

const resetPassword = async (email, otp, newPassword) => {
  const customer = await Customer.findOne({ email });
  if (!customer) throw new Error('Customer not found');

  const tokenRecord = await PasswordResetToken.findOne({
    customerId: customer.customerId,
    otp,
    used: false
  });

  if (!tokenRecord) throw new Error('Invalid OTP');
  if (new Date() > tokenRecord.expiresAt) throw new Error('OTP expired');

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  customer.password = hashedPassword;
  await customer.save();

  tokenRecord.used = true;
  await tokenRecord.save();

  return { message: 'Password reset successful' };
};

module.exports = { requestPasswordReset, resetPassword };