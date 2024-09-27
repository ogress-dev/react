import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ReviewsProvider } from './context/ReviewsContext';
import './index.css'; // Import Tailwind CSS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReviewsProvider>
      <App />
    </ReviewsProvider>
  </React.StrictMode>
);
