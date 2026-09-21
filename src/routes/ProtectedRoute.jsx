import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

const ADMIN_EMAIL = "sahra0sales@gmail.com";

function ProtectedRoute() {
  const { user, isAuthenticated, authLoading } = useAuth();

  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        جارٍ التحقق من الجلسة...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }

  // السماح لحساب مدير سهرة فقط
  if (user?.email?.toLowerCase() !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
