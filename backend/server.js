require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const startAtRiskChecker = require('./jobs/atRiskChecker');
const initSocket = require('./socket/socketHandler');

// All routes
const customerRoutes = require('./routes/customerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const loanRoutes = require('./routes/loanRoutes');
const fixedDepositRoutes = require('./routes/fixedDepositRoutes');
const recurringDepositRoutes = require('./routes/recurringDepositRoutes');
const supportRoutes = require('./routes/supportRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const passwordResetRoutes = require('./routes/passwordResetRoutes');

const app = express();
const server = http.createServer(app); // Needed for Socket.io

// Socket.io setup
const io = new Server(server, {
  cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] }
});
initSocket(io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded KYC files

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/fd', fixedDepositRoutes);
app.use('/api/rd', recurringDepositRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/password-reset', passwordResetRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '🏦 MyFin Bank API is running' }));

// Start cron job
startAtRiskChecker();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});