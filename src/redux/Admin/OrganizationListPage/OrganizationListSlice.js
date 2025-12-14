// OrganizationListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';

// Async Thunks
export const fetchOrganizations = createAsyncThunk(
  'organizationList/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/organization/list`);
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch organizations');
    }
  }
);

export const deleteOrganization = createAsyncThunk(
  'organizationList/deleteOrganization',
  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        throw new Error('Invalid organization ID');
      }

      const response = await axios.delete(`${BASE_API_URL}/organization/organization/${id}`);
      
      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to delete organization');
      }

      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to delete organization'
      );
    }
  }
);

export const updateOrganizationStatus = createAsyncThunk(
  'organizationList/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/organization/status/${id}`,
        { status }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to update status');
      }

      return {
        id,
        status,
        ...response.data
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message ||
        'Failed to update organization status'
      );
    }
  }
);

// Initial State
const initialState = {
  organizations: [],
  filteredOrganizations: [],
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    startDate: null,
    endDate: null,
    city: "all"
  },
  activeFilters: {
    status: false,
    dateRange: false,
    search: false,
    city: false
  },
  searchQuery: "",
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1
  },
  modals: {
    isFormOpen: false,
    selectedOrg: null
  }
};

// Slice
const organizationListSlice = createSlice({
  name: 'organizationList',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setModal: (state, action) => {
      state.modals = { ...state.modals, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.activeFilters = initialState.activeFilters;
      state.searchQuery = "";
      state.pagination.currentPage = 1;
    },
    filterOrganizations: (state) => {
      let filtered = [...state.organizations];

      // Status Filter
      if (state.filters.status !== "all") {
        filtered = filtered.filter(org => 
          org.approvalStatus?.toLowerCase() === state.filters.status.toLowerCase()
        );
      }

      // Date Filter
      if (state.filters.startDate && state.filters.endDate) {
        filtered = filtered.filter(org => {
          const orgDate = new Date(org.createDate);
          return orgDate >= new Date(state.filters.startDate) && 
                 orgDate <= new Date(state.filters.endDate);
        });
      }

      // City Filter
      if (state.filters.city !== "all") {
        filtered = filtered.filter(org => 
          org.city?.toLowerCase() === state.filters.city.toLowerCase()
        );
      }

      // Search Filter
      if (state.searchQuery) {
        const searchLower = state.searchQuery.toLowerCase();
        filtered = filtered.filter(org =>
          org.name?.toLowerCase().includes(searchLower) ||
          org.contactPerson?.toLowerCase().includes(searchLower) ||
          org.email?.toLowerCase().includes(searchLower) ||
          org.mobile?.toLowerCase().includes(searchLower)
        );
      }

      state.filteredOrganizations = filtered;
      state.pagination.totalPages = Math.ceil(
        filtered.length / state.pagination.itemsPerPage
      );
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = Array.isArray(action.payload) ? action.payload : [];
        state.filteredOrganizations = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Organization
      .addCase(deleteOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.payload.id;
        state.organizations = state.organizations.filter(org => org._id !== deletedId);
        state.filteredOrganizations = state.filteredOrganizations.filter(org => org._id !== deletedId);
        state.error = null;
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Organization Status
      .addCase(updateOrganizationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrganizationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { id, status } = action.payload;
        const org = state.organizations.find(org => org._id === id);
        if (org) {
          org.approvalStatus = status;
        }
        const filteredOrg = state.filteredOrganizations.find(org => org._id === id);
        if (filteredOrg) {
          filteredOrg.approvalStatus = status;
        }
        state.error = null;
      })
      .addCase(updateOrganizationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setFilters,
  setActiveFilters,
  setSearchQuery,
  setPagination,
  setModal,
  clearFilters,
  filterOrganizations
} = organizationListSlice.actions;

export default organizationListSlice.reducer;