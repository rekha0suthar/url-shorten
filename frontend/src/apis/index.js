import axios from 'axios';

// Importing api base url from .env file
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Setting headers for axios instance
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }
  return config;
});

// Google login api
export const googleLoginApi = async (credentialResponse) => {
  const response = await api.post('/auth/google', {
    token: credentialResponse.credential,
  });
  return response.data;
};

// Shorten url api
export const shortenUrlApi = async (data) => {
  try {
    const response = await api.post('/shorten', data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(
        error.response.data.message || 'Failed to create short URL'
      );
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error('Error setting up the request');
    }
  }
};

// fetch all urls api
export const getUrlsApi = async (params) => {
  const response = await api.get('/urls', { params });
  return response.data;
};

// fetch analytics of a specific url
export const getUrlAnalyticsApi = async (alias) => {
  const response = await api.get(`/analytics/${alias}`);
  return response.data;
};

// fetch analytics of all urls
export const getOverallAnalyticsApi = async () => {
  const response = await api.get('/analytics/overall');
  return response.data;
};

// fetch analytics of all urls group to specific topic
export const getTopicAnalyticsApi = async (topic) => {
  const response = await api.get(`/analytics/topic/${topic}`);
  return response.data;
};
