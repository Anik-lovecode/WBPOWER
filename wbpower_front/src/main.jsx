import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  
import 'bootstrap/dist/css/bootstrap.min.css' 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from './App.jsx'
import { Provider } from "react-redux";
import store from "./redux/store";
import '@fortawesome/fontawesome-free/css/all.min.css';


createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)