import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

      <App />
      <Toaster position="top-right" reverseOrder={false} toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '8px',
        },
      }} />
  </React.StrictMode>,
);