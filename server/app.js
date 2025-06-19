// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const config = require('./config/config');

// Import routes
const competitorRoutes = require('./routes/competitors');
const forecastRoutes = require('./routes/forecasts');
const sentimentRoutes = require('./routes/sentiments');
const simulationRoutes = require('./routes/simulations');

// Initialize Express app
const app = express();

// Debug: Confirm MONGO_URI loaded correctly
console.log('Mongo URI:', config.db.uri);

// Connect to MongoDB
mongoose.connect(config.db.uri, config.db.options)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs, // 15 minutes
  max: config.security.rateLimit.max, // Limit each IP to 100 requests per window
});
app.use(limiter);

// Register routes
app.use('/api/competitors', competitorRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/sentiments', sentimentRoutes);
app.use('/api/simulations', simulationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
