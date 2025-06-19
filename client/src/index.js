import React from 'react';
import ReactDOM from 'react-dom/client';  // <-- changed import here
import App from './App';
import './styles/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));  // create root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
