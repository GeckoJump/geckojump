import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import constants from './constants';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleReCaptchaProvider 
      reCaptchaKey={constants.RECAPTCHA_KEY}
      useEnterprise={true}
    >
      <App />
    </GoogleReCaptchaProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
