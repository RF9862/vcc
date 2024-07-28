import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "./AppProvider"; // Path to your AuthProvider

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user.privilege === "admin" ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export { ProtectedRoute, AdminRoute };
