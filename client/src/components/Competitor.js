import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, Table, Button, Input, Label } from './Common';
import { Line } from 'react-chartjs-2';

// Competitor table component
export const CompetitorTable = ({ data }) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Price Change</th>
          <th>Market Share</th>
          <th>Sentiment</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((competitor, index) => (
          <tr key={index}>
            <td>{competitor.name}</td>
            <td>${competitor.price.toFixed(2)}</td>
            <td style={{ color: competitor.priceChange < 0 ? '#dc3545' : '#28a745' }}>
              {competitor.priceChange < 0 ? '▼' : '▲'} {Math.abs(competitor.priceChange.toFixed(2))}%
            </td>
            <td>{competitor.marketShare.toFixed(1)}%</td>
            <td>
              <SentimentBar sentiment={competitor.sentiment} />
            </td>
            <td>
              <Button small>Details</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

// Sentiment visualization bar
const SentimentBar = ({ sentiment }) => {
  const percentage = ((sentiment + 1) / 2) * 100;
  const color = sentiment > 0.3 ? '#28a745' : sentiment < -0.3 ? '#dc3545' : '#ffc107';
  
  return (
    <div style={{
      width: '100%',
      height: '20px',
      backgroundColor: '#e9ecef',
      borderRadius: '4px',
      overflow: 'hidden'
    }}>
      <div style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: color,
        transition: 'width 0.5s ease'
      }} />
    </div>
  );
};

// Competitor price chart component
export const CompetitorPriceChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      fill: false,
      tension: 0.1,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

// Competitor filter component
export const CompetitorFilter = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'All Competitors' },
    { id: 'price', label: 'Price Changes' },
    { id: 'sentiment', label: 'Sentiment' }
  ];

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
      {filters.map(filter => (
        <Button
          key={filter.id}
          primary={activeFilter === filter.id}
          onClick={() => setActiveFilter(filter.id)}
        >
          {filter.label}
        </Button>
      ))}
    </div>
  );
};

// Competitor add/edit form
export const CompetitorForm = ({ competitor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(competitor || {
    name: '',
    websiteUrl: '',
    currentPrice: 0,
    marketShare: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentPrice' || name === 'marketShare' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Label>
          Competitor Name
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Label>
        
        <Label>
          Website URL
          <Input
            type="url"
            name="websiteUrl"
            value={formData.websiteUrl}
            onChange={handleChange}
            required
          />
        </Label>
        
        <Label>
          Current Price ($)
          <Input
            type="number"
            name="currentPrice"
            value={formData.currentPrice}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
          />
        </Label>
        
        <Label>
          Market Share (%)
          <Input
            type="number"
            name="marketShare"
            value={formData.marketShare}
            onChange={handleChange}
            min="0"
            max="100"
            step="0.1"
            required
          />
        </Label>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Button type="submit" primary>
            {competitor ? 'Update' : 'Add'} Competitor
          </Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};