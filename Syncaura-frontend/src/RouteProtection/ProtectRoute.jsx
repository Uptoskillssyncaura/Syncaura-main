import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ allowedRoles, publicOnly = false }) => {
  const { user, isAuthenticated, authChecking } = useSelector((state) => state.auth);

  // If auth is still checking and user is not yet loaded from cache, wait before redirecting
  if (authChecking && !user) {
    return null;
  }

  const getRoleHome = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "co-admin") return "/co-admin";
    return "/user-dashboard";
  };

  // Protected routes: redirect unauthenticated users to home
  if (!publicOnly && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Public-only routes: redirect authenticated users to their role home
  if (publicOnly && isAuthenticated && user) {
    return <Navigate to={getRoleHome()} replace />;
  }

  // Role-based guard: redirect if user is loaded and doesn't have the required role
  if (!publicOnly && allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome()} replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;

