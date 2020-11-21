import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import {RecoilRoot} from "recoil"
import { Provider as BumbagProvider } from 'bumbag';
ReactDOM.render(
  <React.StrictMode>
    <BumbagProvider>
    <RecoilRoot>
    <Router>
      <Auth0Provider

        domain={"dev-i9frcztn.us.auth0.com"}
        clientId={"ruBZqVK79KjTv0pIENKInJpIAm55S0AB"}
        redirectUri={window.location.origin}
      >
        <App />
      </Auth0Provider>
    </Router>
    </RecoilRoot>
    </BumbagProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
