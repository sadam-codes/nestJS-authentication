// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) return <Navigate to="/auth" />;

  if (role && user.role !== role) {
    return <Navigate to="/home" />; 
  }

  return children;
};

export default ProtectedRoute;
