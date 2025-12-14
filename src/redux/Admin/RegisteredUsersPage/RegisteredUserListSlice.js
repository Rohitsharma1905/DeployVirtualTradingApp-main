import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'registeredUsers/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/display-users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  'registeredUsers/createUser',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/register`, userData);
      await dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create user");
    }
  }
);

export const updateUser = createAsyncThunk(
  'registeredUsers/updateUser',
  async ({ userId, userData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_API_URL}/user/users/${userId}`, userData);
      await dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update user");
    }
  }
);

export const deleteUser = createAsyncThunk(
  'registeredUsers/deleteUser',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_API_URL}/user/users/${userId}`);
      await dispatch(fetchUsers());
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete user");
    }
  }
);

// Initial State
const initialState = {
  list: [],
  filteredUsers: [],
  totalUsers: 0,
  selectedUser: null,
  status: 'idle',
  error: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  filters: {
    status: 'all',
    gender: 'all',
    startDate: null,
    endDate: null
  },
  activeFilters: {
    status: false,
    gender: false,
    dateRange: false,
    search: false
  },
  searchQuery: '',
  stats: {
    total: 0,
    active: 0,
    pending: 0,
    disabled: 0,
    male: 0,
    female: 0
  }
};

// Helper functions
const applyUserFilters = (users, filters, searchQuery) => {
  return users.filter(user => {
    // Status filter
    if (filters.status !== 'all' && user.status !== filters.status) {
      return false;
    }

    // Gender filter
    if (filters.gender !== 'all' && user.gender !== filters.gender) {
      return false;
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      const userDate = new Date(user.createdDate);
      const startDate = new Date(filters.startDate);
      const endDate = new Date(filters.endDate);
      if (userDate < startDate || userDate > endDate) {
        return false;
      }
    }

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.name?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.mobile?.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });
};

const calculateUserStats = (users) => ({
  total: users.length,
  active: users.filter(user => user.status === 'active').length,
  pending: users.filter(user => user.status === 'pending').length,
  disabled: users.filter(user => user.status === 'disabled').length,
  male: users.filter(user => user.gender === 'Male').length,
  female: users.filter(user => user.gender === 'Female').length
});

// Slice
const RegisteredUserListSlice = createSlice({
  name: 'registeredUsers',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredUsers = applyUserFilters(state.list, state.filters, state.searchQuery);
      state.stats = calculateUserStats(state.filteredUsers);
    },
    setActiveFilters: (state, action) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredUsers = applyUserFilters(state.list, state.filters, action.payload);
      state.stats = calculateUserStats(state.filteredUsers);
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.activeFilters = initialState.activeFilters;
      state.searchQuery = '';
      state.filteredUsers = state.list;
      state.stats = calculateUserStats(state.list);
    },
    updateFilteredUsers: (state) => {
      state.filteredUsers = applyUserFilters(state.list, state.filters, state.searchQuery);
      state.stats = calculateUserStats(state.filteredUsers);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoading = false;
        state.list = action.payload;
        state.filteredUsers = applyUserFilters(action.payload, state.filters, state.searchQuery);
        state.totalUsers = action.payload.length;
        state.stats = calculateUserStats(state.filteredUsers);
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isCreating = false;
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isUpdating = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.list = state.list.filter(user => user._id !== action.payload);
        state.filteredUsers = applyUserFilters(state.list, state.filters, state.searchQuery);
        state.totalUsers = state.list.length;
        state.stats = calculateUserStats(state.filteredUsers);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setSelectedUser,
  clearSelectedUser,
  setFilters,
  setActiveFilters,
  setSearchQuery,
  clearFilters,
  updateFilteredUsers,
  clearError
} = RegisteredUserListSlice.actions;

// Selectors
export const selectUsers = (state) => state.admin?.registeredUsersTable?.list || [];
export const selectFilteredUsers = (state) => state.admin?.registeredUsersTable?.filteredUsers || [];
export const selectTotalUsers = (state) => state.admin?.registeredUsersTable?.totalUsers || 0;
export const selectUserStatus = (state) => state.admin?.registeredUsersTable?.status || 'idle';
export const selectUserError = (state) => state.admin?.registeredUsersTable?.error || null;
export const selectIsLoading = (state) => state.admin?.registeredUsersTable?.isLoading || false;
export const selectIsCreating = (state) => state.admin?.registeredUsersTable?.isCreating || false;
export const selectIsUpdating = (state) => state.admin?.registeredUsersTable?.isUpdating || false;
export const selectIsDeleting = (state) => state.admin?.registeredUsersTable?.isDeleting || false;
export const selectSelectedUser = (state) => state.admin?.registeredUsersTable?.selectedUser || null;
export const selectFilters = (state) => state.admin?.registeredUsersTable?.filters || initialState.filters;
export const selectActiveFilters = (state) => state.admin?.registeredUsersTable?.activeFilters || initialState.activeFilters;
export const selectSearchQuery = (state) => state.admin?.registeredUsersTable?.searchQuery || '';
export const selectStats = (state) => state.admin?.registeredUsersTable?.stats || initialState.stats;

export default RegisteredUserListSlice.reducer;