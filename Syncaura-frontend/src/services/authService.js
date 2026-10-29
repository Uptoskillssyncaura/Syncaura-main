import api from '../config/axios';

/**
 * Task: User profile fetch after login
 * Description: Hits the GET /api/auth/me endpoint using the login token
 */
export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token'); 
    
    if (!token) {
      console.warn("No token found. Waiting for user to login.");
      return null;
    }

    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};