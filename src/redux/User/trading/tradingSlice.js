import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../../utils/BaseUrl';

const calculateAnalytics = (transactions = [], holdings = [], currentPrice = 0) => {
  if (!transactions.length || !holdings?.length) {
    return {
      totalInvestment: 0,
      currentHoldingsValue: 0,
      realizedPL: 0,
      realizedPLPercentage: 0,
      buyTrades: 0,
      sellTrades: 0,
      successRate: 0,
      totalHoldingsValue: 0
    };
  }

  try {
    const buyTransactions = transactions.filter(t => t.type === 'buy');
    const sellTransactions = transactions.filter(t => t.type === 'sell');

    const buyTrades = buyTransactions.reduce((total, transaction) => 
      total + (transaction.numberOfShares || 0), 0);
    
    const sellTrades = sellTransactions.reduce((total, transaction) => 
      total + (transaction.numberOfShares || 0), 0);

    const totalInvestment = holdings.reduce((sum, holding) => 
      sum + ((holding.quantity || 0) * (holding.averageBuyPrice || 0)), 0);

    const totalHoldingsValue = holdings.reduce((sum, holding) => 
      sum + ((holding.quantity || 0) * (currentPrice || (holding.averageBuyPrice || 0))), 0);

    const realizedPL = sellTransactions.reduce((sum, trade) => {
      const buyPrice = buyTransactions.find(bt => bt.companySymbol === trade.companySymbol)?.price || 0;
      return sum + ((trade.price - buyPrice) * (trade.numberOfShares || 0));
    }, 0);

    const currentHoldingsValue = holdings.reduce((sum, holding) => 
      sum + ((holding.quantity || 0) * (currentPrice || 0)), 0);

    const successfulTrades = sellTransactions.filter(trade => {
      const buyPrice = buyTransactions.find(bt => bt.companySymbol === trade.companySymbol)?.price || 0;
      return (trade.price || 0) > buyPrice;
    }).length;

    const successRate = sellTransactions.length > 0
      ? (successfulTrades / sellTransactions.length) * 100
      : 0;

    return {
      totalInvestment,
      currentHoldingsValue,
      realizedPL,
      realizedPLPercentage: totalInvestment > 0 
        ? (realizedPL / totalInvestment) * 100 
        : 0,
      buyTrades,
      sellTrades,
      successRate,
      totalHoldingsValue
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return {
      totalInvestment: 0,
      currentHoldingsValue: 0,
      realizedPL: 0,
      realizedPLPercentage: 0,
      buyTrades: 0,
      sellTrades: 0,
      successRate: 0,
      totalHoldingsValue: 0
    };
  }
};

const initialState = {
  transactions: [],
  holdings: [],
  loading: {
    general: false,
    trading: false
  },
  error: null,
  orderStatus: null,
  statistics: {
    totalInvestment: 0,
    currentHoldingsValue: 0,
    realizedPL: 0,
    realizedPLPercentage: 0,
    buyTrades: 0,
    sellTrades: 0,
    successRate: 0,
    totalHoldingsValue: 0
  }
};

export const fetchHoldings = createAsyncThunk(
  'trading/fetchHoldings',
  async ({ userId, subscriptionPlanId }, { rejectWithValue }) => {
    try {
      if (!userId || !subscriptionPlanId) {
        throw new Error('User ID and Subscription Plan ID are required');
      }

      const response = await axios.get(
        `${BASE_API_URL}/user/trading/holdings/${userId}/${subscriptionPlanId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch holdings'
      );
    }
  }
);
export const placeOrder = createAsyncThunk(
  'trading/placeOrder',
  async (orderDetails, { rejectWithValue }) => {
    try {
      const requiredFields = [
        'userId', 
        'subscriptionPlanId', 
        'symbol', 
        'type', 
        'numberOfShares', 
        'price', 
        'stockType'
      ];
      
      // Validate stockType specifically
      if (!orderDetails.stockType || !['nifty50', 'nifty500', 'etf'].includes(orderDetails.stockType)) {
        throw new Error('Valid stockType is required (nifty50, nifty500, or etf)');
      }

      const missingFields = requiredFields.filter(field => !orderDetails[field]);
      
      if (missingFields.length) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const response = await axios.post(
        `${BASE_API_URL}/user/trading/trade`, 
        orderDetails
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || 
        error.message || 
        'Failed to place order'
      );
    }
  }
);

export const fetchTransactionHistory = createAsyncThunk(
  'trading/fetchHistory',
  async ({ userId, symbol, eventId }, { rejectWithValue }) => {
    try {
      let url = `${BASE_API_URL}/user/trading/history/${userId}`;
      
      const params = new URLSearchParams();
      if (symbol) params.append('symbol', symbol);
      if (eventId) params.append('eventId', eventId);
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url);
      return {
        transactions: response.data.transactions || [],
        holdings: response.data.holdings || []
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Failed to fetch trading history'
      );
    }
  }
);

export const fetchEventSpecificTransactions = createAsyncThunk(
  'trading/fetchEventSpecificTransactions',
  async ({ userId, eventId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/user/${eventId}/transactions/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const tradingSlice = createSlice({
  name: 'trading',
  initialState,
  reducers: {
    clearOrderStatus: (state) => {
      state.orderStatus = null;
      state.error = null;
    },
    updateStatistics: (state, action) => {
      state.statistics = calculateAnalytics(
        state.transactions,
        state.holdings,
        action.payload
      );
    },
    updateHoldings: (state, action) => {
      state.holdings = Array.isArray(action.payload) ? action.payload : [];
      state.statistics = calculateAnalytics(
        state.transactions,
        state.holdings,
        action.payload.currentPrice
      );
    },
    resetTradingState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoldings.pending, (state) => {
        state.loading.general = true;
      })
      .addCase(fetchHoldings.fulfilled, (state, action) => {
        state.loading.general = false;
        state.holdings = Array.isArray(action.payload) ? action.payload : [];
        state.statistics = calculateAnalytics(
          state.transactions,
          state.holdings
        );
      })
      .addCase(fetchHoldings.rejected, (state, action) => {
        state.loading.general = false;
        state.error = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.loading.trading = true;
        state.error = null;
        state.orderStatus = 'pending';
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading.trading = false;
        state.orderStatus = 'success';
        
        if (!Array.isArray(state.transactions)) {
          state.transactions = [];
        }
        
        if (action.payload.transaction) {
          state.transactions = [action.payload.transaction, ...state.transactions];
        }
        
        state.holdings = action.payload.holdings || [];
        state.statistics = calculateAnalytics(
          state.transactions,
          state.holdings,
          action.payload.currentPrice
        );
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading.trading = false;
        state.error = action.payload;
        state.orderStatus = 'failed';
      })
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading.general = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading.general = false;
        state.transactions = action.payload.transactions;
        state.holdings = action.payload.holdings;
        state.statistics = calculateAnalytics(
          action.payload.transactions,
          action.payload.holdings
        );
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading.general = false;
        state.error = action.payload;
      })
      .addCase(fetchEventSpecificTransactions.pending, (state) => {
        state.loading.general = true;
      })
      .addCase(fetchEventSpecificTransactions.fulfilled, (state, action) => {
        state.loading.general = false;
        state.transactions = action.payload.transactions;
        state.holdings = action.payload.holdings;
        state.statistics = calculateAnalytics(
          action.payload.transactions,
          action.payload.holdings
        );
      })
      .addCase(fetchEventSpecificTransactions.rejected, (state, action) => {
        state.loading.general = false;
        state.error = action.payload;
      });
  }
});

// Selectors
export const selectTransactions = (state) => 
  Array.isArray(state.user.tradingModal.transactions) ? 
    state.user.tradingModal.transactions : 
    [];

export const selectFilteredTransactions = createSelector(
  [selectTransactions, (state, filters) => filters],
  (transactions, filters) => {
    const { symbol, eventId } = filters || {};
    
    return transactions.filter(transaction => {
      const symbolMatch = symbol 
        ? transaction.companySymbol?.toLowerCase() === symbol.toLowerCase()
        : true;
      
      const eventMatch = eventId === 'none'
        ? !transaction.eventId
        : eventId
          ? transaction.eventId === eventId
          : true;
      
      return symbolMatch && eventMatch;
    });
  }
);

export const selectHoldings = (state) => 
  Array.isArray(state.user.tradingModal.holdings) ? 
    state.user.tradingModal.holdings : 
    [];

export const selectTotalHoldingsValue = createSelector(
  [selectHoldings],
  (holdings) => {
    if (!Array.isArray(holdings)) return 0;
    return holdings.reduce((total, holding) => {
      const quantity = Number(holding.quantity) || 0;
      const avgPrice = Number(holding.averageBuyPrice) || 0;
      return total + (quantity * avgPrice);
    }, 0);
  }
);
export const selectStatistics = (state) => state.user.tradingModal.statistics;

export const selectLoadingState = createSelector(
  [(state) => state.user.tradingModal],
  (tradingModal) => ({
    loading: tradingModal.loading.general || tradingModal.loading.trading || false,
    orderStatus: tradingModal.orderStatus || null
  })
);

export const selectError = (state) => state.user.tradingModal.error;

export const selectHoldingBySymbol = createSelector(
  [selectHoldings, (state, symbol) => symbol],
  (holdings, symbol) => holdings.find(h => 
    h.companySymbol?.toLowerCase() === symbol?.toLowerCase()
  )
);

export const { 
  clearOrderStatus, 
  updateStatistics,
  updateHoldings,
  resetTradingState 
} = tradingSlice.actions;

export default tradingSlice.reducer;