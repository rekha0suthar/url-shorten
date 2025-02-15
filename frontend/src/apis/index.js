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

// Google login api
export const googleLoginApi = async (credentialResponse) => {
  const response = await api.post('/auth/google', {
    token: credentialResponse.credential,
  });
  return response.data;
};

// Shorten url api
export const shortenUrlApi = async (data) => {
  const response = await api.post('/shorten', data);
  return response.data;
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
  const response = await api.get(`/analytics/overall`);
  return response.data;
};

// fetch analytics of all urls group to specific topic
export const getTopicAnalyticsApi = async (topic) => {
  const response = await api.get(`/analytics/topic/${topic}`);
  return response.data;
};
