// OrganizationRegisterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import { fetchOrganizations } from '../../Organization/auth/organizationAuthSlice';

// Initial state
const initialState = {
  isLoading: false,
  error: null,
  success: false,
  selectedOrg: null,
  notification: {
    message: null,
    type: null
  }
};

// OrganizationRegisterSlice.js
export const registerOrganization = createAsyncThunk(
  'organizationRegistration/register',
  async (organizationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/admin/OrgRegister`,
        organizationData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // If the response includes a success message, treat it as success
      if (response.data && response.data.message?.includes('successfully')) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      }

      return rejectWithValue({
        success: false,
        message: response.data.message || 'Registration failed',
        fieldErrors: response.data.errors
      });
    } catch (error) {
      return rejectWithValue({
        success: false,
        message: error.response?.data?.message || 'Registration failed',
        fieldErrors: error.response?.data?.errors
      });
    }
  }
);


export const updateOrganization = createAsyncThunk(
  'organizationRegistration/update',
  async ({ id, data }, { rejectWithValue, dispatch }) => {
    try {
      // Filter out unwanted fields
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key, value]) => 
          value !== undefined && 
          value !== '' && 
          !['_id', 'password', 'createDate', 'updateDate', '__v'].includes(key)
        )
      );

      const response = await axios.put(
        `${BASE_API_URL}/organization/update/${id}`,
        filteredData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Fetch updated organization list after successful update
        await dispatch(fetchOrganizations());
        return response.data;
      }
      return rejectWithValue(response.data.message || 'Update failed');
    } catch (error) {
      console.error('Update Error:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Update failed'
      );
    }
  }
);

// Slice
const organizationRegistrationSlice = createSlice({
  name: 'organizationRegistration',
  initialState,
  reducers: {
    resetForm: () => initialState,
    setSelectedOrg: (state, action) => {
      state.selectedOrg = action.payload;
    },
    clearNotification: (state) => {
      state.notification = { message: null, type: null };
    }
  },
  extraReducers: (builder) => {
    builder
      // Register Organization
      .addCase(registerOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.notification = { message: null, type: null };
      })
      .addCase(registerOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
        state.notification = {
          type: 'success',
          message: action.payload.message
        };
      })
      .addCase(registerOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload?.message || 'Registration failed';
        state.notification = {
          type: 'error',
          message: action.payload?.message || 'Registration failed'
        };
      })
      // Update Organization
      .addCase(updateOrganization.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
        state.notification = { message: null, type: null };
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
        state.notification = {
          message: action.payload.message || 'Organization updated successfully',
          type: 'success'
        };
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error = action.payload;
        state.notification = {
          message: action.payload,
          type: 'error'
        };
      });
  }
});

// Actions
export const {
  resetForm,
  setSelectedOrg,
  clearNotification
} = organizationRegistrationSlice.actions;

// Base Selector
const getOrganizationRegistrationState = state => state?.admin?.organizationRegistration || initialState;

// Main Selectors
export const selectRegistrationState = state => getOrganizationRegistrationState(state);
export const selectRegistrationLoading = state => selectRegistrationState(state).isLoading;
export const selectRegistrationError = state => selectRegistrationState(state).error;
export const selectRegistrationSuccess = state => selectRegistrationState(state).success;
export const selectSelectedOrg = state => selectRegistrationState(state).selectedOrg;
export const selectNotification = state => selectRegistrationState(state).notification;

// Derived Selectors
export const selectNotificationStatus = state => ({
  message: selectNotification(state).message,
  type: selectNotification(state).type
});

// Helper Selectors
export const selectIsProcessing = state => selectRegistrationLoading(state);
export const selectHasErrors = state => !!selectRegistrationError(state);
export const selectIsSuccessful = state => selectRegistrationSuccess(state);

// Combined Selectors
export const selectRegistrationData = state => ({
  isLoading: selectRegistrationLoading(state),
  error: selectRegistrationError(state),
  success: selectRegistrationSuccess(state),
  selectedOrg: selectSelectedOrg(state),
  notification: selectNotification(state)
});

export default organizationRegistrationSlice.reducer;