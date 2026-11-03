import express from "express";
import {
  exchangeToken,
  getRepoDetails,
  getRepoPRs,
  getRepoIssues
} from "../controllers/githubController.js";

const router = express.Router();

// Exchange OAuth authorization code for access token
router.post("/token", exchangeToken);

// Get GitHub repository info (description, branches, etc)
router.get("/repo", getRepoDetails);

// Get GitHub repository pull requests
router.get("/prs", getRepoPRs);

// Get GitHub repository issues
router.get("/issues", getRepoIssues);

export default router;