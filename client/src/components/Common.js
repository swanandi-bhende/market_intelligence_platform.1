import styled from 'styled-components';

// Card component
export const Card = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.cardShadow};
  padding: ${({ padding }) => padding || '20px'};
  margin-bottom: ${({ marginBottom }) => marginBottom || '0'};
  transition: all 0.3s ease;
`;

// Button component
export const Button = styled.button`
  background-color: ${({ primary, danger, theme }) =>
    primary ? theme.primary :
    danger ? theme.danger :
    theme.cardBg};
  color: ${({ primary, danger }) => (primary || danger) ? 'white' : 'inherit'};
  border: 1px solid ${({ primary, danger, theme }) =>
    primary ? theme.primary :
    danger ? theme.danger :
    '#ccc'};
  padding: ${({ small }) => small ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border-radius: 4px;
  cursor: pointer;
  font-size: ${({ small }) => small ? '0.8rem' : '1rem'};
  transition: all 0.2s;

  &:hover {
    background-color: ${({ primary, danger, theme }) =>
      primary ? theme.secondary :
      danger ? '#c82333' :
      '#f0f0f0'};
    border-color: ${({ primary, danger, theme }) =>
      primary ? theme.secondary :
      danger ? '#bd2130' :
      '#adadad'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Input component
export const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 0.25rem;
  transition: border 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.25);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Select component
export const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-top: 0.25rem;
  background-color: white;
  transition: border 0.3s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.25);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

// Label component
export const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-weight: 500;
`;

// Table component
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: ${({ theme }) => theme.primary};
    color: white;
    font-weight: 500;
  }

  tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.02);
  }

  tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

// Chart container
export const ChartContainer = styled.div`
  position: relative;
  height: 400px;
  width: 100%;
  margin: 1rem 0;
`;

// Alert component
export const Alert = styled.div`
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: ${({ type, theme }) =>
    type === 'success' ? '#d4edda' :
    type === 'danger' ? '#f8d7da' :
    type === 'warning' ? '#fff3cd' :
    '#d1ecf1'};
  color: ${({ type, theme }) =>
    type === 'success' ? '#155724' :
    type === 'danger' ? '#721c24' :
    type === 'warning' ? '#856404' :
    '#0c5460'};
  border-color: ${({ type, theme }) =>
    type === 'success' ? '#c3e6cb' :
    type === 'danger' ? '#f5c6cb' :
    type === 'warning' ? '#ffeeba' :
    '#bee5eb'};
`;
