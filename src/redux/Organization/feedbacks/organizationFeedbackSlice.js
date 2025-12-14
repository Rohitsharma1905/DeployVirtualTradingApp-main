import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import axiosInstance from "../../../utils/axiosConfig";

// export const fetchOrganizationUsersFeedbacks = createAsyncThunk(
//   "organizationUsersFeedbacks/fetchOrganizationUsersFeedbacks",
//   async ({ orgName, page, limit, search, startDate, endDate }) => {
//     const response = await axiosInstance.get(`${BASE_API_URL}/user/feedback/${orgName}/users/feedbacks`, {
//       params: { page, limit, search, startDate, endDate },
//     });
//     console.log(response.data);
//     return response.data;
//   }
// );

export const fetchOrganizationUsersFeedbacks = createAsyncThunk(
  "organizationUsersFeedbacks/fetchOrganizationUsersFeedbacks",
  async ({ orgName, page, limit, search, startDate, endDate }) => {
    const response = await axiosInstance.get(`${BASE_API_URL}/user/feedback/${orgName}/users/feedbacks`, {
      params: { page, limit, search, startDate, endDate },
    });
    console.log("API Response:", response.data); // Log API response
    console.log(`${BASE_API_URL}/user/feedback/${orgName}/users/feedbacks`)
    return response.data;
  }
);

export const deleteOrganizationUsersFeedback = createAsyncThunk(
  "organizationUsersFeedbacks/deleteOrganizationUsersFeedback",
  async (id) => {
    await axiosInstance.delete(`${BASE_API_URL}/user/feedback/delete/${id}`);
    return id;
  }
);

export const updateOrganizationUsersFeedback = createAsyncThunk(
  "organizationUsersFeedbacks/updateOrganizationUsersFeedback",
  async ({ id, feedbackData }) => {
    const response = await axiosInstance.put(`${BASE_API_URL}/user/feedback/update/feedbacks/${id}`, feedbackData);
    return response.data;
  }
);

export const updateOrganizationUsersFeedbackStatus = createAsyncThunk(
  "organizationUsersFeedbacks/updateOrganizationUsersFeedbackStatus",
  async ({ id, status }) => {
    const response = await axiosInstance.put(`${BASE_API_URL}/user/feedback/update/status/${id}`, { status });
    return response.data;
  }
);

const organizationUsersFeedbackSlice = createSlice({
  name: "organizationUsersFeedbacks",
  initialState: {
    feedbacks: [],
    loading: false,
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    searchTerm: "",
    startDate: null,
    endDate: null,
    error: null,
  },
  reducers: {
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
    clearFilters: (state) => {
      state.searchTerm = "";
      state.startDate = null;
      state.endDate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationUsersFeedbacks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizationUsersFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.feedbacks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchOrganizationUsersFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteOrganizationUsersFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter((feedback) => feedback._id !== action.payload);
      })
      .addCase(updateOrganizationUsersFeedback.fulfilled, (state, action) => {
        const updatedFeedback = action.payload.feedback;
        const index = state.feedbacks.findIndex((feedback) => feedback._id === updatedFeedback._id);
        if (index !== -1) {
          state.feedbacks[index] = updatedFeedback;
        }
      })
      .addCase(updateOrganizationUsersFeedbackStatus.fulfilled, (state, action) => {
        const updatedFeedback = action.payload.feedback;
        const index = state.feedbacks.findIndex((feedback) => feedback._id === updatedFeedback._id);
        if (index !== -1) {
          state.feedbacks[index].status = updatedFeedback.status;
        }
      });
  },
});

export const {
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  clearFilters,
} = organizationUsersFeedbackSlice.actions;

export default organizationUsersFeedbackSlice.reducer;






