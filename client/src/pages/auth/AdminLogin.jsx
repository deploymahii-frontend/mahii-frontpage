import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {
  return <Navigate to="/secure-admin-portal" replace />;
};

export default AdminLogin;
