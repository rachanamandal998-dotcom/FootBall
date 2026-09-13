import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ManagerLogin from "../pages/ManagerLogin.jsx";

function AuthSplash({ label = "Checking manager session..." }) {
  return (
    <div className="min-h-screen bg-pitch flex items-center justify-center px-6">
      <div className="text-center text-ivory">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-gold/30 border-t-gold animate-spin" />
        <p className="font-semibold">{label}</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading, expired } = useAuth();
  if (loading) return <AuthSplash />;
  if (!user) return <ManagerLogin expired={expired} />;
  return <Outlet />;
}

export default ProtectedRoute;
