import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AuthSplash({ label = "Loading authentication..." }) {
  return (
    <div className="min-h-screen bg-[#0E3B2E] flex items-center justify-center px-6">
      <div className="text-center text-[#F5F2E8]">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-[#E4CD8A]/30 border-t-[#C7A344] animate-spin" />
        <p className="font-semibold">{label}</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthSplash />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthSplash />;
  if (user) return <Navigate to="/admin" replace />;
  return <Outlet />;
}

export default ProtectedRoute;
