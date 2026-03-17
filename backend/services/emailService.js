const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email to admin AND customer when customer balance hits zero
const sendZeroBalanceAlert = async (customerName, accountNumber, customerEmail) => {
  try {
    console.log('📧 Sending zero balance alert...');

    // Email to Admin
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
    console.log('✅ Admin email sent!');

    // Email to Customer
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
    console.log('✅ Customer email sent to:', customerEmail);

  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
  }
};

// OTP email for password reset
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Sending OTP email to:', email);
    const info = await transporter.sendMail({
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
    console.log('✅ OTP Email sent! Message ID:', info.messageId);
  } catch (err) {
    console.error('❌ OTP Email failed:', err.message);
  }
};

module.exports = { sendZeroBalanceAlert, sendOTPEmail };