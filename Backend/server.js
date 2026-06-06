process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION:', err);
});
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimitMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const emailRoutes = require('./routes/emailRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Initialize Configuration Environment
dotenv.config();

// Connect Data Layer
connectDB();

const app = express();

// Security and Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// App Route Mount Points
app.use('/api/auth', authRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/profile', profileRoutes);

// Fallback Route Strategies
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`System executing safely in [${process.env.NODE_ENV}] mode on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('SERVER ERROR:', err);
});