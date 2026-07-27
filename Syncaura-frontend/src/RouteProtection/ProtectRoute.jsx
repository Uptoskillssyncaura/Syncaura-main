import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { Loader } from "lucide-react";

const ProtectRoute = ({ allowedRoles, publicOnly = false }) => {

  const { user, isAuthenticated, authChecking } = useSelector((state) => state.auth);

  // Still determining auth state — show spinner to prevent flicker
  if (authChecking) {
    return (
      <div className="w-full h-screen bg-white dark:bg-black flex items-center justify-center">
        <Loader className="size-8 text-blue-600 dark:text-[#73FBFD] animate-spin" />
      </div>
    );
  }

  const getRoleHome = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "co-admin") return "/co-admin";
    return "/user-dashboard";
  };

  // Public-only routes (sign-in, sign-up, home):
  // Redirect as soon as isAuthenticated=true — don't wait for user profile
  if (publicOnly && isAuthenticated) {
    return <Navigate to={getRoleHome()} replace />;
  }

  // Protected routes: redirect unauthenticated users to sign-in
  if (!publicOnly && !isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Role-based guard: redirect if user doesn't have the required role
  if (!publicOnly && allowedRoles && user && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHome()} replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;