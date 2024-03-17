import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../../utils/contexts/authContext';

function ProtectedRoute({ children }) {
  const { userLoggedIn } = useAuth();

  if (!userLoggedIn) {
    return <Navigate to="/login" replace />; // Redirect to login if not logged in
  }

  return children; // Render the original component if logged in
}

export default ProtectedRoute;
