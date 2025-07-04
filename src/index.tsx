import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar
      closeOnClick
      aria-label="Notifications"
    />
  </React.StrictMode>
);

// Measure performance and send to analytics endpoint
reportWebVitals(console.log); // Replace with actual analytics endpoint if needed