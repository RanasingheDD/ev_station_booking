import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
