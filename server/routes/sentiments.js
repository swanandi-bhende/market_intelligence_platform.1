// server/routes/sentiments.js

const express = require('express');
const router = express.Router();
const SentimentAnalysis = require('../services/sentimentService');
const { validateSentimentRequest } = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Sentiment Analysis
 *   description: Text sentiment analysis endpoints
 */

/**
 * @swagger
 * /api/sentiments/analyze:
 *   post:
 *     summary: Analyze text sentiment
 *     tags: [Sentiment Analysis]
 */
router.post('/analyze', validateSentimentRequest, async (req, res) => {
  try {
    const { text, language = 'en', method = 'keyword' } = req.body;
    const result = await SentimentAnalysis.analyze(text, { language, method });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiment',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/sentiments/batch:
 *   post:
 *     summary: Analyze multiple texts
 *     tags: [Sentiment Analysis]
 */
router.post('/batch', async (req, res) => {
  try {
    const { texts, language = 'en', method = 'keyword' } = req.body;

    if (!Array.isArray(texts)) {
      return res.status(400).json({
        success: false,
        error: 'Texts must be an array'
      });
    }

    const results = await Promise.all(
      texts.map(text => SentimentAnalysis.analyze(text, { language, method }))
    );

    const stats = {
      averageSentiment: results.reduce((sum, r) => sum + r.sentiment, 0) / results.length,
      positiveCount: results.filter(r => r.sentiment > 0.1).length,
      negativeCount: results.filter(r => r.sentiment < -0.1).length,
      neutralCount: results.filter(r => r.sentiment >= -0.1 && r.sentiment <= 0.1).length
    };

    res.json({
      success: true,
      results,
      stats
    });
  } catch (error) {
    console.error('Batch sentiment analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze sentiments',
      details: error.message
    });
  }
});

/**
 * @swagger
 * /api/sentiments/feedback:
 *   post:
 *     summary: Provide feedback to improve sentiment analysis
 *     tags: [Sentiment Analysis]
 */
router.post('/feedback', async (req, res) => {
  try {
    const { text, actualSentiment, predictedSentiment, method } = req.body;

    if (typeof actualSentiment !== 'number' || actualSentiment < -1 || actualSentiment > 1) {
      return res.status(400).json({
        success: false,
        error: 'Actual sentiment must be a number between -1 and 1'
      });
    }

    await SentimentAnalysis.addFeedback(text, actualSentiment, predictedSentiment, method);

    res.json({
      success: true,
      message: 'Feedback received and will be used to improve the model'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process feedback',
      details: error.message
    });
  }
});

module.exports = router;
