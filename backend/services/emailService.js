const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendZeroBalanceAlert = async (customerName, accountNumber, customerEmail) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '⚠️ Alert: Customer Balance Hit Zero',
      html: `
        <h2>Balance Alert</h2>
        <p>Customer <strong>${customerName}</strong> 
        (Account: <strong>${accountNumber}</strong>) 
        balance has reached <strong>₹0</strong>.</p>
        <p>Please review immediately.</p>
      `
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '⚠️ MyFin Bank — Your Account Balance is Zero',
      html: `
        <h2>Balance Alert</h2>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>Your account <strong>${accountNumber}</strong> balance has reached <strong>₹0</strong>.</p>
        <p>Please deposit money within <strong>24 hours</strong> to avoid auto-deactivation.</p>
        <p>— MyFin Bank Team</p>
      `
    });
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
  }
};

const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 MyFin Bank — Password Reset OTP',
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP is: <strong style="font-size:24px">${otp}</strong></p>
        <p>This OTP is valid for <strong>10 minutes</strong> only.</p>
        <p>If you did not request this, ignore this email.</p>
      `
    });
  } catch (err) {
    console.error('❌ OTP Email failed:', err.message);
  }
};

const sendCustomerApprovalEmail = async (customerName, customerEmail, customerId) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '🎉 MyFin Bank — Your Account Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0d47a1; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">MyFin Bank</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #0d47a1;">Welcome, ${customerName}! 🎉</h2>
            <p>We are pleased to inform you that your MyFin Bank account has been <strong style="color: green;">approved</strong>!</p>
            <div style="background-color: white; border-left: 4px solid #0d47a1; padding: 15px; margin: 20px 0;">
              <p><strong>Customer ID:</strong> ${customerId}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <p>You can now log in and enjoy the following services:</p>
            <ul>
              <li>Deposit & Withdraw Money</li>
              <li>Fund Transfers</li>
              <li>Apply for Loans</li>
              <li>Fixed & Recurring Deposits</li>
              <li>24/7 Customer Support</li>
            </ul>
            <p style="margin-top: 20px;">Thank you for choosing <strong>MyFin Bank</strong>!</p>
            <p>— MyFin Bank Team</p>
          </div>
          <div style="background-color: #0d47a1; padding: 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2026 MyFin Bank. All rights reserved.</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error('❌ Approval email failed:', err.message);
  }
};

const sendLoanApprovalEmail = async (customerName, customerEmail, loanId, loanAmount, emiAmount, tenureMonths, interestRate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: customerEmail,
      subject: '✅ MyFin Bank — Your Loan Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #0d47a1; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">MyFin Bank</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #0d47a1;">Loan Approved! 🎉</h2>
            <p>Dear <strong>${customerName}</strong>,</p>
            <p>We are happy to inform you that your loan application has been <strong style="color: green;">approved</strong>!</p>
            <div style="background-color: white; border-left: 4px solid #c62828; padding: 15px; margin: 20px 0;">
              <p><strong>Loan ID:</strong> ${loanId}</p>
              <p><strong>Loan Amount:</strong> ₹${loanAmount?.toLocaleString()}</p>
              <p><strong>Interest Rate:</strong> ${interestRate}% per annum</p>
              <p><strong>Tenure:</strong> ${tenureMonths} months</p>
              <p><strong>Monthly EMI:</strong> ₹${emiAmount?.toLocaleString()}</p>
            </div>
            <p>Your EMI payments will begin from next month. Please ensure sufficient balance in your account.</p>
            <p>— MyFin Bank Team</p>
          </div>
          <div style="background-color: #0d47a1; padding: 10px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2026 MyFin Bank. All rights reserved.</p>
          </div>
        </div>
      `
    });
  } catch (err) {
    console.error('❌ Loan approval email failed:', err.message);
  }
};

module.exports = { sendZeroBalanceAlert, sendOTPEmail, sendCustomerApprovalEmail, sendLoanApprovalEmail };