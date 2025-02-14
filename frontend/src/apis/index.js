import axios from 'axios';

// Importing api base url from .env file
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Setting headers for axios instance
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const googleLoginApi = async (credentialResponse) => {
  const response = await api.post('/auth/google', {
    token: credentialResponse.credential,
  });
  return response.data;
};
