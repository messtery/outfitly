import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminGuestLayout() {
  const { token } = useAdminAuth();

  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
