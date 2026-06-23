import axios from 'axios';

// Evaluated at runtime in the browser — not affected by REACT_APP_API_URL baked at build time.
// In production (any Vercel URL), use relative paths so API is always same-origin.
// In local dev, proxy to the Express server on port 4000.
const API_URL =
  typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? ''
    : 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
export { API_URL };
