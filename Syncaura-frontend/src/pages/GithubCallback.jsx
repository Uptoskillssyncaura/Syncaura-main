/**
 * GithubCallback.jsx
 *
 * GitHub OAuth callback page — rendered at /auth/github/callback.
 *
 * Three visual states:
 *  1. LOADING — animated GitHub icon + spinner + cycling status messages
 *  2. SUCCESS — green checkmark animation + "GitHub Connected Successfully"
 *  3. ERROR   — contextual error icon + readable message + Retry / Back to Login actions
 *
 * Dark mode: uses `data-theme` attribute matching the existing project pattern.
 * Animations: framer-motion (already in package.json).
 * Icons: lucide-react + react-icons/fa (both already installed).
 * Notifications: react-toastify (handled in the hook, not here).
 * All logic lives in useGithubCallback — this component is display-only.
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import {
  AlertCircle,
  WifiOff,
  ShieldX,
  Clock,
  Ban,
  ServerCrash,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import useGithubCallback, {
  CALLBACK_STATUS,
  CALLBACK_ERROR_TYPE,
} from "../hooks/useGithubCallback";

// ─── Loading Messages (cycled every 2.5 s) ───────────────────────────────────

const LOADING_MESSAGES = [
  "Checking authorization…",
  "Completing GitHub Login…",
  "Securing your account…",
  "Please wait…",
];

// ─── Error Config Map ─────────────────────────────────────────────────────────

const ERROR_CONFIG = {
  [CALLBACK_ERROR_TYPE.CANCELLED]: {
    Icon: Ban,
    title: "Authorization Cancelled",
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.MISSING_CODE]: {
    Icon: AlertCircle,
    title: "Authorization Code Missing",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800/40",
    showRetry: false,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.INVALID_STATE]: {
    Icon: ShieldX,
    title: "Security Validation Failed",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800/40",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.NETWORK]: {
    Icon: WifiOff,
    title: "Network Error",
    color: "text-slate-600 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-800/40",
    borderColor: "border-slate-200 dark:border-slate-700",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.BACKEND_UNAVAILABLE]: {
    Icon: ServerCrash,
    title: "Service Unavailable",
    color: "text-orange-500 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800/40",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.EXPIRED_CODE]: {
    Icon: Clock,
    title: "Authorization Expired",
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.INVALID_CODE]: {
    Icon: AlertCircle,
    title: "Invalid Authorization Code",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800/40",
    showRetry: true,
    showDashboard: false,
  },
  [CALLBACK_ERROR_TYPE.UNEXPECTED]: {
    Icon: AlertCircle,
    title: "Something Went Wrong",
    color: "text-red-500 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800/40",
    showRetry: true,
    showDashboard: false,
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Cycling loading message with a fade transition */
const CyclingMessage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={index}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.4 }}
        className="text-sm text-slate-500 dark:text-slate-400 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        {LOADING_MESSAGES[index]}
      </motion.p>
    </AnimatePresence>
  );
};

/** Loading state — GitHub icon + dual-ring spinner + cycling message */
const LoadingState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center gap-6"
    role="status"
    aria-label="Processing GitHub authentication"
  >
    {/* Icon + spinner */}
    <div className="relative flex items-center justify-center" aria-hidden="true">
      {/* Outer rotating ring */}
      <div className="absolute w-20 h-20 rounded-full border-4 border-t-slate-800 dark:border-t-[#73FBFD] border-r-transparent border-b-slate-300 dark:border-b-slate-600 border-l-transparent animate-spin" />
      {/* Inner pulsing ring */}
      <div className="absolute w-14 h-14 rounded-full border-2 border-t-slate-400 dark:border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      {/* GitHub icon */}
      <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-lg">
        <FaGithub className="w-6 h-6 text-white" />
      </div>
    </div>

    {/* Text */}
    <div className="space-y-2 text-center">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
        Connecting with GitHub
      </h2>
      <CyclingMessage />
    </div>

    {/* Do-not-close notice */}
    <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-xs">
      Do not close or refresh this window.
    </p>
  </motion.div>
);

/** Success state — animated checkmark + message */
const SuccessState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="flex flex-col items-center gap-6"
    role="status"
    aria-label="GitHub authentication successful"
  >
    {/* Animated checkmark */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
      className="relative"
      aria-hidden="true"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
        <CheckCircle2 className="w-11 h-11 text-emerald-500 dark:text-emerald-400" />
      </div>
      {/* Ripple rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-emerald-400 dark:border-emerald-500"
        initial={{ scale: 1, opacity: 0.8 }}
        animate={{ scale: 1.6, opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.div
        className="absolute inset-0 rounded-full border border-emerald-300 dark:border-emerald-600"
        initial={{ scale: 1, opacity: 0.6 }}
        animate={{ scale: 2.0, opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
      />
    </motion.div>

    {/* Text */}
    <div className="space-y-1.5 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="text-xl font-bold text-slate-800 dark:text-white tracking-tight"
      >
        GitHub Connected Successfully
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-emerald-600 dark:text-emerald-400 font-medium"
      >
        Account Verified
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="text-xs text-slate-400 dark:text-slate-500"
      >
        Redirecting you now…
      </motion.p>
    </div>
  </motion.div>
);

/** Error state — contextual icon + message + action buttons */
const ErrorState = ({ errorType, errorMessage, onRetry }) => {
  const navigate = useNavigate();

  const config = ERROR_CONFIG[errorType] || ERROR_CONFIG[CALLBACK_ERROR_TYPE.UNEXPECTED];
  const { Icon, title, color, bgColor, borderColor, showRetry } = config;

  const handleBackToLogin = () => navigate("/sign-in", { replace: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-6 w-full"
      role="alert"
      aria-label={`Authentication error: ${title}`}
    >
      {/* Error icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 18, delay: 0.1 }}
        className={`w-20 h-20 rounded-full flex items-center justify-center ${bgColor} border ${borderColor}`}
        aria-hidden="true"
      >
        <Icon className={`w-10 h-10 ${color}`} />
      </motion.div>

      {/* Text */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          {errorMessage}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {showRetry && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRetry}
            aria-label="Retry GitHub authentication"
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-lg shadow-md hover:bg-slate-700 dark:hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleBackToLogin}
          aria-label="Return to the sign-in page"
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to Login
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const GithubCallback = () => {
  const isDark = useSelector((state) => state.theme.isDark);
  const { status, errorType, errorMessage, retry } = useGithubCallback();

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-black dark:via-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500"
    >
      {/* Card */}
      <div className="relative w-full max-w-sm">
        {/* Decorative background glows */}
        <div
          className="absolute -top-12 -left-12 w-40 h-40 bg-slate-700/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-12 -right-12 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        {/* Glass card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl p-8 sm:p-10 flex flex-col items-center"
          role="main"
        >
          {/* GitHub branding strip */}
          {status !== CALLBACK_STATUS.SUCCESS && (
            <div className="flex items-center gap-2 mb-8 px-3 py-1.5 bg-slate-900/8 dark:bg-white/8 rounded-full" aria-hidden="true">
              <FaGithub className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 tracking-wide">
                GitHub Authentication
              </span>
            </div>
          )}

          {/* State switcher */}
          <AnimatePresence mode="wait">
            {status === CALLBACK_STATUS.LOADING && (
              <motion.div key="loading" className="w-full flex justify-center">
                <LoadingState />
              </motion.div>
            )}

            {status === CALLBACK_STATUS.SUCCESS && (
              <motion.div key="success" className="w-full flex justify-center">
                <SuccessState />
              </motion.div>
            )}

            {status === CALLBACK_STATUS.ERROR && (
              <motion.div key="error" className="w-full">
                <ErrorState
                  errorType={errorType}
                  errorMessage={errorMessage}
                  onRetry={retry}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer note */}
        {status === CALLBACK_STATUS.LOADING && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-slate-400 dark:text-slate-600 mt-4"
          >
            Powered by GitHub OAuth 2.0
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default GithubCallback;
