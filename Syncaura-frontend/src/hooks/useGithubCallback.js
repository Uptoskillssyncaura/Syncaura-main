/**
 * useGithubCallback.js
 *
 * Custom hook that encapsulates the entire GitHub OAuth callback flow.
 *
 * Supports TWO modes:
 *
 *  MODE A — Backend Redirect (primary, used with our backend):
 *    After GitHub exchange, backend redirects to:
 *    /auth/github/callback?token=xxx&accessToken=xxx&refreshToken=xxx&role=user&name=John
 *    → Hook reads tokens directly from URL params, stores them, updates Redux, redirects.
 *
 *  MODE B — Code Exchange (fallback):
 *    /auth/github/callback?code=xxx&state=xxx
 *    → Hook calls POST /api/auth/github/callback, gets { user, tokens } JSON.
 *
 * Reuses: setCredentials (authSlice), toast (react-toastify)
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../redux/slices/authSlice";
import {
  exchangeGithubCode,
  GITHUB_AUTH_ERROR,
} from "../services/githubAuthService";

// ─── Status Constants ─────────────────────────────────────────────────────────

export const CALLBACK_STATUS = {
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export const CALLBACK_ERROR_TYPE = {
  CANCELLED: "CANCELLED",
  MISSING_CODE: "MISSING_CODE",
  INVALID_STATE: "INVALID_STATE",
  NETWORK: GITHUB_AUTH_ERROR.NETWORK,
  BACKEND_UNAVAILABLE: GITHUB_AUTH_ERROR.BACKEND_UNAVAILABLE,
  INVALID_CODE: GITHUB_AUTH_ERROR.INVALID_CODE,
  EXPIRED_CODE: GITHUB_AUTH_ERROR.EXPIRED_CODE,
  UNEXPECTED: GITHUB_AUTH_ERROR.UNEXPECTED,
};

// ─── Session Storage Key (exported so SignIn.jsx can import it) ───────────────

export const GITHUB_STATE_KEY = "github_oauth_state";

// ─── Role-Based Redirect Helper ───────────────────────────────────────────────

const getRedirectPath = (role) => {
  switch (role) {
    case "Admin":
    case "admin":
      return "/admin";
    case "Co-Admin":
    case "co-admin":
      return "/co-admin";
    default:
      return "/user-dashboard";
  }
};

// ─── Store tokens + update Redux ─────────────────────────────────────────────

const storeAuthData = (dispatch, { accessToken, refreshToken, name, role }) => {
  if (accessToken) {
    localStorage.setItem("token", accessToken);
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  dispatch(
    setCredentials({
      user: { name: name || "User", role: role || "user" },
      token: accessToken,
    })
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useGithubCallback = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [status, setStatus] = useState(CALLBACK_STATUS.LOADING);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Prevents duplicate processing (React StrictMode / hot-reload safe)
  const hasProcessed = useRef(false);

  const setError = useCallback((type, message) => {
    setStatus(CALLBACK_STATUS.ERROR);
    setErrorType(type);
    setErrorMessage(message);
  }, []);

  const handleSuccess = useCallback(
    ({ accessToken, refreshToken, name, role }) => {
      storeAuthData(dispatch, { accessToken, refreshToken, name, role });
      toast.success(`🎉 Welcome, ${name || "User"}! GitHub login successful.`);
      setStatus(CALLBACK_STATUS.SUCCESS);
      setTimeout(() => {
        navigate(getRedirectPath(role), { replace: true });
      }, 2000);
    },
    [dispatch, navigate]
  );

  const processCallback = useCallback(async () => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const errorParam   = searchParams.get("error");
    const token        = searchParams.get("token") || searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const role         = searchParams.get("role");
    const name         = searchParams.get("name");
    const code         = searchParams.get("code");
    const state        = searchParams.get("state");

    // ── 1. Backend returned an error param ───────────────────────────────────
    if (errorParam) {
      const decoded = decodeURIComponent(errorParam);
      sessionStorage.removeItem(GITHUB_STATE_KEY);
      if (
        decoded === "access_denied" ||
        decoded.toLowerCase().includes("denied") ||
        decoded.toLowerCase().includes("cancelled") ||
        decoded.toLowerCase().includes("canceled")
      ) {
        setError(
          CALLBACK_ERROR_TYPE.CANCELLED,
          "You cancelled the GitHub authorization. You can try again anytime."
        );
      } else {
        setError(CALLBACK_ERROR_TYPE.UNEXPECTED, decoded);
      }
      return;
    }

    // ── 2. MODE A: Backend redirected with tokens in URL ─────────────────────
    //    Our backend does this — same pattern as Google OAuth in this project
    if (token) {
      sessionStorage.removeItem(GITHUB_STATE_KEY);
      handleSuccess({ accessToken: token, refreshToken, name, role });
      return;
    }

    // ── 3. No code and no token — invalid ────────────────────────────────────
    if (!code) {
      setError(
        CALLBACK_ERROR_TYPE.MISSING_CODE,
        "No authorization code was received from GitHub. Please start the sign-in process again."
      );
      return;
    }

    // ── 4. MODE B: Code exchange flow ─────────────────────────────────────────
    const savedState = sessionStorage.getItem(GITHUB_STATE_KEY);
    if (savedState && state !== savedState) {
      setError(
        CALLBACK_ERROR_TYPE.INVALID_STATE,
        "Security validation failed. The request may have been tampered with. Please sign in again."
      );
      return;
    }
    sessionStorage.removeItem(GITHUB_STATE_KEY);

    try {
      const data = await exchangeGithubCode(code, state);
      const { user, tokens } = data;
      const { accessToken: at, refreshToken: rt } = tokens || {};
      handleSuccess({ accessToken: at, refreshToken: rt, name: user?.name, role: user?.role });
    } catch (err) {
      const type = err.type || CALLBACK_ERROR_TYPE.UNEXPECTED;
      const message = err.message || "An unexpected error occurred. Please try again.";
      setError(type, message);
      if (type === CALLBACK_ERROR_TYPE.NETWORK) {
        toast.error("Network error — please check your connection.");
      } else if (type !== CALLBACK_ERROR_TYPE.BACKEND_UNAVAILABLE) {
        toast.error("GitHub authentication failed. Please try again.");
      }
    }
  }, [searchParams, handleSuccess, setError]);

  useEffect(() => {
    processCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retry = useCallback(() => {
    hasProcessed.current = false;
    setStatus(CALLBACK_STATUS.LOADING);
    setErrorType(null);
    setErrorMessage("");
    processCallback();
  }, [processCallback]);

  return { status, errorType, errorMessage, retry };
};

export default useGithubCallback;
