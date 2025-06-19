const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const toBool = (val) => String(val).toLowerCase() === 'true';

module.exports = {
  // Server Configuration
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  // Database Configuration
  db: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/market_intelligence',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  // API Security and Rate Limiting
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your_default_jwt_secret_key',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  },

  // Scraper Configuration
  scraper: {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    timeout: 10000, // 10 seconds
    retries: 2,
    competitors: {
      defaultInterval: 3600000, // 1 hour in milliseconds
    }
  },

  // Forecasting Configuration
  forecasting: {
    defaultMethod: 'moving_average', // 'moving_average' or 'linear_regression'
    movingAverageWindow: 3,
    forecastPeriod: 7
  },

  // Sentiment Analysis Configuration
  sentiment: {
    defaultThresholds: {
      positive: 0.6,
      negative: 0.4
    },
    keywordWeights: {
      positive: ['good', 'great', 'excellent', 'happy', 'satisfied'],
      negative: ['bad', 'poor', 'terrible', 'unhappy', 'angry']
    }
  },

  // Caching Configuration
  cache: {
    enabled: toBool(process.env.CACHE_ENABLED) || false,
    ttl: 3600 // 1 hour
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: {
      enabled: toBool(process.env.LOG_TO_FILE) || false,
      path: path.join(__dirname, '../../logs/app.log')
    }
  },

  // API Documentation
  apiDocs: {
    enabled: toBool(process.env.API_DOCS_ENABLED) || false,
    route: '/api-docs'
  }
};
