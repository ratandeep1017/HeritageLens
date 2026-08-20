import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HeritageDataStore } from './services/heritageDataStore';

// Eagerly sync global dataset on application load
HeritageDataStore.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
