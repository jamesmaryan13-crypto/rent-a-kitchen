import React from 'react';
import { createRoot } from 'react-dom/client';
import { RAKApp } from './app/main';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RAKApp />
  </React.StrictMode>
);
