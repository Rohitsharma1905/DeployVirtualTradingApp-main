// oldest----

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { BASE_API_URL } from '../../../utils/BaseUrl';
// import { deleteOrganization } from '../../Admin/OrganizationListPage/OrganizationListSlice';
// import axiosInstance from '../../../utils/axiosConfig';

// // Async Thunks for Organization
// export const fetchOrganizations = createAsyncThunk(
//   'organizations/fetchOrganizations',
//   async () => {
//     const response = await axios.get(`${BASE_API_URL}/organization/list`);
//     return response.data;
//   }
// );

// export const fetchOrgById = createAsyncThunk(
//   "organizations/fetchOrgById",
//   async (orgId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`${BASE_API_URL}/organization/by-id?orgId=${orgId}`);
//       return response.data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const updateOrgDetails = createAsyncThunk(
//   "organizations/updateOrgDetails",
//   async ({ orgId, orgData }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`${BASE_API_URL}/organization/update-by-id?orgId=${orgId}`, orgData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const loginOrganization = createAsyncThunk(
//   'organizations/login',
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_API_URL}/organization/login`, credentials);
//       return response.data;
//     } catch (error) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(error.response.data);
//       } else {
//         return rejectWithValue({ message: 'An unexpected error occurred. Please try again.' });
//       }
//     }
//   }
// );

// export const registerOrganization = createAsyncThunk(
//   'organizations/register',
//   async (organizationData, { rejectWithValue }) => {
//     try {
//       const { photo, ...rest } = organizationData;
//       let photoUrl = "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png";
//       if (photo && photo.startsWith('data:image')) {
//         const result = await axios.post(`${BASE_API_URL}/upload`, { file: photo });
//         photoUrl = result.data.secure_url;
//       }
//       const response = await axios.post(`${BASE_API_URL}/organization/register`, { ...rest, photo: photoUrl });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const changePasswordOrganization = createAsyncThunk(
//   "organizations/changePassword",
//   async ({ orgId, oldPassword, newPassword }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`${BASE_API_URL}/organization/change-password`, {
//         orgId,
//         oldPassword,
//         newPassword
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const forgotPasswordOrganization = createAsyncThunk(
//   "organizations/forgotPassword",
//   async ({ email }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_API_URL}/organization/forgot-password`, { email });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || { message: "Something went wrong!" });
//     }
//   }
// );

// export const resetPasswordOrganization = createAsyncThunk(
//   "organizations/resetPassword",
//   async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_API_URL}/organization/reset-password/${token}`, {
//         newPassword,
//         confirmPassword,
//       });
//       return response.data.message;
//     } catch (error) {
//       let errorMessage = "Failed to reset password. Please try again.";
//       if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.response?.status === 400) {
//         errorMessage = "Invalid or expired reset link.";
//       } else if (error.response?.status === 404) {
//         errorMessage = "Organization not found.";
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const organizationAuthSlice = createSlice({
//   name: 'organizationAuth',
//   initialState: {
//     list: [],
//     currentOrg: null,
//     status: 'idle',
//     error: null,
//     orgName: localStorage.getItem("orgName") || null,
//     loading: false,
//     authError: null,
//     success: false,
//     updateError: null,
//     orgId: localStorage.getItem("orgId") || null,
//     org: JSON.parse(localStorage.getItem("org")) || null,
//   },
//   reducers: {
//     resetAuthState: (state) => {
//       state.orgName = null;
//       state.loading = false;
//       state.authError = null;
//       state.success = false;
//       state.token = null;
//       state.orgId = null;
//       state.org = null;
//     },
//     logoutOrganization: (state) => {
//       state.orgName = null;
//       state.success = false;
//       state.token = null;
//       state.orgId = null;
//       state.org = null;
//       localStorage.removeItem('orgName');
//       localStorage.removeItem("token");
//       localStorage.removeItem("orgId");
//       localStorage.removeItem("org");
//     },
//     addOrganization: (state, action) => {
//       state.list.push(action.payload);
//     },
//     removeOrganization: (state, action) => {
//       state.list = state.list.filter(org => org._id !== action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchOrganizations.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchOrganizations.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.list = action.payload;
//       })
//       .addCase(fetchOrganizations.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })
//       .addCase(fetchOrgById.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchOrgById.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrg = action.payload;
//       })
//       .addCase(fetchOrgById.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateOrgDetails.pending, (state) => {
//         state.loading = true;
//         state.updateError = null;
//       })
//       .addCase(updateOrgDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrg = action.payload;
//         state.success = true;
//         if (action.payload.name) {
//           state.orgName = action.payload.name;
//           localStorage.setItem('orgName', action.payload.name);
//         }
//       })
//       .addCase(updateOrgDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.updateError = action.payload;
//       })
//       .addCase(deleteOrganization.fulfilled, (state, action) => {
//         state.list = state.list.filter(org => org._id !== action.payload);
//       })
//       .addCase(loginOrganization.pending, (state) => {
//         state.loading = true;
//         state.authError = null;
//       })
//       .addCase(loginOrganization.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orgName = action.payload.orgName;
//         state.success = true;
//         state.token = action.payload.token;
//         state.orgId = action.payload.orgId;
//         state.org = action.payload.org;
//         localStorage.setItem('orgName', action.payload.orgName);
//         localStorage.setItem('token', action.payload.token);
//         localStorage.setItem('orgId', action.payload.orgId);
//         localStorage.setItem('org', JSON.stringify(action.payload.org));
//       })
//       .addCase(loginOrganization.rejected, (state, action) => {
//         state.loading = false;
//         state.authError = action.payload?.message || "Login failed. Please try again.";
//         state.success = false;
//       })
//       .addCase(registerOrganization.pending, (state) => {
//         state.loading = true;
//         state.authError = null;
//       })
//       .addCase(registerOrganization.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(registerOrganization.rejected, (state, action) => {
//         state.loading = false;
//         state.authError = action.payload.message;
//       })
//       .addCase(forgotPasswordOrganization.pending, (state) => {
//         state.status = "loading";
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(forgotPasswordOrganization.fulfilled, (state) => {
//         state.status = "succeeded";
//         state.loading = false;
//       })
//       .addCase(forgotPasswordOrganization.rejected, (state, action) => {
//         state.status = "failed";
//         state.loading = false;
//         state.error = action.payload || "Failed to send reset link";
//       })
//       .addCase(resetPasswordOrganization.pending, (state) => {
//         state.status = "loading";
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(resetPasswordOrganization.fulfilled, (state) => {
//         state.status = "succeeded";
//         state.loading = false;
//       })
//       .addCase(resetPasswordOrganization.rejected, (state, action) => {
//         state.status = "failed";
//         state.loading = false;
//         state.error = action.payload || "Failed to reset password";
//       })
//       .addCase(changePasswordOrganization.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(changePasswordOrganization.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(changePasswordOrganization.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });


// export const selectOrgAuthStatus = (state) => state?.organizationAuth?.loading ?? false;
// export const selectOrgAuthError = (state) => state?.organizationAuth?.authError ?? null;



// export const { resetAuthState, logoutOrganization, addOrganization, removeOrganization } = organizationAuthSlice.actions;
// export default organizationAuthSlice.reducer;


// current working--

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl'; // Ensure this path is correct
import axiosInstance from '../../../utils/axiosConfig'; // Ensure this path is correct

// --- Async Thunks ---

// Fetch all organizations (Example, likely used in admin sections)
export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchOrganizations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_API_URL}/organization/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organizations');
    }
  }
);

// Fetch a single organization by ID
export const fetchOrgById = createAsyncThunk(
  "organizations/fetchOrgById",
  async (orgId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_API_URL}/organization/by-id?orgId=${orgId}`);
      return response.data.data; // Assuming backend nests data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch organization details');
    }
  }
);

// Update organization details
export const updateOrgDetails = createAsyncThunk(
  "organizations/updateOrgDetails",
  async ({ orgId, orgData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BASE_API_URL}/organization/update-by-id?orgId=${orgId}`, orgData);
      return response.data; // Assuming backend returns the updated org object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update organization');
    }
  }
);

// Login Organization
export const loginOrganization = createAsyncThunk(
  'organizationAuth/login', // Changed prefix to match slice name
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/organization/login`, credentials);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // Send the structured error data from backend
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'An unexpected network error occurred.' });
      }
    }
  }
);

// Register Organization
export const registerOrganization = createAsyncThunk(
  'organizationAuth/register', // Changed prefix
  async (organizationData, { rejectWithValue }) => {
    try {
      const { photo, ...rest } = organizationData;
      let photoUrl = "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png";

      if (photo && typeof photo === 'string' && photo.startsWith('data:image')) {
        const result = await axios.post(`${BASE_API_URL}/upload`, { file: photo });
        if (result.data && result.data.secure_url) {
           photoUrl = result.data.secure_url;
        } else {
           console.warn("Photo upload response did not contain secure_url:", result.data);
        }
      } else if (photo) {
          console.warn("Photo provided but not in expected base64 format.");
      }

      const response = await axios.post(`${BASE_API_URL}/organization/register`, { ...rest, photo: photoUrl });
      return response.data;
    } catch (error) {
       if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ message: 'Registration failed due to an unexpected error.' });
      }
    }
  }
);

export const verifyOrganizationOtp = createAsyncThunk(
  'organizationAuth/verifyOtp',
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_API_URL}/organization/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Change Organization Password (requires auth)
export const changePasswordOrganization = createAsyncThunk(
  "organizationAuth/changePassword", // Changed prefix
  async ({ orgId, oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BASE_API_URL}/organization/change-password`, {
        orgId,
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
       return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Forgot Password (no auth needed)
export const forgotPasswordOrganization = createAsyncThunk(
  "organizationAuth/forgotPassword", // Changed prefix
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/organization/forgot-password`, { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send password reset email.');
    }
  }
);

// Reset Password (using token from email, no auth needed)
export const resetPasswordOrganization = createAsyncThunk(
  "organizationAuth/resetPassword", // Changed prefix
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/organization/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      return response.data.message;
    } catch (error) {
      let errorMessage = "Failed to reset password. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid or expired reset link, or passwords do not match.";
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// --- Initial State ---

const initialState = {
  list: [],
  listStatus: 'idle',
  listError: null,
  currentOrg: JSON.parse(localStorage.getItem("org")) || null,
  currentOrgStatus: 'idle',
  currentOrgError: null,
  token: localStorage.getItem("token") || null,
  orgId: localStorage.getItem("orgId") || null,
  orgName: localStorage.getItem("orgName") || null,
  role:localStorage.getItem("role") || null,
  loading: false, // Specifically for auth actions (login, register, password changes)
  authError: null, // Error MESSAGE for auth actions (string or null)
  errorType: null, // Specific error TYPE for auth actions (string or null, e.g., 'PENDING_APPROVAL')
  successMessage: null,
  updateStatus: 'idle',
  updateError: null,
};


// --- Slice Definition ---

const organizationAuthSlice = createSlice({
  name: 'organizationAuth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.authError = null;
      state.errorType = null;
      state.successMessage = null;
      state.currentOrgError = null;
      state.updateError = null;
      state.listError = null;
      state.currentOrgStatus = 'idle';
      state.updateStatus = 'idle';
      state.listStatus = 'idle';
      state.role = null;
    },
    logoutOrganization: (state) => {
      state.currentOrg = null;
      state.token = null;
      state.orgId = null;
      state.orgName = null;
      state.loading = false;
      state.authError = null;
      state.errorType = null;
      state.role = null;
      state.successMessage = null;
      localStorage.removeItem('org');
      localStorage.removeItem('token');
      localStorage.removeItem('orgId');
      localStorage.removeItem('orgName');
      localStorage.removeItem('role');
    },
    addOrganization: (state, action) => {
      state.list.push(action.payload);
    },
    removeOrganization: (state, action) => {
      state.list = state.list.filter(org => org._id !== action.payload);
    },
    clearSuccessMessage: (state) => {
        state.successMessage = null;
    },
    clearAuthError: (state) => {
        state.authError = null;
        state.errorType = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Organizations List Cases
      .addCase(fetchOrganizations.pending, (state) => {
        state.listStatus = 'loading';
        state.listError = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.listStatus = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.listStatus = 'failed';
        state.listError = typeof action.payload === 'string' ? action.payload : 'Failed to fetch organizations';
      })

      // Fetch Org By ID Cases
      .addCase(fetchOrgById.pending, (state) => {
        state.currentOrgStatus = 'loading';
        state.currentOrgError = null;
      })
      .addCase(fetchOrgById.fulfilled, (state, action) => {
        state.currentOrgStatus = 'succeeded';
        state.currentOrg = action.payload;
         if(state.token && state.orgId === action.payload?._id) {
            state.orgName = action.payload?.name || state.orgName;
            localStorage.setItem('org', JSON.stringify(action.payload));
            localStorage.setItem('orgName', action.payload?.name || '');
         }
      })
      .addCase(fetchOrgById.rejected, (state, action) => {
        state.currentOrgStatus = 'failed';
        state.currentOrgError = typeof action.payload === 'string' ? action.payload : 'Failed to fetch details';
      })

      // Update Org Details Cases
      .addCase(updateOrgDetails.pending, (state) => {
        state.updateStatus = 'loading';
        state.updateError = null;
        state.successMessage = null;
      })
      .addCase(updateOrgDetails.fulfilled, (state, action) => {
        state.updateStatus = 'succeeded';
        const updatedOrg = action.payload?.data || action.payload;
        state.currentOrg = updatedOrg;
        state.successMessage = action.payload?.message || "Details updated successfully";

        if (state.token && state.orgId === updatedOrg?._id) {
            state.orgName = updatedOrg?.name || state.orgName;
            localStorage.setItem('org', JSON.stringify(updatedOrg));
            localStorage.setItem('orgName', updatedOrg?.name || '');
        }
        const index = state.list.findIndex(org => org._id === updatedOrg?._id);
        if (index !== -1) {
            state.list[index] = updatedOrg;
        }
      })
      .addCase(updateOrgDetails.rejected, (state, action) => {
        state.updateStatus = 'failed';
        state.updateError = typeof action.payload === 'string' ? action.payload : 'Update failed';
      })

      // Login Cases
      .addCase(loginOrganization.pending, (state) => {
        state.loading = true; // Use dedicated loading state
        state.authError = null;
        state.errorType = null;
        state.successMessage = null;
      })
      .addCase(loginOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrg = action.payload.org;
        state.token = action.payload.token;
        state.orgId = action.payload.orgId;
        state.orgName = action.payload.orgName;
        state.role = action.payload.role || "organization";
        state.authError = null; // Clear error on success
        state.errorType = null;
        state.successMessage = action.payload.message || "Login successful";
        localStorage.setItem('org', JSON.stringify(action.payload.org));
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('orgId', action.payload.orgId);
        localStorage.setItem('orgName', action.payload.orgName);
        localStorage.setItem('role', action.payload.role || "organization");
      })
      .addCase(loginOrganization.rejected, (state, action) => {
        state.loading = false;
        // Correctly handle the rejected payload which contains the error object
        if (action.payload && typeof action.payload === 'object') {
             state.authError = action.payload.message || 'Login failed. Please check credentials.'; // Store message string
             state.errorType = action.payload.errorType || null; // Store type string/null
        } else {
             state.authError = typeof action.payload === 'string' ? action.payload : 'An unknown error occurred during login.';
             state.errorType = null;
        }
        // Clear session state on login failure
        state.currentOrg = null;
        state.token = null;
        state.orgId = null;
        state.orgName = null;
        state.successMessage = null;
        localStorage.removeItem('org');
        localStorage.removeItem('token');
        localStorage.removeItem('orgId');
        localStorage.removeItem('orgName');
        localStorage.removeItem('role');
      })

      // Register Cases
      .addCase(registerOrganization.pending, (state) => {
        state.loading = true;
        state.authError = null;
        state.errorType = null;
        state.successMessage = null;
      })
      .addCase(registerOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Registration successful. Please wait for admin approval.";
        state.authError = null;
      })
      .addCase(registerOrganization.rejected, (state, action) => {
        state.loading = false;
         if (action.payload && typeof action.payload === 'object') {
             state.authError = action.payload.message || 'Registration failed.';
         } else {
             state.authError = typeof action.payload === 'string' ? action.payload : 'Registration failed due to an unknown error.';
         }
        state.errorType = null;
        state.successMessage = null;
      })

      // Forgot Password Cases
      .addCase(forgotPasswordOrganization.pending, (state) => {
        state.loading = true;
        state.authError = null;
        state.errorType = null;
        state.successMessage = null;
      })
      .addCase(forgotPasswordOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Password reset email sent successfully.";
      })
      .addCase(forgotPasswordOrganization.rejected, (state, action) => {
        state.loading = false;
        state.authError = typeof action.payload === 'string' ? action.payload : "Failed to send reset link";
        state.successMessage = null;
      })

      // Reset Password Cases
      .addCase(resetPasswordOrganization.pending, (state) => {
        state.loading = true;
        state.authError = null;
        state.errorType = null;
        state.successMessage = null;
      })
      .addCase(resetPasswordOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload || "Password reset successfully. You can now log in.";
      })
      .addCase(resetPasswordOrganization.rejected, (state, action) => {
        state.loading = false;
        state.authError = action.payload || "Failed to reset password";
        state.successMessage = null;
      })

      // Change Password Cases
      .addCase(changePasswordOrganization.pending, (state) => {
        state.loading = true;
        state.authError = null;
        state.errorType = null;
        state.successMessage = null;
      })
      .addCase(changePasswordOrganization.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message || "Password changed successfully.";
      })
      .addCase(changePasswordOrganization.rejected, (state, action) => {
        state.loading = false;
        state.authError = typeof action.payload === 'string' ? action.payload : "Failed to change password";
        state.successMessage = null;
      }).addCase(verifyOrganizationOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOrganizationOtp.fulfilled, (state) => {
        state.loading = false;
        state.isVerified = true;
      })
      .addCase(verifyOrganizationOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'OTP verification failed';
      });
  },
});

// --- Actions ---
export const {
    resetAuthState,
    logoutOrganization,
    addOrganization,
    removeOrganization,
    clearSuccessMessage,
    clearAuthError
} = organizationAuthSlice.actions;

// --- Selectors ---
export const selectOrgAuthLoading = (state) => state.organization.auth.loading; // Correct selector name
export const selectOrgAuthError = (state) => state.organization.auth.authError;
export const selectOrgAuthErrorType = (state) => state.organization.auth.errorType;
export const selectOrgAuthSuccessMessage = (state) => state.organization.auth.successMessage;
export const selectIsOrgAuthenticated = (state) => !!state.organization.auth.token;
export const selectCurrentOrganization = (state) => state.organization.auth.currentOrg;
export const selectOrganizationList = (state) => state.organization.auth.list;
export const selectOrganizationListStatus = (state) => state.organization.auth.listStatus;
export const selectOrganizationListError = (state) => state.organization.auth.listError;
export const selectCurrentOrgStatus = (state) => state.organization.auth.currentOrgStatus;
export const selectCurrentOrgError = (state) => state.organization.auth.currentOrgError;
export const selectOrgUpdateStatus = (state) => state.organization.auth.updateStatus;
export const selectOrgUpdateError = (state) => state.organization.auth.updateError;
export const selectOrgName = (state) => state.organization.auth.orgName;
export const selectOrgId = (state) => state.organization.auth.orgId;


// --- Reducer Export ---
export default organizationAuthSlice.reducer;






