import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: all 0.25s linear;
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 20px;
    margin-left: ${({ sidebarOpen }) => sidebarOpen ? '250px' : '0'};
    transition: margin-left 0.3s ease;
  }

  @media (max-width: 768px) {
    .main-content {
      margin-left: 0;
    }
  }
`;