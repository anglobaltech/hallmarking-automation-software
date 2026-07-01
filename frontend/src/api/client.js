// frontend/src/api/client.js
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for global error handling
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Network error';
    return Promise.reject(new Error(message));
  }
);

export default client;
