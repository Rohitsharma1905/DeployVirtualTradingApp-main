import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_API_URL } from "../../utils/BaseUrl";

// Fetch user data
export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_API_URL}/user/profile`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const data = await response.json();
      return {
        name: data.user?.name || "",
        email: data.user?.email || "",
        mobile: data.user?.mobile || "",
        gender: data.user?.gender || "",
        dob: data.user?.dob ? data.user.dob.split("T")[0] : "",
        userPhoto:data.user?.userPhoto || "",
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_API_URL}/user/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Profile update failed");

      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Change user password
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(`${BASE_API_URL}/user/change-password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password change failed");

      return data.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete user profile
export const deleteUserProfile = createAsyncThunk(
  "user/deleteUserProfile",
      async (_, { rejectWithValue }) => {
      try {
      const token = localStorage.getItem("token");
 
        const response = await fetch(`${BASE_API_URL}/user/delete`, {
           method: "DELETE",
           headers: { 
           "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
     });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Profile deletion failed");

      return data.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// const userprofileSlice = createSlice({
//   name: "user",
//   initialState: {
//     userData: null,
//     loading: false,
//     error: null,
//     deleteMessage: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUserData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userData = action.payload;
//       })
//       .addCase(fetchUserData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(updateUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userData = action.payload;
//       })
//       .addCase(updateUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "failed to update profile";
//       })
//       .addCase(deleteUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteUserProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.userData = null;
//         state.deleteMessage = action.payload;
//       })
//       .addCase(deleteUserProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });
const userprofileSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    loading: false,
    error: null,
    deleteMessage: null,
    passwordChangeMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.passwordChangeMessage = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordChangeMessage = action.payload;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = null;
        state.deleteMessage = action.payload;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userprofileSlice.reducer;
