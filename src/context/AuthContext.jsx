import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, loginRequest, logoutRequest } from "../api/auth.js";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      try {
        const data = await fetchMe();
        if (!cancelled) {
          setUser(data.user || null);
          setExpired(false);
        }
      } catch (err) {
        if (!cancelled) {
          setUser(null);
          if (String(err.message || "").toLowerCase().includes("expired")) setExpired(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    setUser(data?.user || null);
    setExpired(false);
    return data;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      expired,
      isAuthenticated: Boolean(user),
      isStaff: Boolean(user),
      login,
      logout,
    }),
    [user, loading, expired],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
