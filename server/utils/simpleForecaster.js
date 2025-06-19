class SimpleForecaster {
    constructor() {
        this.methods = {
            moving_average: this.movingAverage,
            linear_regression: this.linearRegression,
            exponential_smoothing: this.exponentialSmoothing,
            seasonal_naive: this.seasonalNaive
        };
    }

    /**
     * Main forecasting method
     * @param {Array} data - Historical data points
     * @param {Object} options - Forecasting options
     * @returns {Object} - Forecast results
     */
    forecast(data, options = {}) {
        const {
            method = 'moving_average',
            steps = 7,
            windowSize = 3,
            alpha = 0.3,
            seasonLength = 7
        } = options;

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Historical data must be a non-empty array');
        }

        if (!this.methods[method]) {
            throw new Error(`Unsupported forecasting method: ${method}`);
        }

        // Convert all data points to numbers
        const numericData = data.map(Number).filter(n => !isNaN(n));

        return {
            method,
            steps,
            forecast: this.methods[method](numericData, { steps, windowSize, alpha, seasonLength }),
            lastValue: numericData[numericData.length - 1],
            dataPoints: numericData.length
        };
    }

    movingAverage(data, { steps, windowSize }) {
        if (data.length < windowSize) {
            throw new Error(`Need at least ${windowSize} data points for moving average`);
        }

        const forecasts = [];
        let currentWindow = data.slice(-windowSize);

        for (let i = 0; i < steps; i++) {
            const avg = currentWindow.reduce((sum, val) => sum + val, 0) / windowSize;
            forecasts.push(avg);
            currentWindow.shift();
            currentWindow.push(avg);
        }

        return forecasts;
    }

    linearRegression(data, { steps }) {
        if (data.length < 2) {
            throw new Error('Need at least 2 data points for linear regression');
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

        return Array.from({ length: steps }, (_, i) => intercept + slope * (n + i));
    }

    exponentialSmoothing(data, { steps, alpha }) {
        if (data.length < 1) {
            throw new Error('Need at least 1 data point for exponential smoothing');
        }

        const forecasts = [];
        let lastSmoothed = data[0];

        for (let i = 1; i < data.length; i++) {
            lastSmoothed = alpha * data[i] + (1 - alpha) * lastSmoothed;
        }

        for (let i = 0; i < steps; i++) {
            forecasts.push(lastSmoothed);
        }

        return forecasts;
    }

    seasonalNaive(data, { steps, seasonLength }) {
        if (data.length < seasonLength) {
            throw new Error(`Need at least ${seasonLength} data points for seasonal naive forecast`);
        }

        const forecasts = [];
        const lastSeason = data.slice(-seasonLength);

        for (let i = 0; i < steps; i++) {
            forecasts.push(lastSeason[i % seasonLength]);
        }

        return forecasts;
    }

    calculateAccuracy(actual, predicted) {
        if (actual.length !== predicted.length) {
            throw new Error('Actual and predicted arrays must have same length');
        }

        const n = actual.length;
        let sumError = 0;
        let sumAbsoluteError = 0;
        let sumSquaredError = 0;
        let sumActual = 0;

        for (let i = 0; i < n; i++) {
            const error = actual[i] - predicted[i];
            sumError += error;
            sumAbsoluteError += Math.abs(error);
            sumSquaredError += error * error;
            sumActual += actual[i];
        }

        const meanError = sumError / n;
        const meanAbsoluteError = sumAbsoluteError / n;
        const meanSquaredError = sumSquaredError / n;
        const rootMeanSquaredError = Math.sqrt(meanSquaredError);
        const meanActual = sumActual / n;
        const meanAbsolutePercentageError = (sumAbsoluteError / sumActual) * 100;

        return {
            meanError,
            meanAbsoluteError,
            meanSquaredError,
            rootMeanSquaredError,
            meanAbsolutePercentageError,
            accuracy: 100 - meanAbsolutePercentageError
        };
    }
}

module.exports = SimpleForecaster;
