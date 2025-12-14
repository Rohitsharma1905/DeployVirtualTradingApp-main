// src/redux/Common/etfSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../utils/BaseUrl";

// Thunk to fetch stock data
export const fetchStockData = createAsyncThunk(
  "etf/fetchStockData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/etfdata`);
      if (Array.isArray(response.data)) {
        return response.data;
      } else {
        return rejectWithValue("Invalid data format received");
      }
    } catch (error) {
      return rejectWithValue("Error fetching stock data");
    }
  }
);

// Thunk to fetch company details
export const fetchCompanyDetails = createAsyncThunk(
  "etf/fetchCompanyDetails",
  async ({ symbol, type }, { rejectWithValue }) => {
    try {
      const [companyResponse, historicalResponse] = await Promise.all([
        axios.get(`${BASE_API_URL}/admin/etf/${symbol}`),
        axios.get(`${BASE_API_URL}/admin/etf/historical/${symbol}?timeRange=1D`)
      ]);

      return {
        stockData: companyResponse.data,
        chartData: historicalResponse.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching company details");
    }
  }
);

const initialState = {
  stockData: [],
  loading: false,
  error: null,
  type: 'etf',
  companyDetails: {
    stockData: null,
    chartData: null,
    loading: false,
    error: null
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  },
  sortConfig: {
    key: null,
    direction: 'none'
  },
  searchTerm: '',
  selectedSymbol: null
};

const etfSlice = createSlice({
  name: "etf",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortConfig: (state, action) => {
      state.sortConfig = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1;
    },
    setSelectedSymbol: (state, action) => {
      state.selectedSymbol = action.payload;
    },
    resetCompanyDetails: (state) => {
      state.companyDetails = initialState.companyDetails;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.stockData = action.payload;
        state.pagination.totalItems = action.payload.length;
      })
      .addCase(fetchStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompanyDetails.pending, (state) => {
        state.companyDetails.loading = true;
        state.companyDetails.error = null;
      })
      .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
        state.companyDetails.loading = false;
        state.companyDetails.stockData = action.payload.stockData;
        state.companyDetails.chartData = action.payload.chartData;
      })
      .addCase(fetchCompanyDetails.rejected, (state, action) => {
        state.companyDetails.loading = false;
        state.companyDetails.error = action.payload;
      });
  }
});

export const {
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  setItemsPerPage,
  setSelectedSymbol,
  resetCompanyDetails
} = etfSlice.actions;

export default etfSlice.reducer;