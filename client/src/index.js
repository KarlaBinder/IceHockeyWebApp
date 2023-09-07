import React from 'react';
import App from './App'
import ReactDOM from 'react-dom/client';
import './index.css';
//import axios from 'axios';

// Use 'authToken' to get the token from local storage
//axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('authToken')}`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);