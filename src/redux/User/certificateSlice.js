// userCertificateSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/BaseUrl';

export const fetchMyCertificates = createAsyncThunk(
  'userCertificates/fetchMyCertificates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/events/my-certificates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const downloadCertificate = createAsyncThunk(
  'userCertificates/downloadCertificate',
  async ({ certificateId, eventName }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/events/api/certificates/download/${certificateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',
      });
      return { blob: response.data, eventName };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userCertificateSlice = createSlice({
  name: 'userCertificates',
  initialState: {
    certificates: [],
    loading: false,
    error: null,
    downloading: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates || [];
      })
      .addCase(fetchMyCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(downloadCertificate.pending, (state, action) => {
        state.downloading = action.meta.arg.certificateId;
      })
      .addCase(downloadCertificate.fulfilled, (state, action) => {
        state.downloading = null;
        // Handle the download in the component
      })
      .addCase(downloadCertificate.rejected, (state, action) => {
        state.downloading = null;
        state.error = action.payload;
      });
  },
});

export default userCertificateSlice.reducer;