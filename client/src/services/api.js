import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Register a new user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
export const register = async (email, password) => {
  const response = await api.post('/api/auth/register', { email, password });
  return response.data;
};

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise}
 */
export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

/**
 * Get lockout status for user/IP
 * @param {string} email 
 * @returns {Promise}
 */
export const getStatus = async (email = '') => {
  const response = await api.get(`/api/auth/status${email ? `?email=${email}` : ''}`);
  return response.data;
};

export default api;