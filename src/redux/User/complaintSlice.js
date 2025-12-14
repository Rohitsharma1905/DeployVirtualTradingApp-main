// complaintSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../utils/BaseUrl";

// Async Thunks

// Fetch all complaints for the user
export const fetchComplaint = createAsyncThunk(
  "complaint/fetchComplaint",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user._id : null;

      if (!token || !userId) {
        throw new Error("No token or userId found in localStorage");
      }

      const response = await axios.get(`${BASE_API_URL}/user/complaint/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.filter((complaint) => !complaint.isDeleted);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Submit new complaint
export const submitComplaint = createAsyncThunk(
  "complaint/submitComplaint",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}/user/complaint`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit complaint");
    }
  }
);

// Update existing complaint
export const updateComplaint = createAsyncThunk(
  "complaint/updateComplaint",
  async ({ complaintId, formData }, { rejectWithValue }) => {
    try {
      if (!complaintId) {
        throw new Error("Complaint ID is undefined");
      }
      const token = localStorage.getItem("token");
      const response = await axios.put(`${BASE_API_URL}/user/complaint/${complaintId}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update complaint");
    }
  }
);

// Delete complaint
export const deleteComplaint = createAsyncThunk(
  "complaint/deleteComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_API_URL}/user/complaint/${complaintId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return complaintId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Complaint Slice
const complaintSlice = createSlice({
  name: "complaint",
  initialState: {
    complaintList: [],
    status: "idle",
    error: null,
    formData: {
      userId: "",
      complaintCategory: "",
      complaintMessage: "",
      priority: "",
      attachments: [],
    },
    loading: false,
    isSuccess: false,
  },
  reducers: {
    setComplaintFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetComplaintForm: (state) => {
      state.formData = {
        userId: "",
        complaintCategory: "",
        complaintMessage: "",
        priority: "",
        attachments: [],
      };
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaint.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchComplaint.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.complaintList = action.payload;
      })
      .addCase(fetchComplaint.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(submitComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.complaintList.push(action.payload);
      })
      .addCase(submitComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComplaint.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaint.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        const index = state.complaintList.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.complaintList[index] = action.payload;
        }
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.complaintList = state.complaintList.filter((c) => c._id !== action.payload);
      });
  },
});

export const { setComplaintFormData, resetComplaintForm } = complaintSlice.actions;
export default complaintSlice.reducer;
