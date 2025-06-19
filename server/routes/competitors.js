const express = require('express');
const router = express.Router();
const Competitor = require('../models/Competitor');
const competitorService = require('../services/competitorService');

// Get all competitors
router.get('/', async (req, res, next) => {
  try {
    const competitors = await competitorService.getAllCompetitors();
    res.json(competitors);
  } catch (err) {
    next(err);
  }
});

// Get competitor by ID
router.get('/:id', async (req, res, next) => {
  try {
    const competitor = await competitorService.getCompetitorById(req.params.id);
    if (!competitor) {
      return res.status(404).json({ error: 'Competitor not found' });
    }
    res.json(competitor);
  } catch (err) {
    next(err);
  }
});

// Get competitor price history
router.get('/:id/prices', async (req, res, next) => {
  try {
    const priceHistory = await competitorService.getPriceHistory(req.params.id);
    res.json(priceHistory);
  } catch (err) {
    next(err);
  }
});

// Add new competitor (admin only)
router.post('/', async (req, res, next) => {
  try {
    // Add authentication/authorization check here
    const newCompetitor = await competitorService.createCompetitor(req.body);
    res.status(201).json(newCompetitor);
  } catch (err) {
    next(err);
  }
});

module.exports = router;