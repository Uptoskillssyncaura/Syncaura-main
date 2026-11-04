import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCredentials } from "../redux/slices/authSlice";
import { fetchUserProfile } from "../redux/features/authThunks";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("Authenticating with Google Services...");
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const processAuth = async () => {
      const error = searchParams.get("error");
      const code = searchParams.get("code");
      // Backwards compatibility if token was provided directly
      const directToken = searchParams.get("token") || searchParams.get("accessToken");

      if (error) {
        toast.error(decodeURIComponent(error) || "Google authentication failed");
        navigate("/signin", { replace: true });
        return;
      }

      const apiBase =
        import.meta.env.VITE_API_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:5000"
          : "https://syncaura-main.onrender.com");

      try {
        let accessToken = null;
        let refreshToken = null;
        let authUser = null;

        // Secure Path: Exchange short-lived one-time code for tokens via POST request
        // (Tokens are never exposed in URL query parameters)
        if (code) {
          const sessionKey = `flowbit_oauth_exchanging_${code}`;
          if (sessionStorage.getItem(sessionKey)) {
            console.warn("[AuthCallback] Code exchange already in progress for this code.");
            return;
          }
          sessionStorage.setItem(sessionKey, "processing");

          setStatusMessage("Exchanging secure authorization code...");
          const res = await axios.post(
            `${apiBase}/api/auth/google/exchange`,
            { code },
            { withCredentials: true }
          );

          sessionStorage.setItem(sessionKey, "done");

          accessToken = res.data.accessToken;
          refreshToken = res.data.refreshToken;
          authUser = res.data.user;
        } else if (directToken) {
          // Fallback legacy support
          accessToken = directToken;
          refreshToken = searchParams.get("refreshToken");
          const role = searchParams.get("role");
          const userName = searchParams.get("name");
          const userId = searchParams.get("userId");
          const email = searchParams.get("email");

          authUser = {
            id: userId || undefined,
            name: userName || "User",
            email: email || undefined,
            role: (role || "user").toLowerCase(),
          };
        } else {
          toast.error("OAuth session expired or invalid. Please login again.");
          navigate("/signin", { replace: true });
          return;
        }

        if (!accessToken) {
          throw new Error("No access token received from authentication exchange");
        }

        // Store tokens securely
        localStorage.setItem("token", accessToken);
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }

        // Set Redux credentials
        dispatch(
          setCredentials({
            user: {
              id: authUser?.id,
              name: authUser?.name || "User",
              email: authUser?.email,
              role: (authUser?.role || "user").toLowerCase(),
              profilePic: authUser?.profilePic,
            },
            token: accessToken,
          })
        );

        // Fetch complete user profile
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (profileErr) {
          console.warn("[AuthCallback] fetchUserProfile non-fatal warning:", profileErr);
        }

        toast.success(`Welcome Back, ${authUser?.name || "User"}!`);

        // Route to the appropriate role-based dashboard
        const normalizedRole = (authUser?.role || "user").toLowerCase();
        if (normalizedRole === "admin") {
          navigate("/admin", { replace: true });
        } else if (normalizedRole === "co-admin") {
          navigate("/co-admin", { replace: true });
        } else {
          navigate("/user-dashboard", { replace: true });
        }
      } catch (err) {
        if (code) {
          sessionStorage.removeItem(`flowbit_oauth_exchanging_${code}`);
        }
        console.error("[AuthCallback] Exchange error:", err);
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to complete Google authentication. Please try again.";
        toast.error(errMsg);
        navigate("/signin", { replace: true });
      }
    };

    processAuth();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
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

        {/* Status */}
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
          Securing Connection
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {statusMessage}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
