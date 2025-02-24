import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Get initial state from localStorage
const getUserFromStorage = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      return {
        user: parsedUser.user,
        token: parsedUser.token,
        isAuthenticated: true,
      };
    } catch (error) {
      localStorage.removeItem('user');
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

export const loginUser = createAsyncThunk('auth/login', async (response) => {
  // Store in localStorage
  localStorage.setItem('user', JSON.stringify(response));
  return response;
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { getState }) => {
    const response = await fetch('/api/auth/status', {
      headers: {
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data = await response.json();
    return data.user;
  }
);

const initialState = {
  ...getUserFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add action to restore auth state from localStorage
    restoreAuth: (state) => {
      const stored = getUserFromStorage();
      state.user = stored.user;
      state.token = stored.token;
      state.isAuthenticated = stored.isAuthenticated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
      })
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
      });
  },
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
