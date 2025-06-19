import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, ChartContainer } from '../components/Common';
import { CompetitorPriceChart, CompetitorTable } from '../components/Competitors';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ active, theme }) => (active ? theme.primary : theme.cardBg)};
  color: ${({ active, theme }) => (active ? 'white' : theme.text)};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ active, theme }) => (active ? theme.primary : theme.secondary)};
    color: white;
  }
`;

const LoadingMessage = styled.div`
  padding: 1rem;
  color: ${({ theme }) => theme.textSecondary || '#666'};
  font-style: italic;
`;

function CompetitorAnalysis() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCompetitors([
        {
          id: 1,
          name: 'Competitor A',
          marketShare: 35,
          price: 49.99,
          priceChange: -2.5,
          sentiment: 72,
          products: 24,
          lastUpdated: '2023-05-15',
        },
        {
          id: 2,
          name: 'Competitor B',
          marketShare: 25,
          price: 54.99,
          priceChange: 1.2,
          sentiment: 65,
          products: 18,
          lastUpdated: '2023-05-15',
        },
        {
          id: 3,
          name: 'Competitor C',
          marketShare: 20,
          price: 59.99,
          priceChange: 0,
          sentiment: 58,
          products: 15,
          lastUpdated: '2023-05-14',
        },
        {
          id: 4,
          name: 'Competitor D',
          marketShare: 20,
          price: 45.99,
          priceChange: -5.0,
          sentiment: 81,
          products: 22,
          lastUpdated: '2023-05-15',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter competitors based on active filter
  const filteredCompetitors = React.useMemo(() => {
    if (activeFilter === 'price') {
      // Show only competitors with non-zero price change
      return competitors.filter(c => c.priceChange !== 0);
    }
    if (activeFilter === 'sentiment') {
      // Could filter or sort by sentiment — here just returning all for simplicity
      return competitors;
    }
    // Default: all competitors
    return competitors;
  }, [activeFilter, competitors]);

  const priceHistoryData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Competitor A',
        data: [55, 52, 53, 50, 49.99],
        borderColor: '#4a6fa5',
        backgroundColor: 'rgba(74, 111, 165, 0.1)',
      },
      {
        label: 'Competitor B',
        data: [50, 52, 53, 55, 54.99],
        borderColor: '#6b8cae',
        backgroundColor: 'rgba(107, 140, 174, 0.1)',
      },
      {
        label: 'Competitor C',
        data: [60, 60, 60, 60, 59.99],
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
      },
      {
        label: 'Competitor D',
        data: [50, 48, 47, 46, 45.99],
        borderColor: '#88c999',
        backgroundColor: 'rgba(136, 201, 153, 0.1)',
      },
    ],
  };

  return (
    <>
      <PageContainer>
        <Section>
          <SectionTitle>Competitor Price Trends</SectionTitle>
          <Card>
            <ChartContainer>
              <CompetitorPriceChart data={priceHistoryData} />
            </ChartContainer>
          </Card>
        </Section>

        <Section>
          <SectionTitle>Competitor Analysis</SectionTitle>
          <FilterContainer>
            <FilterButton
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
            >
              All Competitors
            </FilterButton>
            <FilterButton
              active={activeFilter === 'price'}
              onClick={() => setActiveFilter('price')}
            >
              Price Changes
            </FilterButton>
            <FilterButton
              active={activeFilter === 'sentiment'}
              onClick={() => setActiveFilter('sentiment')}
            >
              Sentiment
            </FilterButton>
          </FilterContainer>
          <Card>
            {loading ? (
              <LoadingMessage>Loading competitor data...</LoadingMessage>
            ) : (
              <CompetitorTable data={filteredCompetitors || []} />
            )}
          </Card>
        </Section>
      </PageContainer>
    </>
  );
}

export default CompetitorAnalysis;
