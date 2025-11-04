import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { isTokenValid } from '../utils/jwt';

type AuthGuardProps = {
  requiredRoles?: string[];
};

export function AuthGuard({ requiredRoles }: AuthGuardProps) {
  const location = useLocation();
  const {
    accessToken,
    isAuthenticated,
    isVerifying,
    setVerifying,
    setAuth,
    clearAuth,
    user,
    restoreAuth,
  } = useAuthStore();

  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      // chỉ verify 1 lần khi guard mount
      setVerifying(true);
      setLocalLoading(true);

      try {
        if (accessToken && isTokenValid(accessToken)) {
          // Nếu token hợp lệ → set authenticated
          if (!isAuthenticated) {
            // ⚡ tránh re-render loop nếu state đã đúng
            const existingUser = user ?? null;
            setAuth(accessToken, existingUser);
          }
        } else {
          // Token không hợp lệ → clear
          if (isAuthenticated) clearAuth();
        }
      } catch (err) {
        console.error('[AuthGuard] Token verification failed:', err);
        clearAuth();
      } finally {
        if (mounted) {
          setVerifying(false);
          setLocalLoading(false);
        }
      }
    };

    verify();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ chỉ chạy 1 lần khi mount, không phụ thuộc vào state

  // ⏳ Hiển thị loader khi đang verify
  if (isVerifying || localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  // 🔐 Nếu chưa login → chuyển đến /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 🎫 Kiểm tra quyền (nếu có)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = user?.roles?.some((r) => requiredRoles.includes(r));
    if (!hasRole) {
      return <Navigate to="/403" replace />;
    }
  }

  // ✅ Đã xác thực → render children
  return <Outlet />;
}
