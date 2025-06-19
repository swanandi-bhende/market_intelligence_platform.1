// server/services/competitorService.js

const Competitor = require('../models/Competitor');
const PriceHistory = require('../models/PriceHistory');
const { scrapeCompetitorData } = require('../utils/scraping');

class CompetitorService {
  async getAllCompetitors() {
    try {
      const competitors = await Competitor.find().sort({ marketShare: -1 });
      return competitors;
    } catch (error) {
      throw error;
    }
  }

  async getCompetitorById(id) {
    try {
      const competitor = await Competitor.findById(id);
      return competitor;
    } catch (error) {
      throw error;
    }
  }

  async getPriceHistory(competitorId) {
    try {
      const history = await PriceHistory.find({ competitor: competitorId })
        .sort({ date: 1 })
        .limit(30); // Last 30 days
      return history;
    } catch (error) {
      throw error;
    }
  }

  async createCompetitor(competitorData) {
    try {
      const newCompetitor = new Competitor(competitorData);
      await newCompetitor.save();

      // Start scraping data for this new competitor
      await scrapeCompetitorData(newCompetitor.websiteUrl);

      return newCompetitor;
    } catch (error) {
      throw error;
    }
  }

  async updateCompetitorPrices() {
    const competitors = await Competitor.find();
    for (const competitor of competitors) {
      await this.updateCompetitorPrice(competitor._id);
    }
  }

  async updateCompetitorPrice(competitorId) {
    try {
      const competitor = await Competitor.findById(competitorId);
      if (!competitor) return;

      // Scrape latest price
      const scrapedData = await scrapeCompetitorData(competitor.websiteUrl);

      // Update current price
      competitor.price = scrapedData.price;
      await competitor.save();

      // Add to price history
      const priceHistory = new PriceHistory({
        competitor: competitorId,
        price: scrapedData.price,
        date: new Date(),
      });
      await priceHistory.save();
    } catch (error) {
      console.error(`Error updating price for competitor ${competitorId}:`, error);
    }
  }
}

module.exports = new CompetitorService();
