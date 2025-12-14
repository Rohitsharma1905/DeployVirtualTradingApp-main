import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Async Thunks
// export const fetchAllParticipants = createAsyncThunk(
//   'adminParticipants/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_API_URL}/admin/events/event-registrations`);
//       console.log(response);
//       return response.data.registrations;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch participants");
//     }
//   }
// );

// In participantSlice.js, update the fetchAllParticipants thunk:
export const fetchAllParticipants = createAsyncThunk(
  'adminParticipants/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/events/event-registrations`);
      // Group by user to show unique users
      const uniqueUsersMap = new Map();
      response.data.registrations.forEach(reg => {
        if (!uniqueUsersMap.has(reg.userId._id)) {
          uniqueUsersMap.set(reg.userId._id, {
            ...reg,
            userId: {
              _id: reg.userId._id,
              name: reg.userId.name,
              email: reg.userId.email,
              mobile: reg.userId.mobile,
              gender: reg.userId.gender
            }
          });
        }
      });
      return Array.from(uniqueUsersMap.values());
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch participants");
    }
  }
);



export const fetchUserEvents = createAsyncThunk(
  'adminParticipants/fetchUserEvents',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/events/users/${userId}/events`);
      return {
        userId,
        events: response.data.events
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user events");
    }
  }
);

export const updateRegistrationStatus = createAsyncThunk(
  'adminParticipants/updateStatus',
  async ({ registrationId, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/admin/events/event-registrations/${registrationId}/status`,
        { status }
      );
      toast.success('Registration status updated successfully');
      dispatch(fetchAllParticipants());
      return response.data.registration;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
      return rejectWithValue(error.response?.data?.message || "Failed to update status");
    }
  }
);

console.log(fetchAllParticipants);
console.log(fetchUserEvents);
console.log(updateRegistrationStatus);




// Initial State
const initialState = {
  allParticipants: [],
  userEvents: {},
  status: 'idle',
  error: null,
  isLoading: false,
  filters: {
    status: 'all',
    eventId: 'all',
    startDate: null,
    endDate: null
  },
  activeFilters: {
    status: false,
    event: false,
    dateRange: false,
    search: false
  },
  searchQuery: '',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10
  },
  modals: {
    isDetailsOpen: false,
    isUserEventsOpen: false
  },
  selectedParticipant: null,
  selectedUser: null
};

// Slice
const adminParticipantsSlice = createSlice({
  name: 'adminParticipants',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
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
      state.searchQuery = '';
    },
    setSelectedParticipant: (state, action) => {
      state.selectedParticipant = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    filterParticipants: (state) => {
      const { status, eventId, startDate, endDate } = state.filters;
      const searchQuery = state.searchQuery.toLowerCase();
      
      state.filteredParticipants = state.allParticipants.filter(participant => {
        // Status filter
        const statusMatch = status === 'all' || participant.status === status;
        
        // Event filter
        const eventMatch = eventId === 'all' || participant.eventId === eventId;
        
        // Date range filter
        let dateMatch = true;
        if (startDate && endDate) {
          const registrationDate = new Date(participant.createdAt);
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);
          dateMatch = registrationDate >= filterStartDate && registrationDate <= filterEndDate;
        }
        
        // Search filter
        const searchMatch = 
          participant.userId.name.toLowerCase().includes(searchQuery) ||
          participant.userId.email.toLowerCase().includes(searchQuery) ||
          participant.eventId.title.toLowerCase().includes(searchQuery) ||
          participant.certificateId?.toLowerCase().includes(searchQuery);
        
        return statusMatch && eventMatch && dateMatch && searchMatch;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllParticipants.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllParticipants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allParticipants = action.payload;
        state.filteredParticipants = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllParticipants.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userEvents = {
          ...state.userEvents,
          [action.payload.userId]: action.payload.events
        };
      })
      .addCase(fetchUserEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateRegistrationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRegistrationStatus.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateRegistrationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const { 
  clearError,
  setFilters,
  setActiveFilters,
  setSearchQuery,
  setPagination,
  setModal,
  clearFilters,
  filterParticipants,
  setSelectedParticipant,
  setSelectedUser
} = adminParticipantsSlice.actions;

// Selectors
export const selectAllParticipants = (state) => state.admin.participants.allParticipants;
export const selectFilteredParticipants = (state) => state.admin.participants.filteredParticipants || [];
export const selectParticipantsStatus = (state) => state.admin.participants.status;
export const selectParticipantsError = (state) => state.admin.participants.error;
export const selectParticipantsLoading = (state) => state.admin.participants.isLoading;
export const selectParticipantFilters = (state) => state.admin.participants.filters;
export const selectParticipantActiveFilters = (state) => state.admin.participants.activeFilters;
export const selectParticipantSearchQuery = (state) => state.admin.participants.searchQuery;
export const selectParticipantPagination = (state) => state.admin.participants.pagination;
export const selectParticipantModals = (state) => state.admin.participants.modals;
export const selectSelectedParticipant = (state) => state.admin.participants.selectedParticipant;
export const selectSelectedUser = (state) => state.admin.participants.selectedUser;
export const selectUserEvents = (userId) => (state) => state.admin.participants.userEvents[userId] || [];


export default adminParticipantsSlice.reducer;



