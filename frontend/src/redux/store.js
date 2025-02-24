import { configureStore } from '@reduxjs/toolkit';
import urlReducer from './slices/urlSlice';
import authReducer from './slices/authSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    url: urlReducer,
    auth: authReducer,
    analytics: analyticsReducer,
  },
});

export default store;
