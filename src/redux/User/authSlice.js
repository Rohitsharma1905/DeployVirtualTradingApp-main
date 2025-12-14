import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/BaseUrl';

// Admin credentials (Consider moving to environment variables)
const ADMIN_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin@123"
};

// Helper function to safely parse JSON
const safeJSONParse = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      // Admin login check
      if (
        credentials.email === ADMIN_CREDENTIALS.email && 
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        const adminData = {
          user: {
            _id: "admin-id",
            name: "Admin",
            email: ADMIN_CREDENTIALS.email,
            role: "admin",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          // token: "admin-token"
          token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MDQ5YTMxMjlkN2Q4YjdhY2ZiY2EyMiIsImlhdCI6MTc0NjI5MjEyOSwiZXhwIjoxNzQ2Mjk1NzI5fQ.tnWkqkfsTy24sSDFkMdKaiE9J7B5aua1Mr-FjD6483c"
        };
        return adminData;
      }

      // Regular user login
      const response = await axios.post(`${BASE_API_URL}/user/auth/login`, credentials);
      
      if (!response.data || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      return {
        user: {
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          role: response.data.user.role,
          createdAt: response.data.user.createdAt,
          updatedAt: response.data.user.updatedAt,
          profileImage: response.data.user.profileImage || null,
          phoneNumber: response.data.user.phoneNumber || null,
          address: response.data.user.address || null,
          settings: response.data.user.settings || {}
        },
        token: response.data.token
      };
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue('Invalid email or password');
      }
      if (error.response?.status === 404) {
        return rejectWithValue('User not found');
      }
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to login. Please try again.'
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.auth;
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.get(`${BASE_API_URL}/user/auth/status`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue('Authentication failed');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().user.auth;
      const response = await axios.patch(
        `${BASE_API_URL}/user/profile/update`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to update profile'
      );
    }
  }
);

// Initial state
const initialState = {
  user: safeJSONParse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
  lastLogin: localStorage.getItem('lastLogin'),
  sessionExpiry: null
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear state
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.isAuthenticated = false;
      state.sessionExpiry = null;
      state.role = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('lastLogin');
      localStorage.removeItem('role');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.isAuthenticated = true;
        state.lastLogin = new Date().toISOString();
          // Set role based on user data
        const role = action.payload.user?.role || 'user';
        state.role = role;


        // Update localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('lastLogin', new Date().toISOString());
        localStorage.setItem('role', role); 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Check auth status cases
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      })

      // Update profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = { ...state.user, ...action.payload.user };
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAuth = (state) => state.user.auth;
export const selectCurrentUser = (state) => state.user.auth.user;
export const selectAuthStatus = (state) => state.user.auth.status;
export const selectAuthError = (state) => state.user.auth.error;
export const selectIsAuthenticated = (state) => state.user.auth.isAuthenticated;
export const selectIsAdmin = (state) => state.user.auth.user?.role === 'admin';
export const selectToken = (state) => state.user.auth.token;
export const selectLastLogin = (state) => state.user.auth.lastLogin;
export const selectSessionExpiry = (state) => state.user.auth.sessionExpiry;

// Action creators
export const { 
  logout, 
  clearError, 
  updateUser, 
  setSessionExpiry 
} = authSlice.actions;

// Reducer
export default authSlice.reducer;