import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDark = useSelector((state) => state.theme.isDark);

  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");
    const userName = searchParams.get("name");

    if (error) {
      toast.error(decodeURIComponent(error) || "Google authentication failed");
      navigate("/sign-in", { replace: true });
      return;
    }

    if (token) {
      try {
        // Save tokens to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("accessToken", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Update auth state in Redux
        dispatch(
          setCredentials({
            user: { name: userName || "User", role: role || "user" },
            token,
          })
        );

        toast.success(`Welcome Back ${userName || "User"}!!`);

        // Route to the appropriate dashboard based on user role
        switch (role) {
          case "Admin":
            navigate("/admin", { replace: true });
            break;
          case "Co-Admin":
            navigate("/co-admin", { replace: true });
            break;
          default:
            navigate("/user-dashboard", { replace: true });
        }
      } catch (err) {
        console.error("Error setting OAuth credentials:", err);
        toast.error("Failed to parse login credentials. Please try again.");
        navigate("/sign-in", { replace: true });
      }
    } else {
      // If landed on callback page without token or error, redirect to sign-in
      const timeout = setTimeout(() => {
        toast.error("OAuth session expired or invalid. Please login again.");
        navigate("/sign-in", { replace: true });
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="w-full h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-black dark:to-slate-900 flex items-center justify-center transition-colors duration-500"
    >
      <div className="relative p-10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col items-center max-w-sm w-[90%] text-center">
        {/* Decorative background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/20 dark:bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/20 dark:bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Spinner */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin"></div>
          <Loader className="w-8 h-8 text-blue-600 dark:text-[#73FBFD] animate-pulse duration-1000" />
        </div>

        {/* Text Details */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
          Securing Connection
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Authenticating with Google Services. Please do not close or refresh this window.
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
