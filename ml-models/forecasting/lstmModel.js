class SimpleForecaster {
  constructor() {
    this.data = null;
  }

  // Simple moving average forecast
  async predict(data, steps = 7, windowSize = 3) {
    if (!data || data.length < windowSize) {
      throw new Error(`Need at least ${windowSize} data points`);
    }

    const predictions = [];
    for (let i = 0; i < steps; i++) {
      const window = data.slice(-windowSize);
      const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
      predictions.push(average);
      data.push(average); // Add prediction to data for next step
    }

    return predictions;
  }

  // Simple linear regression forecast
  async linearRegressionForecast(data, steps = 7) {
    if (!data || data.length < 2) {
      throw new Error('Need at least 2 data points');
    }

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    data.forEach((y, x) => {
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const predictions = [];
    for (let i = 0; i < steps; i++) {
      predictions.push(intercept + slope * (n + i));
    }

    return predictions;
  }
}

module.exports = SimpleForecaster;