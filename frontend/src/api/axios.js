import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attach the saved token to every outgoing request, if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('foolscap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected anywhere, clear it so the UI falls back to "logged out"
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('foolscap_token');
    }
    return Promise.reject(error);
  }
);

export default api;
