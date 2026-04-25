import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface RoleRouteProps {
  allowedRole: 'owner' | 'vet';
}

export function RoleRoute({ allowedRole }: RoleRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    // Si no tiene el rol correcto, redirigimos a su dashboard correspondiente
    if (user?.role === 'vet') {
      return <Navigate to="/vet/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}
