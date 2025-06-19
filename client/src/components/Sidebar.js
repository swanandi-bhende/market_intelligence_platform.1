import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiDollarSign,
  FiSettings
} from 'react-icons/fi';

// Transient prop $sidebarOpen prevents React DOM warnings
const SidebarContainer = styled.div`
  background: ${({ theme }) => theme.sidebarBg};
  color: ${({ theme }) => theme.sidebarText};
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: ${({ $sidebarOpen }) => ($sidebarOpen ? '0' : '-250px')};
  transition: left 0.3s ease;
  z-index: 100;
  padding-top: 70px;
`;

const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  padding: 0.75rem 1.5rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const MenuLink = styled(Link)`
  color: ${({ theme }) => theme.sidebarText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false); // Close sidebar on route change
  }, [location.pathname, setSidebarOpen]);

  return (
    // Pass $sidebarOpen instead of sidebarOpen here!
    <SidebarContainer $sidebarOpen={sidebarOpen}>
      <SidebarMenu>
        <MenuItem>
          <MenuLink to="/">
            <FiHome /> Dashboard
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/competitors">
            <FiDollarSign /> Competitor Analysis
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/forecasting">
            <FiTrendingUp /> Market Forecasting
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/simulation">
            <FiBarChart2 /> Simulation
          </MenuLink>
        </MenuItem>
        <MenuItem>
          <MenuLink to="/settings">
            <FiSettings /> Settings
          </MenuLink>
        </MenuItem>
      </SidebarMenu>
    </SidebarContainer>
  );
}

export default Sidebar;
