import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../utils/BaseUrl";

// Async Thunks

// Fetch all feedbacks for the user
export const fetchFeedback = createAsyncThunk(
  "feedback/fetchFeedback",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user ? user._id : null;

      if (!token || !userId) {
        throw new Error("No token or userId found in localStorage");
      }

      const response = await axios.get(`${BASE_API_URL}/user/feedback/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data.filter((feedback) => !feedback.isDeleted);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Submit new feedback
export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${BASE_API_URL}/user/feedback`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to submit feedback");
    }
  }
);

// Update existing feedback
export const updateFeedback = createAsyncThunk(
    "feedback/updateFeedback",
    async ({ feedbackId, formData }, { rejectWithValue }) => {
      try {
        if (!feedbackId) {
          throw new Error("Feedback ID is undefined");
        }
        console.log("Updating feedback with ID:", feedbackId);
        const token = localStorage.getItem("token");
        const response = await axios.put(`${BASE_API_URL}/user/feedback/${feedbackId}`, formData, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error("Error in updateFeedback:", error);
        return rejectWithValue(error.response?.data || "Failed to update feedback");
      }
    }
  );
  

// Delete feedback
export const deleteFeedback = createAsyncThunk(
  "feedback/deleteFeedback",
  async (feedbackId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_API_URL}/user/feedback/${feedbackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return feedbackId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Feedback Slice
const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    feedbackList: [],
    status: "idle",
    error: null,
    formData: {
      userId: "",
      feedbackCategory: "",
      feedbackMessage: "",
      rating: 0,
      recommend: false,
      suggestions: "",
    },
    loading: false,
    isSuccess: false,
  },
  reducers: {
    setFeedbackFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetFeedbackForm: (state) => {
      state.formData = {
        userId: "",
        feedbackCategory: "",
        feedbackMessage: "",
        rating: 0,
        recommend: false,
        suggestions: "",
      };
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.feedbackList = action.payload;
      })
      .addCase(fetchFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        state.feedbackList.push(action.payload); // Add new feedback to the list
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.isSuccess = true;
        const index = state.feedbackList.findIndex((fb) => fb._id === action.payload._id);
        if (index !== -1) {
          state.feedbackList[index] = action.payload; // Update feedback in the list
        }
      })
      .addCase(updateFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbackList = state.feedbackList.filter((feedback) => feedback._id !== action.payload);
      });
  },
});

export const { setFeedbackFormData, resetFeedbackForm } = feedbackSlice.actions;
export default feedbackSlice.reducer;
