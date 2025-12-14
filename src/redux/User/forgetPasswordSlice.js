import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../utils/BaseUrl";

// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/auth/forgot-password`, { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send reset link. Please try again."
      );
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/auth/reset-password/${token}`, {
        newPassword,
        confirmPassword,
      });
      return response.data.message;
    } catch (error) {
      let errorMessage = "Failed to reset password. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid or expired reset link.";
      } else if (error.response?.status === 404) {
        errorMessage = "User not found.";
      }

      return rejectWithValue(errorMessage);
    }
  }
);

// Verify Reset Token
export const verifyResetToken = createAsyncThunk(
  "auth/verifyResetToken",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/auth/verify-reset-token/${token}`);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset link has expired. Please request a new one."
      );
    }
  }
);

// Forget Password Slice
const forgetPasswordSlice = createSlice({
  name: "forgetPassword",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    status: "idle",
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
    tokenValid: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null; // Clear error when needed
    },
  },
  extraReducers: (builder) => {
    builder
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Verify Reset Token
       .addCase(verifyResetToken.pending, (state) => {
         state.status = "loading";
         state.error = null;
         state.tokenValid = null;
      })
       .addCase(verifyResetToken.fulfilled, (state, action) => {
         state.status = "succeeded";
         state.tokenValid = true;
      })
       .addCase(verifyResetToken.rejected, (state, action) => {
         state.status = "failed";
         state.tokenValid = false;
         state.error = action.payload;
     });
  },
});

export const { logout, clearError } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
