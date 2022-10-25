/* istanbul ignore file */
import React from 'react';
import ReactDOM from 'react-dom';

import {BrowserRouter as Router} from 'react-router-dom';
import {LicenseManager} from 'ag-grid-enterprise';
import * as Sentry from '@sentry/react';
import {Integrations} from '@sentry/tracing';

import App from './App';
import reportWebVitals from './reportWebVitals';
import InitializeState from '@utils/InitializeState';

import 'react-toastify/dist/ReactToastify.min.css';
import 'tippy.js/dist/tippy.css';
import './index.css';

const AG_GRID_LICENSE = `${process.env.REACT_APP_AG_GRID_LICENSE1}${process.env.REACT_APP_AG_GRID_LICENSE2}`;
// License is too long for one var
LicenseManager.setLicenseKey(AG_GRID_LICENSE);

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

//Initialize all react-ridge-state instances that use local storage.
InitializeState();
