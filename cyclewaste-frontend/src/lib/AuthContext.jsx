import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import api, { session } from "./api.js";

const AuthContext = createContext(null);

export function homeForRole(role) {
  if (role === "teknisi" || role === "recycler" || role === "admin") return "/mitra";
  return "/dashboard";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => session.getUser());

  const login = useCallback(async (email, password) => {
    const data = await api.auth.login(email, password);
    session.setSession(data);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await api.auth.register(payload);
    session.setSession(data);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.auth.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout,
    }),
    [user, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
