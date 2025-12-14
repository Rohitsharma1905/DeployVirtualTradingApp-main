import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import axiosInstance from "../../../utils/axiosConfig";


// Fetch organization complaints
export const fetchOrganizationComplaints = createAsyncThunk(
    "complaints/fetchOrganizationComplaints",
    async ({ orgName, page, limit, search, startDate, endDate }) => {
      const response = await axiosInstance.get(`${BASE_API_URL}/user/complaint/${orgName}/complaint`, {
        params: { page, limit, search, startDate, endDate },
      });
      console.log(response.data);
      return response.data;
    }
  );
  
  // Register organization complaint
  export const registerOrganizationComplaint = createAsyncThunk(
    "complaints/registerOrganizationComplaint",
    async (complaintData, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(`${BASE_API_URL}/user/complaint/register`, complaintData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Update organization complaint
  export const updateOrganizationComplaint = createAsyncThunk(
    "complaints/updateOrganizationComplaint",
    async ({ complaintId, complaintData }, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.put(`${BASE_API_URL}/user/complaint/update/${complaintId}`, complaintData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  // Delete organization complaint
  export const deleteOrganizationComplaint = createAsyncThunk(
    "complaints/deleteOrganizationComplaint",
    async (complaintId, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.delete(`${BASE_API_URL}/user/complaint/delete/${complaintId}`);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);
      }
    }
  );
  
  const complaintsSlice = createSlice({
    name: "complaints",
    initialState: {
      complaints: [],
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
        .addCase(fetchOrganizationComplaints.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchOrganizationComplaints.fulfilled, (state, action) => {
          state.loading = false;
          state.complaints = action.payload.complaints;
          state.totalPages = action.payload.totalPages;
          state.currentPage = action.payload.currentPage;
        })
        .addCase(fetchOrganizationComplaints.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        })
        .addCase(registerOrganizationComplaint.pending, (state) => {
          state.loading = true;
        })
        .addCase(registerOrganizationComplaint.fulfilled, (state, action) => {
          state.loading = false;
          state.complaints.unshift(action.payload.complaint);
        })
        .addCase(registerOrganizationComplaint.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload.message;
        })
        .addCase(updateOrganizationComplaint.fulfilled, (state, action) => {
          const updatedComplaint = action.payload.complaint;
          const index = state.complaints.findIndex((c) => c._id === updatedComplaint._id);
          if (index !== -1) {
            state.complaints[index] = updatedComplaint;
          }
        })
        .addCase(deleteOrganizationComplaint.fulfilled, (state, action) => {
          state.complaints = state.complaints.filter((c) => c._id !== action.payload);
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
  } = complaintsSlice.actions;
  
  export default complaintsSlice.reducer;
  