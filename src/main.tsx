import React from 'react';
import ReactDOM from 'react-dom/client';

// Only the two current pages have a React entry; every other path shows 404.
const path = location.pathname.replace(/\/+$/, '') || '/';

let load: (() => Promise<{ default: React.ComponentType }>) | undefined;
if (path === '/agency') load = () => import('./AgencyApp');
else if (path === '/neurorop') load = () => import('./NeuroApp');

const root = document.getElementById('root');

if (!load || !root) {
  document.body.innerHTML =
    '<main><h1>404</h1><p>Страница не найдена.</p><a href="/agency/">Перейти на главную</a></main>';
} else {
  const { default: App } = await load();
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
