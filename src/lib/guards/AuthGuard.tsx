import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { isTokenValid } from '../utils/jwt';

type AuthGuardProps = {
  requiredRoles?: string[];
};

export function AuthGuard({ requiredRoles }: AuthGuardProps) {
  const location = useLocation();
  const { accessToken, isAuthenticated, isVerifying, setVerifying, user } = useAuthStore((s) => ({
    accessToken: s.accessToken,
    isAuthenticated: s.isAuthenticated,
    isVerifying: s.isVerifying,
    setVerifying: s.setVerifying,
    user: s.user,
  }));

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verify() {
      setVerifying(true);
      setLocalLoading(true);

      try {
        if (accessToken && isTokenValid(accessToken)) {
          if (mounted) {
            setVerifying(false);
            setLocalLoading(false);
          }
          return;
        }
      } catch (err) {
        console.error('[AuthGuard] Token check error:', err);
      } finally {
        if (mounted) {
          setVerifying(false);
          setLocalLoading(false);
        }
      }
    }

    verify();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⏳ Show loader during verification
  if (isVerifying || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // 🚫 Avoid redirect loop on /login
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  // 🔐 Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 🎫 Optional role-based check
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = user?.roles?.some((r) => requiredRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/403" replace />;
    }
  }

  // ✅ Authorized: render child routes
  return <Outlet />;
}
