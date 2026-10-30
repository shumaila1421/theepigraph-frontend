import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export const getErrorMessage = (error) =>
  error.response?.data?.message ||
  "Cannot reach the server. Is the backend running?";

export default api;
