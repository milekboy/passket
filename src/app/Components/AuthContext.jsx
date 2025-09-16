// components/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import LoadingTicket from "./LoadingTicket";

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("user");
      const tok = localStorage.getItem("token");
      if (raw) setUser(JSON.parse(raw));
      if (tok) setToken(tok);
    }
    setLoading(false);
  }, []);

  // ── 2) Sync back to localStorage whenever they change ──
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  const login = ({ user: u, token: t }) => {
    setUser(u);
    setToken(t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };
  if (loading) return <LoadingTicket />;
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
