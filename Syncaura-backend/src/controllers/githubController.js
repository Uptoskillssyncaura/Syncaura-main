import { getIssues, getPullRequests, getRepoInfo, getAccessToken } from "../services/githubAPI.js";

// Helper to extract GitHub access token from query parameter, x-github-token header, or Authorization header
const getGithubToken = (req) => {
  return req.query.token || req.headers["x-github-token"] || req.headers.authorization?.split(" ")[1];
};

/**
 * Exchange OAuth authorization code for an access token
 */
export const exchangeToken = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code is required" });
    }

    const token = await getAccessToken(code);
    res.json({ access_token: token });
  } catch (err) {
    console.error("Error in exchangeToken controller:", err.message);
    res.status(500).json({ message: "Error exchanging authorization code", error: err.message });
  }
};

/**
 * Get GitHub repository details (default branch, description, branches)
 */
export const getRepoDetails = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const token = getGithubToken(req);

    if (!token) {
      return res.status(400).json({ message: "A valid GitHub access token is required." });
    }
    if (!owner || !repo) {
      return res.status(400).json({ message: "Owner and repo parameters are required." });
    }

    const data = await getRepoInfo(owner, repo, token);
    res.json(data);
  } catch (err) {
    console.error("Error in getRepoDetails controller:", err.message);
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message || "Error fetching repo info"
    });
  }
};

/**
 * Get Pull Requests for the GitHub repository
 */
export const getRepoPRs = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const token = getGithubToken(req);

    if (!token) {
      return res.status(400).json({ message: "A valid GitHub access token is required." });
    }
    if (!owner || !repo) {
      return res.status(400).json({ message: "Owner and repo parameters are required." });
    }

    const data = await getPullRequests(owner, repo, token);
    res.json(data);
  } catch (err) {
    console.error("Error in getRepoPRs controller:", err.message);
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message || "Error fetching PRs"
    });
  }
};

/**
 * Get Issues for the GitHub repository
 */
export const getRepoIssues = async (req, res) => {
  try {
    const { owner, repo } = req.query;
    const token = getGithubToken(req);

    if (!token) {
      return res.status(400).json({ message: "A valid GitHub access token is required." });
    }
    if (!owner || !repo) {
      return res.status(400).json({ message: "Owner and repo parameters are required." });
    }

    const data = await getIssues(owner, repo, token);
    res.json(data);
  } catch (err) {
    console.error("Error in getRepoIssues controller:", err.message);
    res.status(err.response?.status || 500).json({
      message: err.response?.data?.message || err.message || "Error fetching issues"
    });
  }
};
