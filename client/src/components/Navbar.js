import React from 'react';
import styled from 'styled-components';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';

const NavbarContainer = styled.div`
  background: ${({ theme }) => theme.primary};
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavTitle = styled.h1`
  font-size: 1.5rem;
  margin: 0;
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

function Navbar({ toggleTheme, theme, sidebarOpen, setSidebarOpen }) {
  return (
    <NavbarContainer>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <IconButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FiMenu />
        </IconButton>
        <NavTitle>Market Intelligence Platform</NavTitle>
      </div>
      <NavActions>
        <IconButton onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </IconButton>
      </NavActions>
    </NavbarContainer>
  );
}

export default Navbar;
