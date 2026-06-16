import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface Props {
  permission: string;
  children: React.ReactNode;
}

export default function PermissionGate({ permission, children }: Props) {
  const { hasPermission } = useAdminAuth();
  if (!hasPermission(permission)) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
}
