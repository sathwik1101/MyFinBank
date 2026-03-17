const passwordResetService = require('../services/passwordResetService');

const requestReset = async (req, res) => {
  try {
    const result = await passwordResetService.requestPasswordReset(req.body.email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await passwordResetService.resetPassword(email, otp, newPassword);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { requestReset, resetPassword };