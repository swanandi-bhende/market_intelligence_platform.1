import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import '../utils/chartSetup'; // Chart.js setup
import { Card } from './Common';
import styled from 'styled-components';

const ChartContainer = styled.div`
  margin: 20px 0;
  position: relative;
  height: 400px;
`;

const ChartTabs = styled.div`
  display: flex;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
`;

const ChartTab = styled.button`
  padding: 8px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${({ active, theme }) => (active ? theme.primary : 'transparent')};
  color: ${({ active, theme }) => (active ? theme.primary : '#666')};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  transition: all 0.2s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SummaryCard = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const SummaryItem = styled.div`
  flex: 1;
  min-width: 150px;
  padding: 15px;
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.cardShadow};

  h4 {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 5px;
  }

  p {
    font-size: 1.2rem;
    font-weight: bold;
    color: ${({ theme }) => theme.primary};
  }
`;

const SimulationChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState('prices');

  const chartData = {
    prices: {
      labels: data.weeks.map((week) => `Week ${week.week}`),
      datasets: [
        {
          label: 'Your Price',
          data: data.weeks.map((week) => week.yourPrice),
          borderColor: '#4a6fa5',
          backgroundColor: 'rgba(74, 111, 165, 0.1)',
          tension: 0.3
        },
        ...data.weeks[0].competitors.map((comp, i) => ({
          label: comp.name,
          data: data.weeks.map((week) => week.competitors[i].price),
          borderColor: ['#6b8cae', '#ff6b6b', '#88c999', '#f4a261'][i % 4],
          backgroundColor: 'transparent',
          tension: 0.3,
          borderDash: [5, 5]
        }))
      ]
    },
    marketShare: {
      labels: data.weeks.map((week) => `Week ${week.week}`),
      datasets: [
        {
          label: 'Market Share',
          data: data.weeks.map((week) => week.marketShare),
          backgroundColor: 'rgba(74, 111, 165, 0.6)',
          borderColor: '#4a6fa5',
          borderWidth: 1
        }
      ]
    },
    profit: {
      labels: data.weeks.map((week) => `Week ${week.week}`),
      datasets: [
        {
          label: 'Profit',
          data: data.weeks.map((week) => week.profit),
          backgroundColor: 'rgba(40, 167, 69, 0.6)',
          borderColor: '#28a745',
          borderWidth: 1
        }
      ]
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            const label = context.dataset.label || '';
            if (value === null) return label;

            return `${label}: ${
              activeTab === 'prices'
                ? `$${value.toFixed(2)}`
                : activeTab === 'marketShare'
                ? `${value.toFixed(1)}%`
                : `$${value.toLocaleString()}`
            }`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: activeTab !== 'prices',
        ticks: {
          callback: (value) => {
            return activeTab === 'prices'
              ? `$${value}`
              : activeTab === 'marketShare'
              ? `${value}%`
              : `$${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <Card>
      <h3>
        {data.scenario === 'price-war'
          ? 'Price War Simulation'
          : data.scenario === 'new-product'
          ? 'New Product Launch'
          : 'Promotion Impact'}{' '}
        Results
      </h3>

      <ChartTabs>
        <ChartTab active={activeTab === 'prices'} onClick={() => setActiveTab('prices')}>
          Prices
        </ChartTab>
        <ChartTab active={activeTab === 'marketShare'} onClick={() => setActiveTab('marketShare')}>
          Market Share
        </ChartTab>
        <ChartTab active={activeTab === 'profit'} onClick={() => setActiveTab('profit')}>
          Profit
        </ChartTab>
      </ChartTabs>

      <ChartContainer>
        {activeTab === 'prices' && <Line key="prices" data={chartData.prices} options={chartOptions} />}
        {activeTab === 'marketShare' && <Bar key="marketShare" data={chartData.marketShare} options={chartOptions} />}
        {activeTab === 'profit' && (
          <Bar
            key="profit"
            data={chartData.profit}
            options={{
              ...chartOptions,
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                  }
                }
              }
            }}
          />
        )}
      </ChartContainer>

      <SummaryCard>
        <SummaryItem>
          <h4>Final Market Share</h4>
          <p>{data.summary.finalMarketShare.toFixed(1)}%</p>
        </SummaryItem>
        <SummaryItem>
          <h4>Total Profit</h4>
          <p>${data.summary.totalProfit.toLocaleString()}</p>
        </SummaryItem>
        <SummaryItem>
          <h4>Price Reduction</h4>
          <p>{data.summary.priceReduction.toFixed(1)}%</p>
        </SummaryItem>
        {data.scenario === 'new-product' && data.summary.expectedMarketShare && (
          <SummaryItem>
            <h4>Expected Market Share</h4>
            <p>{data.summary.expectedMarketShare.toFixed(1)}%</p>
          </SummaryItem>
        )}
        {data.scenario === 'promotion' && data.summary.totalNewCustomers && (
          <SummaryItem>
            <h4>New Customers</h4>
            <p>{data.summary.totalNewCustomers.toLocaleString()}</p>
          </SummaryItem>
        )}
      </SummaryCard>
    </Card>
  );
};

export default SimulationChart;
