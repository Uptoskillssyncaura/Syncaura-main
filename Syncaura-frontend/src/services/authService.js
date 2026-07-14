import axios from 'axios';

/**
 * Task: User profile fetch after login
 * Description: Hits the GET /api/auth/me endpoint using the login token
 */
export const fetchUserProfile = async () => {
  try {
    
    const token = localStorage.getItem('token'); 
    
    if (!token) {
      console.warn("No token found. Waiting for user to login.");
      return null;
    }

    // 2. Call the backend server endpoint provided by the team leader
    const response = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

    // 3. Return the user profile data payload
    return response.data;

  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};