import React from 'react';
import App from './App'
import ReactDOM from 'react-dom/client';
import './index.css';
import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App/>
);