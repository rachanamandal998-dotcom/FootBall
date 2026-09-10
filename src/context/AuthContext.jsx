import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearToken,
  fetchMe,
  getStoredToken,
  loginRequest,
  logoutRequest,
  signupRequest,
  storeToken,
} from "../api/auth.js";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const token = getStoredToken();
      if (!token) {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await fetchMe();
        if (!cancelled) setUser(data.user || null);
      } catch {
        clearToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  const applyAuth = (data) => {
    if (data?.token) storeToken(data.token);
    setUser(data?.user || null);
    return data;
  };

  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    return applyAuth(data);
  };

  const signup = async ({ name, email, password }) => {
    const data = await signupRequest({ name, email, password });
    return applyAuth(data);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearToken();
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
