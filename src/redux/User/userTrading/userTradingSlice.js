// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { BASE_API_URL } from '../../../utils/BaseUrl';

// // Async thunks
// export const buyStock = createAsyncThunk(
//   'trading/buyStock',
//   async (orderDetails, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_API_URL}/user/transactions/buy`, orderDetails);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const sellStock = createAsyncThunk(
//   'trading/sellStock',
//   async (orderDetails, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${BASE_API_URL}/user/transactions/sell`, orderDetails);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// export const getTransactionHistory = createAsyncThunk(
//   'trading/getTransactionHistory',
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_API_URL}/user/transactions/history/${userId}`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   balance: 1000000,
//   holdings: 0,
//   transactions: [],
//   loading: false,
//   error: null,
//   success: false,
// };

// // Slice
// const tradingSlice = createSlice({
//   name: 'trading',
//   initialState,
//   reducers: {
//     setBalance: (state, action) => {
//       state.balance = action.payload;
//     },
//     resetState: () => initialState,
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = false;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Buy stock
//       .addCase(buyStock.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(buyStock.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.balance -= action.payload.total;
//         state.holdings += action.payload.quantity;
//         state.transactions.push(action.payload);
//       })
//       .addCase(buyStock.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to buy stock';
//       })

//       // Sell stock
//       .addCase(sellStock.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sellStock.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.balance += action.payload.total;
//         state.holdings -= action.payload.quantity;
//         state.transactions.push(action.payload);
//       })
//       .addCase(sellStock.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to sell stock';
//       })

//       // Get transaction history
//       .addCase(getTransactionHistory.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getTransactionHistory.fulfilled, (state, action) => {
//         state.loading = false;
//         state.transactions = action.payload.data;
//       })
//       .addCase(getTransactionHistory.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload?.message || 'Failed to fetch transaction history';
//       });
//   },
// });

// // Export actions
// export const { setBalance, resetState, clearError, clearSuccess } = tradingSlice.actions;

// // Export reducer
// export default tradingSlice.reducer;