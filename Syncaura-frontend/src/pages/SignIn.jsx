import { Loader, Eye, EyeOff, Mail, Lock } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { loginUser } from "../redux/features/authThunks";
import { validationRules } from "../constant/validationRules";
import { handleError, handleSuccess } from "../services/errorHandler";
import BASE_URL from "../config/routes";
import { setCredentials } from "../redux/slices/authSlice";
import { GITHUB_STATE_KEY } from "../hooks/useGithubCallback";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // ── Role-based redirect helper ───────────────────────────────────────────────
  const getRoleRedirect = (role) => {
    switch (role) {
      case "admin":
      case "Admin":
        return "/admin";
      case "co-admin":
      case "Co-Admin":
        return "/co-admin";
      default:
        return "/user-dashboard";
    }
  };

  // ── Google OAuth ─────────────────────────────────────────────────────────────
  const handleGoogleLogin = () => {
    try {
      window.location.href = `${BASE_URL}/api/auth/google`;
    } catch (error) {
      console.error("Google login initiation failed:", error);
      handleError("Failed to initiate Google Login. Please try again.");
    }
  };

  // ── GitHub OAuth ─────────────────────────────────────────────────────────────
  const handleGithubLogin = () => {
    try {
      const state = crypto.randomUUID();
      sessionStorage.setItem(GITHUB_STATE_KEY, state);
      window.location.href = `${BASE_URL}/api/auth/github`;
    } catch (error) {
      console.error("GitHub login initiation failed:", error);
      handleError("Failed to initiate GitHub Login. Please try again.");
    }
  };

  // ── Handle tokens/errors returned from OAuth redirects ───────────────────────
  useEffect(() => {
    const error = searchParams.get("error");
    const token = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const role = searchParams.get("role");
    const userName = searchParams.get("name");

    if (error) {
      handleError(decodeURIComponent(error));
      navigate("/sign-in", { replace: true });
    } else if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      dispatch(
        setCredentials({
          user: { name: userName || "User", role: role || "user" },
          token,
        })
      );

      handleSuccess(`Welcome Back ${userName || "User"}!!`);
      navigate(getRoleRedirect(role), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, dispatch, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();
      handleSuccess(`Welcome Back ${res?.user?.name || "User"}!!`);
      navigate(getRoleRedirect(res?.user?.role), { replace: true });
    } catch (err) {
      handleError(err || "Login failed");
    }
  };

  const onError = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    if (firstError?.message) {
      handleError(firstError.message);
    } else {
      handleError("Please fix the form errors before submitting");
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      {/* MAIN CONTAINER */}
      <div className="w-[95%] h-[90%] bg-white dark:bg-[#0F172A] rounded-3xl flex overflow-hidden relative">
        
        {/* LEFT SIDE ILLUSTRATION */}
        <div className="hidden md:flex w-[45%] bg-[#1E4D7B] relative items-center justify-center">
          {/* CURVE */}
          <div className="absolute right-0 top-0 w-[70%] h-full bg-white dark:bg-[#0F172A] rounded-l-[100px]"></div>
          {/* IMAGE */}
          <img
            src="/images/Auth/loginHuman.png"
            alt="login"
            className="w-[420px] lg:w-[500px] z-10 scale-x-[-1]"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm space-y-5"
          >
            <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Sign in to your Syncaura account
            </p>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="space-y-4"
            >
              {/* EMAIL */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", validationRules.email)}
                     className={`w-full border pl-10 pr-4 py-3 rounded-none bg-[#f0f4fb] dark:bg-[#1e1e1e] text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    // className={`w-full border pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#1e2132] text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.email
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    {...register("password", validationRules.password)}
                    className={`w-full border pl-10 pr-10 py-3 rounded-none bg-[#f0f4fb] dark:bg-[#1e1e1e] text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                    // className={`w-full border pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#1e2132] text-gray-700 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    // className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 btn-hover"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer font-semibold disabled:opacity-60 disabled:cursor-not-allowed btn-hover"
              >
                {isSubmitting || isLoading ? (
                  <>
                    <Loader className="size-4 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* SOCIAL LOGIN */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="text-xs text-gray-400">Or continue with</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="flex justify-center gap-4">
              <button
                id="google-login-btn"
                type="button"
                onClick={handleGoogleLogin}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 cursor-pointer btn-hover"
              >
                <FcGoogle size={18} />
                <span>Google</span>
              </button>

              <button
                id="github-login-btn"
                type="button"
                onClick={handleGithubLogin}
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 cursor-pointer btn-hover"
              >
                <FaGithub size={18} />
                <span>GitHub</span>
              </button>

              <button
                type="button"
                className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 cursor-pointer btn-hover"
              >
                <FaFacebook size={18} className="text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link to="/sign-up" className="text-blue-500 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default SignIn;