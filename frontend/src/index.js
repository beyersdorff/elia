import React from 'react';
import ReactDOM from 'react-dom/client';

// import custom bootstrap
import './custom.scss';

// import 'styles/config';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
