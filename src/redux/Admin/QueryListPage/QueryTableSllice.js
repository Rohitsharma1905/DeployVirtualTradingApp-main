import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Centralized API calls
const contactService = {
  fetchAll: async () => {
    const response = await axios.get(`${BASE_API_URL}/user/contact/get`);
    return {
      contacts: response.data
    };
  },

  delete: (contactId) =>
    axios.delete(`${BASE_API_URL}/user/contact/deleteContact/${contactId}`)
};

// Helper function for filtering contacts
const applyContactFilters = (contacts, filters, searchQuery) => {
  return contacts.filter(contact => {
    // Type filter
    if (filters.type !== 'all' && contact.type !== filters.type) {
      return false;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const contactDate = new Date(contact.createdDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (contactDate < startDate || contactDate > endDate) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.type?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

// Calculate stats
const calculateContactStats = (contacts) => ({
  total: contacts.length,
  technicalSupport: contacts.filter(c => c.type === 'Technical Support').length,
  billingIssues: contacts.filter(c => c.type === 'Billing Issue').length,
  generalInquiries: contacts.filter(c => c.type === 'General Inquiry').length,
  feedback: contacts.filter(c => c.type === 'Feedback').length
});

// Async Thunks
export const fetchContacts = createAsyncThunk(
  'adminQueryTable/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      return await contactService.fetchAll();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Data fetch failed");
    }
  }
);

export const deleteContact = createAsyncThunk(
  'adminQueryTable/deleteContact',
  async (contactId, { dispatch, rejectWithValue }) => {
    try {
      await contactService.delete(contactId);
      await dispatch(fetchContacts());
      toast.success('Contact deleted successfully!');
      return contactId;
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
      return rejectWithValue(error.response?.data?.message || "Delete failed");
    }
  }
);

// Initial State
const initialState = {
  contacts: [],
  filteredContacts: [],
  status: 'idle',
  error: null,
  isDeleting: false,
  filters: {
    type: 'all',
    startDate: null,
    endDate: null
  },
  activeFilters: {
    type: false,
    dateRange: false,
    search: false
  },
  searchQuery: '',
  stats: {
    total: 0,
    technicalSupport: 0,
    billingIssues: 0,
    generalInquiries: 0,
    feedback: 0
  }
};

// Slice
const adminQueryTableSlice = createSlice({
  name: 'adminQueryTable',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredContacts = applyContactFilters(state.contacts, state.filters, state.searchQuery);
      state.stats = calculateContactStats(state.filteredContacts);
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredContacts = applyContactFilters(state.contacts, state.filters, action.payload);
      state.stats = calculateContactStats(state.filteredContacts);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.activeFilters = initialState.activeFilters;
      state.searchQuery = '';
      state.filteredContacts = state.contacts;
      state.stats = calculateContactStats(state.contacts);
    },
    filterContacts: (state) => {
      state.filteredContacts = applyContactFilters(state.contacts, state.filters, state.searchQuery);
      state.stats = calculateContactStats(state.filteredContacts);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        const { contacts } = action.payload;
        state.status = 'succeeded';
        state.contacts = contacts;
        state.filteredContacts = applyContactFilters(contacts, state.filters, state.searchQuery);
        state.stats = calculateContactStats(state.filteredContacts);
        state.error = null;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteContact.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state) => {
        state.isDeleting = false;
        state.error = null;
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isDeleting = false;
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
  clearFilters,
  filterContacts
} = adminQueryTableSlice.actions;

// Selectors
export const selectContacts = (state) => state.admin.queryTable.contacts;
export const selectFilteredContacts = (state) => state.admin.queryTable.filteredContacts;
export const selectStatus = (state) => state.admin.queryTable.status;
export const selectError = (state) => state.admin.queryTable.error;
export const selectIsDeleting = (state) => state.admin.queryTable.isDeleting;
export const selectFilters = (state) => state.admin.queryTable.filters;
export const selectActiveFilters = (state) => state.admin.queryTable.activeFilters;
export const selectSearchQuery = (state) => state.admin.queryTable.searchQuery;
export const selectStats = (state) => state.admin.queryTable.stats;

export default adminQueryTableSlice.reducer;