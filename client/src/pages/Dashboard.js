import React from 'react';
import styled from 'styled-components';
import { Card, ChartContainer } from '../components/Common';
import { LineChart, BarChart, PieChart, SummaryCards } from '../components/Dashboard';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

function Dashboard() {
  // Sample data - replace with your API data as needed
  const marketTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Market Growth',
        data: [65, 59, 80, 81, 56, 72],
        borderColor: '#4a6fa5',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
      },
    ],
  };

  const competitorData = {
    labels: ['Competitor A', 'Competitor B', 'Competitor C', 'Competitor D'],
    datasets: [
      {
        label: 'Market Share',
        data: [35, 25, 20, 20],
        backgroundColor: ['#4a6fa5', '#6b8cae', '#ff6b6b', '#88c999'],
      },
    ],
  };

  const sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: ['#88c999', '#6b8cae', '#ff6b6b'],
      },
    ],
  };

  const summaryData = [
    { title: 'Total Competitors', value: '24', change: '+3%' },
    { title: 'Market Growth', value: '12.5%', change: '+2.1%' },
    { title: 'Positive Sentiment', value: '65%', change: '+5%' },
    { title: 'Trending Products', value: '8', change: '+2' },
  ];

  return (
    <div>
      <Section>
        <SectionTitle>Market Overview</SectionTitle>
        <SummaryCards data={summaryData} />
      </Section>

      <Section>
        <SectionTitle>Market Trends</SectionTitle>
        <DashboardContainer>
          <Card>
            <ChartContainer>
              <LineChart data={marketTrendsData} />
            </ChartContainer>
          </Card>

          <Card>
            <ChartContainer>
              <BarChart data={competitorData} />
            </ChartContainer>
          </Card>

          <Card>
            <ChartContainer>
              <PieChart data={sentimentData} />
            </ChartContainer>
          </Card>
        </DashboardContainer>
      </Section>

      <Section>
        <SectionTitle>Recent Alerts</SectionTitle>
        {/* Add alert components or content here */}
      </Section>
    </div>
  );
}

export default Dashboard;
