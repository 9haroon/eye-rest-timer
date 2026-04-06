import React from 'react';
import ReactDOM from 'react-dom'; // Import ReactDOM for React 16
import App from './App';
import './index.css'; // Import the CSS file

// For React 16, use ReactDOM.render
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Assuming 'root' div exists in public/index.html
);
