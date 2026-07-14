/**
 * githubAuthService.js
 *
 * Dedicated API service for GitHub OAuth callback handling.
 *
 * Uses the shared `api` Axios instance from config/axios.js so that:
 *  - The existing Bearer token interceptor is inherited
 *  - Base URL is read from VITE_API_URL environment variable (no hardcoding)
 *  - Any future refresh-token interceptors automatically apply
 *
 * Backend endpoint expected:
 *   POST /auth/github/callback
 *   Body: { code: string, state: string }
 *   Success response: { user: {...}, tokens: { accessToken, refreshToken } }
 */

import api from "../config/axios";

// ─── Error Type Constants ─────────────────────────────────────────────────────

export const GITHUB_AUTH_ERROR = {
  NETWORK: "NETWORK_ERROR",
  BACKEND_UNAVAILABLE: "BACKEND_UNAVAILABLE",
  INVALID_CODE: "INVALID_CODE",
  EXPIRED_CODE: "EXPIRED_CODE",
  UNEXPECTED: "UNEXPECTED_ERROR",
};

// ─── Service Function ─────────────────────────────────────────────────────────

/**
 * Exchanges the GitHub OAuth authorization code for user credentials.
 *
 * @param {string} code  - The `code` query param from GitHub's redirect
 * @param {string} state - The `state` query param echoed back by GitHub
 * @returns {Promise<{ user: object, tokens: { accessToken: string, refreshToken: string } }>}
 * @throws {{ type: string, message: string }}
 */
export const exchangeGithubCode = async (code, state) => {
  try {
    const response = await api.post("/auth/github/callback", { code, state });
    return response.data;
  } catch (error) {
    // No token/auth info must appear in logs — only HTTP status
    if (!error.response) {
      // No response at all → network failure or backend down
      throw {
        type: GITHUB_AUTH_ERROR.NETWORK,
        message:
          "Unable to reach the server. Please check your internet connection.",
      };
    }

    const status = error.response?.status;

    if (status === 404 || status === 503 || status === 502) {
      throw {
        type: GITHUB_AUTH_ERROR.BACKEND_UNAVAILABLE,
        message:
          "The GitHub authentication service is not yet available. Please try again later.",
      };
    }

    if (status === 400) {
      const serverMessage = error.response?.data?.message || "";
      if (
        serverMessage.toLowerCase().includes("expired") ||
        serverMessage.toLowerCase().includes("timeout")
      ) {
        throw {
          type: GITHUB_AUTH_ERROR.EXPIRED_CODE,
          message:
            "Your GitHub authorization code has expired. Please try signing in again.",
        };
      }
      throw {
        type: GITHUB_AUTH_ERROR.INVALID_CODE,
        message:
          "Invalid authorization code received from GitHub. Please try again.",
      };
    }

    if (status === 401 || status === 403) {
      throw {
        type: GITHUB_AUTH_ERROR.INVALID_CODE,
        message: "GitHub authorization was rejected. Please try again.",
      };
    }

    throw {
      type: GITHUB_AUTH_ERROR.UNEXPECTED,
      message:
        error.response?.data?.message ||
        "An unexpected error occurred during GitHub authentication.",
    };
  }
};
