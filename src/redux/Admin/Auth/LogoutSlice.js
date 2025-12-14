import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { toast } from 'react-hot-toast';

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Optional: Call backend logout endpoint if needed
      // await axios.post(`${BASE_API_URL}/auth/logout`);

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');

      toast.success('Logged out successfully!'); // Success toast
      return null;
    } catch (error) {
      toast.error(error.response?.data || 'Logout failed'); // Error toast
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);

// Logout Slice
const logoutSlice = createSlice({
name: 'logout',
initialState: {
isLoading: false,
error: null,
isLoggedOut: false
},
reducers: {
resetLogoutState: (state) => {
state.isLoading = false;
state.error = null;
state.isLoggedOut = false;
}
},
extraReducers: (builder) => {
builder
.addCase(logoutUser.pending, (state) => {
state.isLoading = true;
state.error = null;
state.isLoggedOut = false;
})
.addCase(logoutUser.fulfilled, (state) => {
state.isLoading = false;
state.error = null;
state.isLoggedOut = true;
})
.addCase(logoutUser.rejected, (state, action) => {
state.isLoading = false;
state.error = action.payload;
state.isLoggedOut = false;
});
}
});

// Selectors
export const selectLogoutState = (state) => {
// Provide a fallback object if the state is undefined
return state.logout || {
isLoading: false,
error: null,
isLoggedOut: false
};
};

export const selectIsLoading = (state) =>
state.logout?.isLoading ?? false;

export const selectLogoutError = (state) =>
state.logout?.error ?? null;

export const selectIsLoggedOut = (state) =>
state.logout?.isLoggedOut ?? false;

export const { resetLogoutState } = logoutSlice.actions;
export default logoutSlice.reducer;