import React from 'react';
import styled from 'styled-components';

const InfoCard = styled.div`
  margin-top: 15px;
  padding: 15px;
  background-color: rgba(74, 111, 165, 0.1);
  border-radius: 8px;
  border-left: 4px solid #4a6fa5;
`;

const methodInfo = {
  moving_average: {
    title: "Moving Average",
    description: "Smooths out short-term fluctuations and highlights longer-term trends by averaging data points over a specified window.",
    best_for: "Stable markets with consistent patterns"
  },
  linear_regression: {
    title: "Linear Regression",
    description: "Identifies a linear trend in historical data and projects it into the future.",
    best_for: "Trending markets with steady growth/decline"
  },
  exponential_smoothing: {
    title: "Exponential Smoothing",
    description: "Gives more weight to recent observations while not discarding older observations entirely.",
    best_for: "Markets with changing trends but no seasonality"
  },
  seasonal_naive: {
    title: "Seasonal Naive",
    description: "Uses values from previous seasons as forecasts, assuming patterns will repeat.",
    best_for: "Highly seasonal markets with repeating patterns"
  }
};

function ForecastMethodInfo({ method }) {
  const info = methodInfo[method] || methodInfo.moving_average;
  
  return (
    <InfoCard>
      <h4>{info.title} Method</h4>
      <p>{info.description}</p>
      <p><strong>Best for:</strong> {info.best_for}</p>
    </InfoCard>
  );
}

export default ForecastMethodInfo;