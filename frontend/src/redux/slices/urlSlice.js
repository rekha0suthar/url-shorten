import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { shortenUrlApi, getUrlsApi } from '../../apis';

// Async thunk for creating short URL
export const createShortUrl = createAsyncThunk(
  'url/createShortUrl',
  async (formData) => {
    const data = await shortenUrlApi(formData);
    return data;
  }
);

// Async thunk for fetching URLs
export const fetchUrls = createAsyncThunk('url/fetchUrls', async (params) => {
  const data = await getUrlsApi(params);
  return data;
});

const initialState = {
  loading: false,
  shortUrl: '',
  error: null,
  formData: {
    originalUrl: '',
    customAlias: '',
    topic: '',
  },
  urls: {
    data: [],
    total: 0,
    page: 1,
    limit: 7,
  },
};

const urlSlice = createSlice({
  name: 'url',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    clearForm: (state) => {
      state.formData = initialState.formData;
      state.shortUrl = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShortUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShortUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.shortUrl = action.payload.shortUrl;
      })
      .addCase(createShortUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUrls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUrls.fulfilled, (state, action) => {
        state.loading = false;
        state.urls = {
          data: action.payload.urls,
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchUrls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFormData, clearForm } = urlSlice.actions;
export default urlSlice.reducer;
