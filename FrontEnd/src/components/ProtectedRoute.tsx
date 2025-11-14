import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const userStr = localStorage.getItem('user');
  const userRole = localStorage.getItem('userRole');
  
  // If no user, redirect to login
  if (!userStr) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // If role is required, check it
  if (requiredRole) {
    if (userRole !== requiredRole) {
      // Redirect based on user's actual role
      if (userRole === 'ADMIN') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }
  
  return <>{children}</>;
};


