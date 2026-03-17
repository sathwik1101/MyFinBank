const cron = require('node-cron');
const Account = require('../models/Account');

// Runs every hour — checks AT_RISK accounts for 24h expiry
const startAtRiskChecker = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ Running AT_RISK checker...');

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const expiredAccounts = await Account.find({
      status: 'AT_RISK',
      atRiskSince: { $lte: twentyFourHoursAgo }
    });

    for (const account of expiredAccounts) {
      account.status = 'DEACTIVATED';
      account.deactivationType = 'AUTO';
      await account.save();
      console.log(`🔴 Auto-deactivated: ${account.accountNumber}`);
    }
  });
};

module.exports = startAtRiskChecker;