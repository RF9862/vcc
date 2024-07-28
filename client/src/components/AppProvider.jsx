import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { APP_API } from "../config";
import axios from "../config/axios";
import LoadingSpinner from "./LoadingSpinner";

const AppContext = createContext();

const useAuth = () => {
  const { user, isAuthenticated, login, logout } = useContext(AppContext);
  return { user, isAuthenticated, login, logout };
};

const useLoading = () => {
  const { loading, setLoading } = useContext(AppContext);
  return { loading, setLoading };
};

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);

      const decodedToken = jwtDecode(token);
      setUser({
        email: decodedToken.email,
        balance: decodedToken.balance,
        privilege: decodedToken.privilege,
        id: decodedToken.id,
      });
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${APP_API}/auth/signin`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      const decodedToken = jwtDecode(res.data.token);
      setUser({
        email: decodedToken.email,
        balance: decodedToken.balance,
        privilege: decodedToken.privilege,
        id: decodedToken.id,
      });

      setIsAuthenticated(true);

      toast.success("Logged in successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.response.data.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Logged out failed!");
    }
  };

  return (
    <AppContext.Provider
      value={{ user, isAuthenticated, loading, setLoading, login, logout }}
    >
      {children}
      {loading && <LoadingSpinner />}
    </AppContext.Provider>
  );
}

export { useAuth, useLoading };
