import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Button, Select, Input, Label } from '../components/Common';
import SimulationChart from '../components/SimulationChart';

const SimulationContainer = styled.div`
  padding: 20px;
`;

const SimulationForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormSection = styled(Card)`
  padding: 20px;
`;

const FormTitle = styled.h3`
  margin-bottom: 15px;
  color: ${({ theme }) => theme.primary};
`;

const ResultsContainer = styled(Card)`
  padding: 20px;
  margin-top: 20px;
`;

function Simulation() {
  const [scenario, setScenario] = useState('price-war');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    basePrice: 100,
    competitors: [
      { name: 'Competitor A', currentPrice: 95, aggression: 0.7 },
      { name: 'Competitor B', currentPrice: 105, aggression: 0.4 },
    ],
    duration: 4,
    strategy: 'moderate',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    if (name === 'basePrice' || name === 'duration') {
      val = Number(value);
      if (isNaN(val) || val <= 0) return; // prevent invalid input
      if (name === 'duration' && val > 12) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleCompetitorChange = (index, field, value) => {
    const updatedCompetitors = [...formData.competitors];
    let val = value;

    if (field === 'currentPrice' || field === 'aggression') {
      val = Number(value);
      if (isNaN(val)) return;
      if (field === 'aggression') {
        if (val < 0) val = 0;
        else if (val > 1) val = 1;
      }
      if (field === 'currentPrice' && val < 0.01) val = 0.01;
    }

    updatedCompetitors[index][field] = val;
    setFormData((prev) => ({ ...prev, competitors: updatedCompetitors }));
  };

  const addCompetitor = () => {
    setFormData((prev) => ({
      ...prev,
      competitors: [
        ...prev.competitors,
        { name: `Competitor ${prev.competitors.length + 1}`, currentPrice: 100, aggression: 0.5 },
      ],
    }));
  };

  const removeCompetitor = (index) => {
    if (formData.competitors.length <= 1) return; // Prevent removing last competitor
    setFormData((prev) => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index),
    }));
  };

  const runSimulation = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      setTimeout(() => {
        const mockResults = {
          scenario,
          weeks: Array.from({ length: formData.duration }, (_, i) => ({
            week: i + 1,
            yourPrice: +(formData.basePrice * (1 - 0.1 * (i + 1))).toFixed(2),
            competitors: formData.competitors.map((c) => ({
              name: c.name,
              price: +(c.currentPrice * (1 - 0.08 * (i + 1))).toFixed(2),
            })),
            marketShare: +(30 + i * 5).toFixed(1),
            profit: 10000 - i * 1000,
          })),
          summary: {
            finalMarketShare: +(30 + formData.duration * 5).toFixed(1),
            totalProfit: 10000 - formData.duration * 1000,
            priceReduction: +(formData.duration * 10).toFixed(1),
          },
        };
        setResults(mockResults);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Simulation error:', error);
      setLoading(false);
    }
  };

  return (
    <SimulationContainer>
      <h1>Market Simulations</h1>

      <SimulationForm>
        <FormSection>
          <FormTitle>Scenario Setup</FormTitle>
          <Label>
            Scenario Type
            <Select value={scenario} onChange={(e) => setScenario(e.target.value)}>
              <option value="price-war">Price War</option>
              <option value="new-product">New Product Launch</option>
              <option value="promotion">Promotion Impact</option>
            </Select>
          </Label>

          <Label>
            Base Price ($)
            <Input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleInputChange}
              min="1"
              step="0.01"
            />
          </Label>

          <Label>
            Duration (weeks)
            <Input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="12"
            />
          </Label>

          <Label>
            Strategy
            <Select name="strategy" value={formData.strategy} onChange={handleInputChange}>
              <option value="aggressive">Aggressive</option>
              <option value="moderate">Moderate</option>
              <option value="defensive">Defensive</option>
            </Select>
          </Label>
        </FormSection>

        <FormSection>
          <FormTitle>Competitors</FormTitle>
          {formData.competitors.map((competitor, index) => (
            <div
              key={index}
              style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee' }}
            >
              <Label>
                Competitor Name
                <Input
                  type="text"
                  value={competitor.name}
                  onChange={(e) => handleCompetitorChange(index, 'name', e.target.value)}
                />
              </Label>

              <Label>
                Current Price ($)
                <Input
                  type="number"
                  value={competitor.currentPrice}
                  onChange={(e) => handleCompetitorChange(index, 'currentPrice', e.target.value)}
                  min="0.01"
                  step="0.01"
                />
              </Label>

              <Label>
                Aggression (0-1)
                <Input
                  type="number"
                  value={competitor.aggression}
                  onChange={(e) => handleCompetitorChange(index, 'aggression', e.target.value)}
                  min="0"
                  max="1"
                  step="0.1"
                />
              </Label>

              <Button
                small
                danger
                onClick={() => removeCompetitor(index)}
                style={{ marginTop: '5px' }}
                disabled={formData.competitors.length <= 1}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button onClick={addCompetitor}>Add Competitor</Button>
        </FormSection>
      </SimulationForm>

      <Button primary onClick={runSimulation} disabled={loading}>
        {loading ? 'Running Simulation...' : 'Run Simulation'}
      </Button>

      {results && (
        <ResultsContainer>
          <h2>Simulation Results</h2>
          <SimulationChart data={results} />

          <div style={{ marginTop: '20px' }}>
            <h3>Summary</h3>
            <p>Final Market Share: {results.summary.finalMarketShare.toFixed(1)}%</p>
            <p>Total Profit: ${results.summary.totalProfit.toLocaleString()}</p>
            <p>Price Reduction: {results.summary.priceReduction.toFixed(1)}%</p>
          </div>
        </ResultsContainer>
      )}
    </SimulationContainer>
  );
}

export default Simulation;
