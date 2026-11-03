const msal = require("@azure/msal-node");
require("dotenv").config();

const msalConfig = {
  auth: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/common`
  }
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

const SCOPES = [
  "https://graph.microsoft.com/Mail.Read",
  "https://graph.microsoft.com/Calendars.ReadWrite",
  "https://graph.microsoft.com/User.Read",
  "offline_access"
];

async function getAuthUrl() {
  return await pca.getAuthCodeUrl({
    scopes: SCOPES,
    redirectUri: process.env.REDIRECT_URI,
    prompt: "select_account"
  });
}

async function getToken(code) {
  const result = await pca.acquireTokenByCode({
    code,
    scopes: SCOPES,
    redirectUri: process.env.REDIRECT_URI
  });
  console.log("✅ Token acquired:", result.accessToken.substring(0, 20) + "...");
  return result.accessToken;
}

module.exports = { getAuthUrl, getToken };