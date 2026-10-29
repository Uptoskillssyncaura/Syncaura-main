import { toast } from "react-toastify";

/**
 * Vedant (Error Handling & Toast Messages):
 * Please configure and style all toast errors and messages in this helper utility.
 * Whenever an API request catches an error, this helper will process and display it automatically.
 */

export const handleError = (error) => {
  console.error("❌ Caught API Error:", error);

  // If the error passed is already a string message (e.g. rejectWithValue)
  if (typeof error === "string") {
    toast.error(error);
    return error;
  }

  // Handle Axios HTTP Response Errors
  const status = error.response?.status;
  const backendMessage = error.response?.data?.message || error.response?.data?.error;
  
  let userFriendlyMessage = "An unexpected error occurred. Please try again.";

  if (backendMessage) {
    userFriendlyMessage = backendMessage;
  } else if (status === 404) {
    userFriendlyMessage = "Requested resource not found (404).";
  } else if (status === 403) {
    userFriendlyMessage = "You do not have permission to perform this action (403).";
  } else if (status === 500) {
    userFriendlyMessage = "Internal Server Error (500). Please try again later.";
  } else if (error.message === "Network Error") {
    userFriendlyMessage = "Network error. Please check if the backend server is running.";
  } else if (error.message) {
    userFriendlyMessage = error.message;
  }

  // Configure premium, eye-catching style for errors
  toast.error(userFriendlyMessage, {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored", // Colored alerts stand out beautifully for validation/server errors
  });

  return userFriendlyMessage;
};

/**
 * Trigger success notifications
 */
export const handleSuccess = (message) => {
  // Configure premium colored style for success popups
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored", // Bright green success toasts look modern and sleek
  });
};
