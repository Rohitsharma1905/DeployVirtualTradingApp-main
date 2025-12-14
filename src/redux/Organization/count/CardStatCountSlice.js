// CardStatCountSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';

// Async Thunk for fetching organizations
export const fetchOrganizations = createAsyncThunk(
  'cardStatCount/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/organization/list`);
      return response.data.data; // Make sure this matches your API response structure
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch organizations'
      );
    }
  }
);

// Initial state
const initialState = {
  organizations: [],
  status: 'idle',
  error: null,
  totalOrganizations: 0
};

// Slice
const cardStatCountSlice = createSlice({
  name: 'cardStatCount',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateTotalCount: (state) => {
      state.totalOrganizations = state.organizations.length;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.organizations = action.payload;
        state.totalOrganizations = action.payload.length;
        state.error = null;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// Base selectors
const selectCardStatState = state => state?.cardStatCount || initialState;
const selectAdminOrgState = state => state?.admin?.organizationList || { organizations: [] };

// Memoized selectors
export const selectOrganizations = createSelector(
  [selectCardStatState],
  state => state.organizations
);

export const selectOrganizationCount = createSelector(
  [selectCardStatState, selectAdminOrgState],
  (cardStatState, adminOrgState) => {
    const cardStatCount = cardStatState.organizations?.length || 0;
    const adminListCount = adminOrgState.organizations?.length || 0;
    return Math.max(cardStatCount, adminListCount);
  }
);

export const selectOrganizationStatus = createSelector(
  [selectCardStatState],
  state => state.status
);

export const selectOrganizationError = createSelector(
  [selectCardStatState],
  state => state.error
);

export const selectTotalOrganizations = createSelector(
  [selectCardStatState],
  state => state.totalOrganizations
);

// Stats selector for dashboard
export const selectOrganizationStats = createSelector(
  [selectOrganizations, selectTotalOrganizations],
  (organizations, total) => ({
    total,
    active: organizations.filter(org => org.status === 'active').length,
    pending: organizations.filter(org => org.status === 'pending').length,
    inactive: organizations.filter(org => org.status === 'inactive').length
  })
);

// Export actions
export const { clearError, updateTotalCount } = cardStatCountSlice.actions;

// Export reducer
export default cardStatCountSlice.reducer;