import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Centralized API calls
const eventService = {
  fetchAll: async () => {
    const response = await axios.get(`${BASE_API_URL}/admin/events`);
    return {
      events: response.data.events
    };
  },
  create: async (eventData) => {
    const response = await axios.post(`${BASE_API_URL}/admin/events`, eventData);
    return response.data.event;
  },
  update: async (eventId, eventData) => {
    const response = await axios.put(`${BASE_API_URL}/admin/events/${eventId}`, eventData);
    return response.data.event;
  },
  delete: async (eventId) => {
    await axios.delete(`${BASE_API_URL}/admin/events/${eventId}`);
    return eventId;
  }
};

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'adminEventTable/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await eventService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Events fetch failed");
    }
  }
);

export const createEvent = createAsyncThunk(
  'adminEventTable/createEvent',
  async (eventData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/admin/events`, eventData);
      return response.data.event;
    } catch (error) {
      // More robust error handling
      if (error.response?.data) {
        if (Array.isArray(error.response.data.errors)) {
          return rejectWithValue({ 
            message: error.response.data.message || 'Validation failed',
            errors: error.response.data.errors
          });
        }
        return rejectWithValue({
          message: error.response.data.message || 'Event creation failed'
        });
      }
      return rejectWithValue({
        message: error.message || 'Event creation failed'
      });
    }
  }
);

export const updateEvent = createAsyncThunk(
  'adminEventTable/updateEvent',
  async ({ eventId, eventData }, { dispatch, rejectWithValue }) => {
    try {
      const updatedEvent = await eventService.update(eventId, eventData);
      // toast.success('Event updated successfully!');
      dispatch(fetchEvents());
      return updatedEvent;
    } catch (error) {
      toast.error(error.response?.data?.message || "Event update failed");
      return rejectWithValue(error.response?.data?.message || "Event update failed");
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'adminEventTable/deleteEvent',
  async (eventId, { dispatch, rejectWithValue }) => {
    try {
      await eventService.delete(eventId);
      // toast.success('Event deleted successfully!');
      dispatch(fetchEvents());
      return eventId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Event deletion failed");
      return rejectWithValue(error.response?.data?.message || "Event deletion failed");
    }
  }
);

// Initial State
const initialState = {
  events: [],
  filteredEvents: [],
  status: 'idle',
  error: null,
  isLoading: false,
  filters: {
    status: 'all',
    startDate: null,
    endDate: null
  },
  activeFilters: {
    status: false,
    dateRange: false,
    search: false
  },
  searchQuery: '',
  pagination: {
    currentPage: 1,
    itemsPerPage: 10
  },
  modals: {
    isFormOpen: false,
    isDetailsOpen: false,
    isFilterOpen: false
  }
};

// Slice
const adminEventTableSlice = createSlice({
  name: 'adminEventTable',
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
    filterEvents: (state) => {
      const { status, startDate, endDate } = state.filters;
      const searchQuery = state.searchQuery.toLowerCase();
      
      state.filteredEvents = state.events.filter(event => {
        // Status filter
        const statusMatch = status === 'all' || event.type === status;
        
        // Date range filter
        let dateMatch = true;
        if (startDate && endDate) {
          const eventStartDate = new Date(event.startDate);
          const filterStartDate = new Date(startDate);
          const filterEndDate = new Date(endDate);
          dateMatch = eventStartDate >= filterStartDate && eventStartDate <= filterEndDate;
        }
        
        // Search filter
        const searchMatch = 
          event.title.toLowerCase().includes(searchQuery) ||
          event.description.toLowerCase().includes(searchQuery) ||
          event.prize.toLowerCase().includes(searchQuery);
        
        return statusMatch && dateMatch && searchMatch;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload.events;
        state.filteredEvents = action.payload.events;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
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
  filterEvents
} = adminEventTableSlice.actions;

// Selectors
export const selectEvents = (state) => state.admin.eventTable.events;
export const selectFilteredEvents = (state) => state.admin.eventTable.filteredEvents;
export const selectEventsStatus = (state) => state.admin.eventTable.status;
export const selectEventsError = (state) => state.admin.eventTable.error;
export const selectEventsLoading = (state) => state.admin.eventTable.isLoading;
export const selectFilters = (state) => state.admin.eventTable.filters;
export const selectActiveFilters = (state) => state.admin.eventTable.activeFilters;
export const selectSearchQuery = (state) => state.admin.eventTable.searchQuery;
export const selectPagination = (state) => state.admin.eventTable.pagination;
export const selectModals = (state) => state.admin.eventTable.modals;

export default adminEventTableSlice.reducer;