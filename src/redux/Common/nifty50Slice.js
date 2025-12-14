import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/BaseUrl';

export const fetchNiftyData = createAsyncThunk(
  'nifty50/fetchNiftyData',
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/nifty/data`, {
        params: { page, limit, search },
        timeout: 5000
      });
      const stocks = response.data.data[0]?.stocks || [];
      return stocks;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);

export const fetchCompanyDetails = createAsyncThunk(
  'nifty50/fetchCompanyDetails',
  async ({ symbol }, { rejectWithValue }) => { // Changed to expect an object with symbol
    try {
      const response = await axios.get(`${BASE_API_URL}/admin/nifty/company/${symbol}`);
      return {
        stockData: response.data,
        chartData: null
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch company details');
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
  type: 'nifty50',
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

const nifty50Slice = createSlice({
  name: 'nifty50',
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
      .addCase(fetchNiftyData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNiftyData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.pagination.totalItems = action.payload.length || 0;
      })
      .addCase(fetchNiftyData.rejected, (state, action) => {
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
} = nifty50Slice.actions;

export default nifty50Slice.reducer;