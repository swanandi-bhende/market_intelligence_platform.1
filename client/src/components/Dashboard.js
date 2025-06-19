import React from 'react';
import { Card } from './Common';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Summary cards component
export const SummaryCards = ({ data }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}
    >
      {data.map((item, index) => (
        <Card key={index}>
          <h3 style={{ color: '#6c757d', fontSize: '1rem', marginBottom: '0.5rem' }}>
            {item.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', marginRight: '0.5rem' }}>
              {item.value}
            </span>
            <span
              style={{
                color: item.change.startsWith('+') ? '#28a745' : '#dc3545',
                fontWeight: '500',
              }}
            >
              {item.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Bar chart component
export const BarChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + '%';
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// Pie chart component
export const PieChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${percentage}%`;
          },
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

// Line chart component
export const LineChart = ({ data }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  return <Line data={data} options={options} />;
};

// Recent activity component
export const RecentActivity = ({ activities }) => {
  return (
    <Card>
      <h2>Recent Activity</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {activities.map((activity, index) => (
          <li
            key={index}
            style={{
              padding: '0.5rem 0',
              borderBottom: '1px solid #eee',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  activity.type === 'alert'
                    ? '#dc3545'
                    : activity.type === 'update'
                    ? '#17a2b8'
                    : '#28a745',
                marginRight: '0.5rem',
              }}
            />
            <div>
              <div>{activity.message}</div>
              <small style={{ color: '#6c757d' }}>{activity.time}</small>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};
