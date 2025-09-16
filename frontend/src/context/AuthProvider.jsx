import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  const updateContributions = (change) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      contributions: Math.max((user.contributions || 0) + change, 0),
    };
    const token = localStorage.getItem("token");
    login(token, updatedUser);
  };

  // ✅ Fetch user data on page refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoadingAuth(true);
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
        .finally(() => setLoadingAuth(false));
    } else {
      setLoadingAuth(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loadingAuth, updateContributions }}
    >
      {children}
    </AuthContext.Provider>
  );
};
