import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

// Generate password function
const generatePassword = (name) => {
  const symbols = ['@', '#', '$', '%', '&', '*', '!'];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomNumbers = Math.floor(Math.random() * 900 + 100);
  return `${name}${randomSymbol}${randomNumbers}`;
};

// Async Thunks
// Async Thunks
export const registerUser = createAsyncThunk(
  'userRegistration/register',
  async (userData, { rejectWithValue, dispatch }) => { // userData comes from formik values
    try {
      // REMOVED password generation and adding password/status fields.
      // Send only the original form data (userData).
      const response = await axios.post(
        `${BASE_API_URL}/admin/UserRegister`, // Endpoint seems correct
        userData // Send only what the form provided
      );

      // Display a success message appropriate for backend generation
      toast.success('User registered successfully! Login credentials sent via email.');
      // You might want to dispatch fetchUsers AFTER the modal closes or in onSuccess prop
      // dispatch(fetchUsers()); // Consider moving this if needed elsewhere
      return response.data; // Return data from backend (includes generated user potentially)

    } catch (error) {
      // Handle the error - Check if backend sends structured errors
      const errorMsg = error.response?.data?.message || 'Registration failed';
      const backendErrors = error.response?.data?.errors; // Check for the errors array

      toast.error(errorMsg);

      // Reject with structured error if available, otherwise just the message
      return rejectWithValue({
         message: errorMsg,
         errors: backendErrors || null // Pass backend errors if they exist
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  'userRegistration/update',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.put(
        `${BASE_API_URL}/user/users/${id}`,
        data
      );

      // toast.success('User updated successfully!');
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      console.error('Update error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Update failed');
      return rejectWithValue(error.response?.data?.message || 'Update failed');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'userRegistration/delete',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/user/users/${id}`
      );

      toast.success('User deleted successfully!');
      dispatch(fetchUsers());
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deletion failed');
      return rejectWithValue(error.response?.data?.message || 'Deletion failed');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'userRegistration/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/display-users`);
      return response.data;
    } catch (error) {
      // toast.error(error.response?.data?.message || '');
      return rejectWithValue(error.response?.data?.message || '');
    }
  }
);

// Initial state
const initialState = {
  users: [],
  isLoading: false,
  isDeleting: false,
  error: null,
  success: false,
  selectedUser: null,
  notification: {
    message: null,
    type: null
  },
  filters: {
    status: 'all',
    gender: 'all',
    startDate: null,
    endDate: null,
    searchQuery: ''
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }
};

// Slice
const userRegistrationSlice = createSlice({
  name: 'userRegistration',
  initialState,
  reducers: {
    resetForm: (state) => {
      state.error = null;
      state.success = false;
      state.notification.message = null;
      state.notification.type = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearNotification: (state) => {
      state.notification.message = null;
      state.notification.type = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
        state.notification.message = 'User registered successfully';
        state.notification.type = 'success';
        if (action.payload.user) {
          state.users.unshift(action.payload.user);
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
        state.notification.message = action.payload;
        state.notification.type = 'error';
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isDeleting = false;
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload;
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectRegistrationLoading = (state) =>
  state.admin.userRegistration.isLoading ?? false;

export const selectRegistrationError = (state) =>
  state.admin.userRegistration.error ?? null;

export const selectRegistrationSuccess = (state) =>
  state.admin.userRegistration.success ?? false;

export const selectSelectedUser = (state) =>
  state?.admin?.userRegistration?.selectedUser ?? null;

export const selectUsers = (state) =>
  state?.admin?.userRegistration?.users ?? [];

export const selectNotificationStatus = createSelector(
  [(state) => state.admin.userRegistration.notification],
  (notification) => ({
    message: notification.message,
    type: notification.type
  })
);

export const selectFilters = (state) =>
  state?.admin?.userRegistration?.filters ?? initialState.filters;

export const selectPagination = (state) =>
  state?.admin?.userRegistration?.pagination ?? initialState.pagination;

export const selectIsDeleting = (state) =>
  state?.admin?.userRegistration?.isDeleting ?? false;

export const selectFilteredUsers = createSelector(
  [selectUsers, selectFilters],
  (users, filters) => {
    return users.filter(user => {
      if (filters.status !== 'all' && user.status !== filters.status) return false;
      if (filters.gender !== 'all' && user.gender !== filters.gender) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.mobile.includes(query)
        );
      }
      return true;
    });
  }
);

// Export Actions
export const {
  resetForm,
  setSelectedUser,
  clearNotification,
  setFilters,
  setPagination,
  clearFilters
} = userRegistrationSlice.actions;

export default userRegistrationSlice.reducer;