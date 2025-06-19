const SimpleForecaster = require('../utils/simpleForecaster');

class ForecastService {
  constructor() {
    this.forecaster = new SimpleForecaster();
  }

  async getForecast(productId, method = 'moving_average') {
    // Replace with actual DB fetch in real app
    const historicalData = await this.getHistoricalData(productId);

    if (method === 'moving_average') {
      return this.forecaster.forecast(historicalData, { method: 'moving_average' });
    } else if (method === 'linear_regression') {
      return this.forecaster.forecast(historicalData, { method: 'linear_regression' });
    } else if (method === 'exponential_smoothing') {
      return this.forecaster.forecast(historicalData, { method: 'exponential_smoothing' });
    } else if (method === 'seasonal_naive') {
      return this.forecaster.forecast(historicalData, { method: 'seasonal_naive' });
    } else {
      throw new Error(`Unsupported forecast method: ${method}`);
    }
  }

  async getHistoricalData(productId) {
    // Mock data - replace with actual database query
    return [10, 12, 15, 14, 18, 20, 22];
  }
}

module.exports = new ForecastService();
