import React from 'react';
import ReactDOM from 'react-dom/client';

// Separate entry imports keep each concept's global visual system isolated.
const { default: App } = await (location.pathname.startsWith('/revenue-os')
  ? import('./RevenueApp')
  : import('./App'));

const root = document.getElementById('root');
if (!root) throw new Error('Root element is missing');
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
