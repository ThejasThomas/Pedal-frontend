import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const AdminAuthRoute = () => {
  const admin = useSelector((state) => state.admin.admin);
  const location = useLocation();

  if (admin) {
    return <Navigate to="/admin/dashboard" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const AdminProtectedRoute = () => {
  const admin = useSelector((state) => state.admin.admin);
  const location = useLocation();

  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};