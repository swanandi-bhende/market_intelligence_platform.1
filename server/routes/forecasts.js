const express = require('express');
const router = express.Router();
const forecastService = require('../services/forecastService');

router.get('/:productId', async (req, res, next) => {
  try {
    const method = req.query.method || 'moving_average';
    const forecast = await forecastService.getForecast(req.params.productId, method);
    res.json({
      success: true,
      method,
      forecast
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;