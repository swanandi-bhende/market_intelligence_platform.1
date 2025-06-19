import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Select, Button, Input, Label } from '../components/Common';
import { LineChart } from '../components/Dashboard';
import ForecastMethodInfo from '../components/ForecastMethodInfo';

const PageContainer = styled.div`
  padding: 20px;
`;

const ForecastForm = styled(Card)`
  padding: 20px;
  margin-bottom: 20px;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin-top: 20px;
`;

const ResultsContainer = styled(Card)`
  padding: 20px;
  margin-top: 20px;
`;

const MethodComparison = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ForecastGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 25px;
`;

const ForecastValue = styled.div`
  padding: 10px;
  background-color: rgba(74, 111, 165, 0.1);
  border-radius: 4px;
  text-align: center;
  font-weight: 500;

  & > div:first-child {
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

const formatMethodName = (method) =>
  method
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

function MarketForecasting() {
  const [forecastMethod, setForecastMethod] = useState('moving_average');
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState(3);
  const [steps, setSteps] = useState(7);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);

  useEffect(() => {
    // Mock historical data
    const mockData = Array.from({ length: 30 }, (_, i) =>
      100 + Math.sin(i / 2) * 20 + Math.random() * 10
    );
    setHistoricalData(mockData);
  }, []);

  const runForecast = async () => {
    if (windowSize < 2 || windowSize > 10 || steps < 1 || steps > 30) return;
    setLoading(true);
    try {
      // Mock forecast call
      setTimeout(() => {
        const mockForecast = Array.from({ length: steps }, () => {
          const lastValue = historicalData[historicalData.length - 1];
          const trend =
            forecastMethod === 'linear_regression'
              ? lastValue * 0.98
              : lastValue * 0.995;
          return trend + Math.random() * 5;
        });
        setForecastData(mockForecast);
        setLoading(false);
        setShowComparison(false);
      }, 1000);
    } catch (error) {
      console.error('Forecast error:', error);
      setLoading(false);
    }
  };

  const compareMethods = async () => {
    if (windowSize < 2 || windowSize > 10 || steps < 1 || steps > 30) return;
    setLoading(true);
    try {
      setTimeout(() => {
        const methods = [
          'moving_average',
          'linear_regression',
          'exponential_smoothing',
        ];
        const results = methods.map((method) => {
          const forecast = Array.from({ length: steps }, () => {
            const lastValue = historicalData[historicalData.length - 1];
            let trend;
            if (method === 'moving_average') trend = lastValue * 0.995;
            else if (method === 'linear_regression') trend = lastValue * 0.98;
            else trend = lastValue * 1.01;
            return trend + Math.random() * 5;
          });

          return {
            method,
            forecast,
            accuracy: 80 + Math.random() * 15, // Mock accuracy
          };
        });

        setComparisonResults(results);
        setShowComparison(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Comparison error:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: [
      ...historicalData.map((_, i) => `Day ${i + 1}`),
      ...forecastData.map((_, i) => `F ${i + 1}`),
    ],
    datasets: [
      {
        label: 'Historical Data',
        data: [...historicalData, ...Array(forecastData.length).fill(null)],
        borderColor: '#4a6fa5',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Forecast',
        data: [...Array(historicalData.length).fill(null), ...forecastData],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderDash: [5, 5],
        tension: 0.1,
      },
    ],
  };

  return (
    <PageContainer>
      <h1>Market Forecasting</h1>

      <ForecastForm>
        <ForecastGrid>
          <div>
            <Label>
              Forecasting Method
              <Select
                value={forecastMethod}
                onChange={(e) => setForecastMethod(e.target.value)}
              >
                <option value="moving_average">Moving Average</option>
                <option value="linear_regression">Linear Regression</option>
                <option value="exponential_smoothing">Exponential Smoothing</option>
                <option value="seasonal_naive">Seasonal Naive</option>
              </Select>
            </Label>

            {forecastMethod === 'moving_average' && (
              <Label>
                Window Size
                <Input
                  type="number"
                  value={windowSize}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setWindowSize(val);
                  }}
                  min="2"
                  max="10"
                />
              </Label>
            )}
          </div>

          <div>
            <Label>
              Forecast Period (days)
              <Input
                type="number"
                value={steps}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setSteps(val);
                }}
                min="1"
                max="30"
              />
            </Label>

            <ButtonGroup>
              <Button
                primary
                onClick={runForecast}
                disabled={
                  loading ||
                  historicalData.length === 0 ||
                  windowSize < 2 ||
                  windowSize > 10 ||
                  steps < 1 ||
                  steps > 30
                }
              >
                {loading ? 'Forecasting...' : 'Run Forecast'}
              </Button>

              <Button
                onClick={compareMethods}
                disabled={
                  loading ||
                  historicalData.length === 0 ||
                  windowSize < 2 ||
                  windowSize > 10 ||
                  steps < 1 ||
                  steps > 30
                }
              >
                Compare Methods
              </Button>
            </ButtonGroup>
          </div>
        </ForecastGrid>

        <ForecastMethodInfo method={forecastMethod} />
      </ForecastForm>

      {forecastData.length > 0 && (
        <ResultsContainer>
          <h2>Forecast Results</h2>
          <ChartContainer>
            <LineChart data={chartData} />
          </ChartContainer>

          <div style={{ marginTop: '20px' }}>
            <h3>Forecasted Values</h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px',
              }}
            >
              {forecastData.map((value, i) => (
                <ForecastValue key={i}>
                  <div>Day {i + 1}</div>
                  <div>${value.toFixed(2)}</div>
                </ForecastValue>
              ))}
            </div>
          </div>
        </ResultsContainer>
      )}

      {showComparison && comparisonResults && (
        <ResultsContainer>
          <h2>Method Comparison</h2>
          <ChartContainer>
            <LineChart
              data={{
                labels: [
                  ...historicalData.map((_, i) => `D${i + 1}`),
                  ...Array(steps).fill(0).map((_, i) => `F${i + 1}`),
                ],
                datasets: [
                  {
                    label: 'Historical Data',
                    data: [...historicalData, ...Array(steps).fill(null)],
                    borderColor: '#4a6fa5',
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                    tension: 0.1,
                  },
                  ...comparisonResults.map((result, i) => ({
                    label: `${formatMethodName(result.method)} (${result.accuracy.toFixed(1)}%)`,
                    data: [...Array(historicalData.length).fill(null), ...result.forecast],
                    borderColor: ['#ff6b6b', '#88c999', '#f4a261'][i],
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.1,
                  })),
                ],
              }}
            />
          </ChartContainer>

          <MethodComparison>
            {comparisonResults.map((result, i) => (
              <Card key={i}>
                <h3>{formatMethodName(result.method)}</h3>
                <p>
                  Accuracy: <strong>{result.accuracy.toFixed(1)}%</strong>
                </p>
                <p>
                  Forecast Range:
                  <strong> ${Math.min(...result.forecast).toFixed(2)}</strong> to
                  <strong> ${Math.max(...result.forecast).toFixed(2)}</strong>
                </p>
                <p>
                  Average:
                  <strong> ${(result.forecast.reduce((a, b) => a + b, 0) / result.forecast.length).toFixed(2)}</strong>
                </p>
              </Card>
            ))}
          </MethodComparison>
        </ResultsContainer>
      )}
    </PageContainer>
  );
}

export default MarketForecasting;
