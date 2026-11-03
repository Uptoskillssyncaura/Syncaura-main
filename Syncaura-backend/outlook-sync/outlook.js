const axios = require("axios");

const BASE_URL = "https://graph.microsoft.com/v1.0/me";

async function getEmails(accessToken) {
  try {
    const res = await axios.get(`${BASE_URL}/messages`, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      params: { $top: 10, $select: "subject,from,receivedDateTime" }
    });
    return res.data.value;
  } catch (err) {
    // Show exact error from Microsoft
    console.log("Full error:", JSON.stringify(err.response?.data, null, 2));
    throw new Error(JSON.stringify(err.response?.data));
  }
}

async function getCalendarEvents(accessToken) {
  try {
    const res = await axios.get(`${BASE_URL}/events`, {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      params: { $top: 10, $select: "subject,start,end,location" }
    });
    return res.data.value;
  } catch (err) {
    console.log("Full error:", JSON.stringify(err.response?.data, null, 2));
    throw new Error(JSON.stringify(err.response?.data));
  }
}

module.exports = { getEmails, getCalendarEvents };