import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOverallAnalytics = createAsyncThunk(
  'analytics/fetchOverall',
  async () => {
    const response = await fetch('/analytics/overall');
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }
);

export const fetchTopicAnalytics = createAsyncThunk(
  'analytics/fetchTopic',
  async (topic) => {
    const response = await fetch(`/analytics/topic/${topic}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }
);

const initialState = {
  overallData: null,
  topicData: null,
  loading: false,
  error: null,
  selectedTopic: 'acquisition',
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload;
    },
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverallAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverallAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.overallData = action.payload;
      })
      .addCase(fetchOverallAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTopicAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopicAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.topicData = action.payload;
      })
      .addCase(fetchTopicAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setSelectedTopic, clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
