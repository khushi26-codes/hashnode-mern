import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="page-status">Checking your session…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}
