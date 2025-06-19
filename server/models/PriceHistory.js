// server/models/PriceHistory.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceHistorySchema = new Schema({
  // Reference to the competitor
  competitor: { 
    type: Schema.Types.ObjectId, 
    ref: 'Competitor', 
    required: true,
    index: true 
  },

  // Reference to the specific product (if tracking individual products)
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product', // You might create a Product model later
    index: true
  },

  // Price details
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR', 'JPY'], // Add more as needed
    uppercase: true
  },
  priceType: {
    type: String,
    enum: ['regular', 'sale', 'discounted', 'clearance', 'subscription'],
    default: 'regular'
  },

  // Contextual information
  timestamp: { 
    type: Date, 
    default: Date.now,
    index: true 
  },
  source: {
    type: String,
    enum: ['scraper', 'manual', 'api', 'import'],
    default: 'scraper'
  },
  sourceUrl: String,

  // Additional metadata
  wasPromoted: Boolean,
  promotionText: String,
  stockStatus: {
    type: String,
    enum: ['in_stock', 'out_of_stock', 'limited', 'preorder'],
    default: 'in_stock'
  },

  // For price comparison calculations
  previousPrice: Number,
  priceChange: Number,
  priceChangePercentage: Number,

  // For tracking purposes
  scrapeSessionId: String,
  dataVersion: Number
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to calculate price changes
PriceHistorySchema.pre('save', async function(next) {
  if (this.isNew) {
    // Only calculate changes for new records
    const lastRecord = await this.constructor.findOne(
      { competitor: this.competitor, product: this.product },
      {},
      { sort: { timestamp: -1 } }
    );

    if (lastRecord) {
      this.previousPrice = lastRecord.price;
      this.priceChange = this.price - lastRecord.price;
      this.priceChangePercentage = (this.priceChange / lastRecord.price) * 100;
    }
  }
  next();
});

// Indexes for optimized queries
PriceHistorySchema.index({ competitor: 1, timestamp: -1 }); // Get latest prices for competitor
PriceHistorySchema.index({ product: 1, timestamp: -1 });    // Get latest prices for product
PriceHistorySchema.index({ timestamp: 1 });                 // Time-based analysis
PriceHistorySchema.index({ priceChangePercentage: 1 });     // Find significant changes

// Static method to get price history for a competitor
PriceHistorySchema.statics.getCompetitorHistory = function(competitorId, options = {}) {
  const { limit = 100, sort = -1, startDate, endDate } = options;
  
  const query = { competitor: competitorId };
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  return this.find(query)
    .sort({ timestamp: sort })
    .limit(limit)
    .populate('competitor', 'name websiteUrl');
};

// Static method to get current prices for all competitors
PriceHistorySchema.statics.getCurrentPrices = function(productId = null) {
  const matchStage = productId ? { product: productId } : {};
  
  return this.aggregate([
    { $match: matchStage },
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: {
          competitor: "$competitor",
          product: "$product"
        },
        latestRecord: { $first: "$$ROOT" }
      }
    },
    {
      $replaceRoot: { newRoot: "$latestRecord" }
    },
    { $sort: { price: 1 } }
  ]);
};

// Instance method to check if price is historic low
PriceHistorySchema.methods.isHistoricLow = async function() {
  const lowerPrices = await this.constructor.countDocuments({
    competitor: this.competitor,
    product: this.product,
    price: { $lt: this.price }
  });
  return lowerPrices === 0;
};

const PriceHistory = mongoose.model('PriceHistory', PriceHistorySchema);

module.exports = PriceHistory;