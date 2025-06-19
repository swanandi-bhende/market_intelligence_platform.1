// server/models/Competitor.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for price history
const PriceHistorySchema = new Schema({
  price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  currency: { type: String, default: 'USD' }
}, { _id: false });

// Sub-schema for product tracking
const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String },
  category: { type: String },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

// Sub-schema for social media presence
const SocialMediaSchema = new Schema({
  platform: { type: String, enum: ['twitter', 'facebook', 'instagram', 'linkedin'], required: true },
  followers: { type: Number },
  engagementRate: { type: Number },
  lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

// Main Competitor schema
const CompetitorSchema = new Schema({
  // Basic information
  name: { type: String, required: true, unique: true },
  description: { type: String },
  websiteUrl: { type: String, required: true },
  logoUrl: { type: String },
  
  // Market position
  marketShare: { type: Number, min: 0, max: 100 },
  industry: { type: String },
  competitiveRating: { type: Number, min: 1, max: 5 },
  
  // Pricing information
  currentPrice: { type: Number },
  priceHistory: [PriceHistorySchema],
  pricingStrategy: { type: String, enum: ['premium', 'economy', 'value', 'skimming', 'penetration'] },
  
  // Product information
  products: [ProductSchema],
  productCount: { type: Number, default: 0 },
  
  // Social media presence
  socialMedia: [SocialMediaSchema],
  
  // Sentiment analysis (simple version without ML)
  sentimentScore: { type: Number, min: -1, max: 1, default: 0 },
  positiveKeywords: [{ type: String }],
  negativeKeywords: [{ type: String }],
  
  // Tracking metadata
  isActive: { type: Boolean, default: true },
  trackingSince: { type: Date, default: Date.now },
  lastScraped: { type: Date },
  scrapeFrequency: { type: Number, default: 24 }, // in hours
  
  // Relationships
  relatedCompetitors: [{ type: Schema.Types.ObjectId, ref: 'Competitor' }],
  
  // Custom fields
  tags: [{ type: String }],
  notes: { type: String }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for price change percentage
CompetitorSchema.virtual('priceChangePercentage').get(function() {
  if (!this.priceHistory || this.priceHistory.length < 2) return 0;
  const current = this.priceHistory[this.priceHistory.length - 1].price;
  const previous = this.priceHistory[this.priceHistory.length - 2].price;
  return ((current - previous) / previous) * 100;
});

// Virtual for average product price
CompetitorSchema.virtual('avgProductPrice').get(function() {
  if (!this.products || this.products.length === 0) return 0;
  const sum = this.products.reduce((total, product) => total + product.price, 0);
  return sum / this.products.length;
});

// Pre-save hook to update product count
CompetitorSchema.pre('save', function(next) {
  this.productCount = this.products ? this.products.length : 0;
  next();
});

// Static method to find by industry
CompetitorSchema.statics.findByIndustry = function(industry) {
  return this.find({ industry: new RegExp(industry, 'i') });
};

// Instance method to add price update
CompetitorSchema.methods.addPriceUpdate = function(price) {
  this.priceHistory.push({ price });
  this.currentPrice = price;
  return this.save();
};

// Indexes for better performance
CompetitorSchema.index({ name: 1 });
CompetitorSchema.index({ industry: 1 });
CompetitorSchema.index({ currentPrice: 1 });
CompetitorSchema.index({ marketShare: -1 });
CompetitorSchema.index({ competitiveRating: -1 });
CompetitorSchema.index({ sentimentScore: -1 });
CompetitorSchema.index({ lastScraped: 1 });

const Competitor = mongoose.model('Competitor', CompetitorSchema);

module.exports = Competitor;