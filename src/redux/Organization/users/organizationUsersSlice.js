import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import toast from "react-hot-toast";
import axiosInstance from "../../../utils/axiosConfig";

// Async Thunk for registering a new user
export const registerOrganizationUser = createAsyncThunk(
  "organizationUser/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_API_URL}/organization/user/register`, userData);
      // toast.success("User registered successfully!");
      toast.success(response?.data?.msg);
      return response.data; // Return the newly created user
    } catch (error) {
      toast.error(error.response.data.msg);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for updating an existing user
export const updateOrganizationUser = createAsyncThunk(
  "organizationUser/update",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BASE_API_URL}/organization/user/${id}`, userData);
      // toast.success("User updated successfully!");
      toast.success(response?.data?.msg); 
      return response.data; // Return the updated user
    } catch (error) {
      toast.error(error.response.data.msg);
      return rejectWithValue(error.response.data);
    }
  }
);




// Async Thunk for fetching users
export const fetchOrganizationUsers = createAsyncThunk(
  "organizationUser/fetchUsers",
  async ({ orgName, page, limit, search, startDate, endDate, gender }, { rejectWithValue }) => {
  // async ({ orgName, page, limit, search, startDate, endDate }, { rejectWithValue }) => {

    try {
      const response = await axiosInstance.get(`${BASE_API_URL}/organization/${orgName}/users`, {
        params: {
          page,
          limit,
          search,
          // startDate: startDate ? startDate.toISOString() : null,
          // endDate: endDate ? endDate.toISOString() : null,
          startDate: startDate ? new Date(startDate).toISOString() : null, // Convert ISO string back to Date
          endDate: endDate ? new Date(endDate).toISOString() : null, 
          gender
      
        },
      });
      console.log("Fetched users:", response); 
      return response.data; // Return the fetched users and pagination data
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to fetch users.");
      return rejectWithValue(error.response.data);
    }
  }
);

// Async Thunk for deleting a user
export const deleteOrganizationUser = createAsyncThunk(
  "organizationUser/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE_API_URL}/organization/user/${id}`);
      toast.success("User deleted successfully!");
      return id; // Return the deleted user's ID
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete user.");
      return rejectWithValue(error.response.data);
    }
  }
);



// Initial state
const initialState = {
  // old one working
  // users: [], // List of users
  // loading: false,
  // error: null,
  // success: false,
 
// new one gendeer
  users: [],
  loading: false,
  error: null,
  success: false,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  searchTerm: '',
  startDate: null,
  endDate: null,
  gender: '',
};

// Slice
const organizationUsersSlice = createSlice({
  name: "organizationUser",
  initialState,
  reducers: {
    // old code working 
    resetUserState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    // clearFilters: (state) => {
    //   state.startDate = null;
    //   state.endDate = null;
    //   state.minAge = "";
    //   state.maxAge = "";
    // },
    // new one
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    clearFilters: (state) => {
      state.startDate = null;
      state.endDate = null;
      state.gender = '';
    },

  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerOrganizationUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerOrganizationUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users.push(action.payload); // Add the new user to the list
      })
      .addCase(registerOrganizationUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update User
      .addCase(updateOrganizationUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrganizationUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser; // Update the user in the list
        }
      })
      .addCase(updateOrganizationUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchOrganizationUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchOrganizationUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Delete User
      .addCase(deleteOrganizationUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrganizationUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.users = state.users.filter((user) => user._id !== action.payload); // Remove the deleted user
      })
      .addCase(deleteOrganizationUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// export const { resetUserState } = organizationUsersSlice.actions;
// export default organizationUsersSlice.reducer;

export const {
  resetUserState,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  setGender,
  clearFilters,
} = organizationUsersSlice.actions;

export default organizationUsersSlice.reducer;