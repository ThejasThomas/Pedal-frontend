import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

// This component is for login/signup pages - redirects to dashboard if already logged in
export const AuthRoute = () => {
  const { users, isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) {
    return <Navigate to="/user/store" replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = () => {
  const { users, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated || !users) {
    return <Navigate to="/user/login" replace />;
  }

  return <Outlet />;
};
