import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await authService.getMe();
      if (res.data) {
        setCustomer(res.data);
      }
    } catch (err) {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.data.customer) {
      setCustomer(res.data.customer);
    } else {
      await checkAuth();
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    return res.data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setCustomer(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        customer,
        loading,
        isAuthenticated: !!customer,
        login,
        register,
        logout,
        refreshProfile: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
