import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/global';
import styled from 'styled-components';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Dashboard from './pages/Dashboard';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import MarketForecasting from './pages/MarketForecasting';
import Simulation from './pages/Simulation';
import Settings from './pages/Settings';

const AppContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${({ $sidebarOpen }) => ($sidebarOpen ? '250px' : '0')};
  transition: margin-left 0.3s ease;
  padding: 70px 20px 20px 20px;
`;

function App() {
  const [theme, setTheme] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyles />
      <Router>
        <AppContainer>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div style={{ flex: 1 }}>
            <Navbar
              toggleTheme={toggleTheme}
              theme={theme}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
            <MainContent $sidebarOpen={sidebarOpen}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/competitors" element={<CompetitorAnalysis />} />
                <Route path="/forecasting" element={<MarketForecasting />} />
                <Route path="/simulation" element={<Simulation />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainContent>
          </div>
        </AppContainer>
      </Router>
    </ThemeProvider>
  );
}

export default App;
