import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import App from "./App";
import "./index.css";
import "./i18n";

const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('razorpay.com')) {
    return; // Razorpay che preloading warnings ignore hotil
  }
  originalWarn(...args);
};


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >

      <BrowserRouter>
        <App />
      </BrowserRouter>

    </GoogleOAuthProvider>

  </React.StrictMode>
);

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
