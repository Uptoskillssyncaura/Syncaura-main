import axios from "axios";

/**
 * ENVIRONMENT CONFIGURATION:
 * GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET from the .env file.
 * The frontend sends a temporary 'code' here, and this securely exchanges it for a user token.
 */
export const getAccessToken = async (code) => {
  try {
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI || `${process.env.CLIENT_URL}/auth/github/callback`,
      },
      {
        headers: {
          Accept: "application/json", // Forces GitHub to return a clean JSON object
        },
      }
    );

    if (response.data.error) {
      throw new Error(response.data.error_description);
    }

    return response.data.access_token;
  } catch (error) {
    console.error("Error exchanging code for GitHub token:", error.message);
    throw error;
  }
};

/**
 * AUTHENTICATION HEADERS & CENTRALIZED BASE URL:
 * This helper dynamically builds an Axios client using the token retrieved above.
 */
const getAuthClient = (token) => {
  if (!token) {
    throw new Error("A valid GitHub access token is required to make API calls.");
  }

  return axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`, 
      "X-GitHub-Api-Version": "2022-11-28", // Best practice to lock the API version
    },
  });
};

// --- API Methods ---

export const getRepoInfo = async (owner, repo, token) => {
  const client = getAuthClient(token);
  
  try {
    const [repoRes, branchesRes] = await Promise.all([
      client.get(`/repos/${owner}/${repo}`),
      client.get(`/repos/${owner}/${repo}/branches`)
    ]);

    return {
      name: repoRes.data.name,
      description: repoRes.data.description,
      default_branch: repoRes.data.default_branch,
      branches: branchesRes.data.map(branch => branch.name)
    };
  } catch (error) {
    console.error(`Error fetching repo info:`, error.response?.data || error.message);
    throw error;
  }
};

export const getPullRequests = async (owner, repo, token) => {
  const client = getAuthClient(token);

  try {

    const response = await client.get(`/repos/${owner}/${repo}/pulls`, {
      params: { state: "open" } 
    });

    return response.data.map((pr) => ({
      id: pr.id,
      title: pr.title,
      state: pr.state,
      author: pr.user?.login,
      created_at: pr.created_at
      
    }));
  } catch (error) {
    console.error(`Error fetching PRs:`, error.response?.data || error.message);
    throw error;
  }
};

export const getIssues = async (owner, repo, token) => {
  const client = getAuthClient(token);

  try {
    const response = await client.get(`/repos/${owner}/${repo}/issues`, {
      params: { state: "open" }
    });

    // Filter out PRs, as GitHub's REST API includes PRs in the /issues endpoint
    return response.data
      .filter((issue) => !issue.pull_request)
      .map((issue) => ({
        id: issue.id,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map((label) => label.name),
        assignee: issue.assignee?.login || null
      }));
  } catch (error) {
    console.error(`Error fetching issues:`, error.response?.data || error.message);
    throw error;
  }
};