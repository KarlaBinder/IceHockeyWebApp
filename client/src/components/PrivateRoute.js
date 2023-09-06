// PrivateRoute.js
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }) => {
    const navigate = useNavigate();
  
    if (!isAuthenticated) {
      navigate('/login');
      return null; // You can return a loading spinner or message here
    }
  
    return <Route {...rest} element={<Component />} />;
  };
  

export default PrivateRoute;

