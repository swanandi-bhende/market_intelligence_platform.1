import React from 'react';
import { Line } from 'react-chartjs-2';
import '../utils/chartSetup'; // Ensure chart elements are registered

const ForecastChart = ({ historicalData, forecastData }) => {
  const labels = [
    ...historicalData.map((_, i) => `Day ${i + 1}`),
    ...forecastData.map((_, i) => `F ${i + 1}`)
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Historical Data',
        data: [...historicalData, ...Array(forecastData.length).fill(null)],
        borderColor: '#4a6fa5',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
        tension: 0.1
      },
      {
        label: 'Forecast',
        data: [...Array(historicalData.length).fill(null), ...forecastData],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderDash: [5, 5],
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: false
      }
    }
  };

  return <Line key="forecast-chart" data={data} options={options} />;
};

export default ForecastChart;
