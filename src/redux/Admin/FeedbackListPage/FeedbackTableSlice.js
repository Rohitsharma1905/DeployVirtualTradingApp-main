import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Helper function for filtering feedbacks
const filterFeedbacks = (feedbacks, filters) => {
  return feedbacks.filter(feedback => {
    // Category filter
    if (filters.category && filters.category !== 'all' && 
        feedback.feedbackCategory !== filters.category) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && filters.rating !== 'all' && 
        feedback.rating !== parseInt(filters.rating)) {
      return false;
    }
    
    // Status filter
    if (filters.status && filters.status !== 'all') {
      if (feedback.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    // Recommend filter
    if (filters.recommend && filters.recommend !== 'all') {
      const isRecommended = filters.recommend === 'true';
      if (feedback.recommend !== isRecommended) {
        return false;
      }
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const feedbackDate = new Date(feedback.createdDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (feedbackDate < startDate || feedbackDate > endDate) {
        return false;
      }
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [
        feedback.userId?.name,
        feedback.userId?.email,
        feedback.feedbackMessage,
        feedback.suggestions,
        feedback.feedbackCategory
      ].filter(Boolean);

      return searchFields.some(field => 
        field.toString().toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

// Calculate stats from feedbacks
const calculateStats = (feedbacks) => {
  const total = feedbacks.length;
  const positive = feedbacks.filter(f => f.rating >= 4).length;
  const negative = feedbacks.filter(f => f.rating <= 2).length;
  const neutral = feedbacks.filter(f => f.rating === 3).length;
  const approved = feedbacks.filter(f => f.status === 'approved').length;
  const rejected = feedbacks.filter(f => f.status === 'rejected').length;
  const recommended = feedbacks.filter(f => f.recommend).length;
  const notRecommended = total - recommended;

  const categoryDistribution = feedbacks.reduce((acc, f) => {
    acc[f.feedbackCategory] = (acc[f.feedbackCategory] || 0) + 1;
    return acc;
  }, {});

  const averageRating = total 
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
    : 0;

  const recommendationRate = total
    ? ((recommended / total) * 100).toFixed(1)
    : 0;

  return {
    total,
    positive,
    negative,
    neutral,
    approved,
    rejected,
    recommended,
    notRecommended,
    categoryDistribution,
    averageRating,
    recommendationRate
  };
};

// Async Thunks
// In FeedbackTableSlice.js

export const fetchFeedbacks = createAsyncThunk(
  'admin/feedbackTable/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching feedbacks from:', `${BASE_API_URL}/user/feedback/admin`);
      const response = await axios.get(`${BASE_API_URL}/user/feedback/admin`);
      console.log('Feedback response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch feedbacks';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteFeedback = createAsyncThunk(
  'admin/feedbackTable/deleteFeedback',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/user/feedback/admin/${id}`);
      // toast.success('Feedback deleted successfully');
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete feedback';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'admin/feedbackTable/updateFeedbackStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/user/feedback/admin/${id}/status`,
        { status }
      );
      // toast.success(`Status updated to ${status}`);
      return { id, updatedFeedback: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial State
const initialState = {
  feedbacks: [],
  filteredFeedbacks: [],
  stats: {
    total: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
    approved: 0,
    rejected: 0,
    recommended: 0,
    notRecommended: 0,
    categoryDistribution: {},
    averageRating: 0,
    recommendationRate: 0
  },
  filters: {
    category: 'all',
    rating: 'all',
    status: 'all',
    recommend: 'all',
    startDate: null,
    endDate: null,
    search: ''
  },
  loading: false,
  error: null,
  isDeleting: false,
  isUpdating: false,
  lastUpdated: null
};

// Slice
const feedbackTableSlice = createSlice({
  name: 'admin/feedbackTable',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredFeedbacks = filterFeedbacks(state.feedbacks, state.filters);
      state.stats = calculateStats(state.filteredFeedbacks);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredFeedbacks = state.feedbacks;
      state.stats = calculateStats(state.feedbacks);
    },
    updateLocalFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredFeedbacks = filterFeedbacks(state.feedbacks, state.filters);
      state.stats = calculateStats(state.filteredFeedbacks);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
        state.filteredFeedbacks = filterFeedbacks(
          action.payload.data,
          state.filters
        );
        state.stats = calculateStats(state.filteredFeedbacks);
        state.lastUpdated = Date.now();
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeedback.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.feedbacks = state.feedbacks.filter(
          feedback => feedback._id !== action.payload
        );
        state.filteredFeedbacks = filterFeedbacks(
          state.feedbacks,
          state.filters
        );
        state.stats = calculateStats(state.filteredFeedbacks);
      })
      .addCase(deleteFeedback.rejected, (state) => {
        state.isDeleting = false;
      })
      .addCase(updateFeedbackStatus.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.feedbacks.findIndex(
          f => f._id === action.payload.id
        );
        if (index !== -1) {
          state.feedbacks[index] = action.payload.updatedFeedback;
          state.filteredFeedbacks = filterFeedbacks(
            state.feedbacks,
            state.filters
          );
          state.stats = calculateStats(state.filteredFeedbacks);
        }
      })
      .addCase(updateFeedbackStatus.rejected, (state) => {
        state.isUpdating = false;
      });
  }
});

export const {
  setFilters,
  clearFilters,
  updateLocalFilters
} = feedbackTableSlice.actions;

export const selectFeedbacks = state => state.admin.feedbackTable.feedbacks;
export const selectFilteredFeedbacks = state => state.admin.feedbackTable.filteredFeedbacks;
export const selectFeedbackStats = state => state.admin.feedbackTable.stats;
export const selectFeedbackLoading = state => state.admin.feedbackTable.loading;
export const selectFeedbackError = state => state.admin.feedbackTable.error;
export const selectIsDeleting = state => state.admin.feedbackTable.isDeleting;
export const selectIsUpdating = state => state.admin.feedbackTable.isUpdating;
export const selectFeedbackFilters = state => state.admin.feedbackTable.filters;
export const selectLastUpdated = state => state.admin.feedbackTable.lastUpdated;

export default feedbackTableSlice.reducer;