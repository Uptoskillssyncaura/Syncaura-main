// When VITE_API_URL is set (production), use it directly.
// In development, use empty string so browser calls go to the same origin
// and Vite proxy forwards them to the backend.
const BASE_URL = import.meta.env.VITE_API_URL || "";

export default BASE_URL;