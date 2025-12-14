import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Async thunks
export const fetchComplaints = createAsyncThunk(
  'admin/complaintTable/fetchComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/complaint/admin`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch complaints';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchComplaintsOfOrg = createAsyncThunk(
  'admin/complaintTable/fetchComplaintsOfOrg',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/complaint/admin/organization-complaints`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch organization complaints';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);




export const deleteComplaint = createAsyncThunk(
  'admin/complaintTable/deleteComplaint',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/user/complaint/admin/${id}`);
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete complaint';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  'admin/complaintTable/updateComplaintStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_API_URL}/user/complaint/admin/${id}/status`,
        { status }
      );
      return { id, updatedComplaint: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const filterComplaints = (complaints, filters) => {
  return complaints.filter(complaint => {
    if (filters.category && filters.category !== 'all' && 
      complaint.category !== filters.category) {
    return false;
  }
    if (filters.status && filters.status !== 'all') {
      if (complaint.status.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }
    }

    if (filters.startDate && filters.endDate) {
      const complaintkDate = new Date(complaint.createdDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (complaintkDate < startDate || complaintkDate > endDate) {
        return false;
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [
        complaint.userId?.name,
        complaint.userId?.email,
        complaint.message,
        complaint.status,
        complaint.type,
        complaint.organizationId?.name,    
        complaint.organizationId?.email, 
      ].filter(Boolean);

      return searchFields.some(field =>
        field.toString().toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

// Calculate stats from complaints
const calculateComplaintStats = (complaints) => {
  const total = complaints.length;

  const solved = complaints.filter(c => c.status === 'solved').length;
  const pending = complaints.filter(c => c.status === 'pending').length;
  const rejected = complaints.filter(c => c.status === 'rejected').length;

  const satisfied = complaints.filter(c => c.userSatisfaction === 'satisfied').length;
  const notSatisfied = complaints.filter(c => c.userSatisfaction === 'not_satisfied').length;
  const noResponse = total - (satisfied + notSatisfied);

  const categoryDistribution = complaints.reduce((acc, c) => {
    acc[c.complaintCategory] = (acc[c.complaintCategory] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    solved,
    pending,
    rejected,
    satisfied,
    notSatisfied,
    noResponse,
    categoryDistribution
  };
};



const initialState = {
  complaints: [],
  filteredComplaints: [],
  orgComplaints: [],
  filteredOrgComplaints: [],
  stats: {
    total: 0,
    solved: 0,
    pending: 0,
    rejected: 0,
    satisfied: 0,
    notSatisfied: 0,
    noResponse: 0,
    categoryDistribution: {}
  },
  orgStats: {
    total: 0,
    solved: 0,
    pending: 0,
    rejected: 0,
    satisfied: 0,
    notSatisfied: 0,
    noResponse: 0,
    categoryDistribution: {}
  },
  filters: {
    category: 'all',
    status: 'all',
    userSatisfaction: 'all',
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

const complaintTableSlice = createSlice({
  name: 'admin/complaintTable',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredComplaints = filterComplaints(state.complaints, state.filters);
      state.stats = calculateComplaintStats(state.filteredComplaints);
      state.filteredOrgComplaints = filterComplaints(state.orgComplaints, state.filters);
      state.orgStats = calculateComplaintStats(state.filteredOrgComplaints);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredComplaints = state.complaints;
      state.stats = calculateComplaintStats(state.complaints);
      state.filteredOrgComplaints = state.orgComplaints;
      state.orgStats = calculateComplaintStats(state.orgComplaints);
    },
    updateLocalFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredComplaints = filterComplaints(state.complaints, state.filters);
      state.stats = calculateComplaintStats(state.filteredComplaints);
      state.filteredOrgComplaints = filterComplaints(state.orgComplaints, state.filters);
      state.orgStats = calculateComplaintStats(state.filteredOrgComplaints);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload.data;
        state.filteredComplaints = filterComplaints(action.payload.data, state.filters);
        state.stats = calculateComplaintStats(state.filteredComplaints);
        state.lastUpdated = Date.now();
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchComplaintsOfOrg.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaintsOfOrg.fulfilled, (state, action) => {
        state.loading = false;
        state.orgComplaints = action.payload.data;
        state.filteredOrgComplaints = filterComplaints(action.payload.data, state.filters);
        state.orgStats = calculateComplaintStats(state.filteredOrgComplaints);
        state.lastUpdated = Date.now();
      })
      .addCase(fetchComplaintsOfOrg.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComplaint.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.complaints = state.complaints.filter(
          complaint => complaint._id !== action.payload
        );
        state.filteredComplaints = filterComplaints(state.complaints, state.filters);
        state.stats = calculateComplaintStats(state.filteredComplaints);
      })
      .addCase(deleteComplaint.rejected, (state) => {
        state.isDeleting = false;
      })
      .addCase(updateComplaintStatus.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.isUpdating = false;
        const index = state.complaints.findIndex(
          c => c._id === action.payload.id
        );
        if (index !== -1) {
          state.complaints[index] = action.payload.updatedComplaint;
          state.filteredComplaints = filterComplaints(state.complaints, state.filters);
          state.stats = calculateComplaintStats(state.filteredComplaints);
        }
      })
      .addCase(updateComplaintStatus.rejected, (state) => {
        state.isUpdating = false;
      });
  }
});

export const {
  setFilters,
  clearFilters,
  updateLocalFilters
} = complaintTableSlice.actions;

export const selectComplaints = state => state.admin.complaintTable.complaints;
export const selectFilteredComplaints = state => state.admin.complaintTable.filteredComplaints;
export const selectComplaintStats = state => state.admin.complaintTable.stats;
export const selectOrgComplaints = state => state.admin.complaintTable.orgComplaints;
export const selectFilteredOrgComplaints = state => state.admin.complaintTable.filteredOrgComplaints;
export const selectOrgComplaintStats = state => state.admin.complaintTable.orgStats;
export const selectComplaintLoading = state => state.admin.complaintTable.loading;
export const selectComplaintError = state => state.admin.complaintTable.error;
export const selectComplaintDeleting = state => state.admin.complaintTable.isDeleting;
export const selectComplaintUpdating = state => state.admin.complaintTable.isUpdating;
export const selectComplaintFilters = state => state.admin.complaintTable.filters;
export const selectComplaintLastUpdated = state => state.admin.complaintTable.lastUpdated;

export default complaintTableSlice.reducer;