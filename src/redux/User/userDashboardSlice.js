// redux/User/userStatsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/BaseUrl';
import toast from 'react-hot-toast';

// const user = JSON.parse(localStorage.getItem('user'));
// const userId = user._id;
// console.log(userId);



export const fetchUserStats = createAsyncThunk(
  'userStats/fetchAll',
  async (userId, { rejectWithValue }) => {
    try {
      const endpoints = [
        'users',
        'events',
        'feedback',
        'complaints',
        'queries',
        'subscription',
        'certificates',
        'participation'
      ];

      const requests = endpoints.map(endpoint => 
        axios.get(`${BASE_API_URL}/user/stats/${userId}/${endpoint}`)
        // axios.get(`${BASE_API_URL}/user/stats/${endpoint}`)

      );

      const responses = await Promise.all(requests);
      console.log(responses);
      return {
        user: responses[0].data.stats,
        events: responses[1].data.stats,
        feedback: responses[2].data.stats,
        complaints: responses[3].data.stats,
        queries: responses[4].data.stats,
        subscription:responses[5].data.stats,
        certificates:responses[6].data.stats,
        participation:responses[7].data.stats,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch user stats');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  stats: {
    user: {
      total: 0,
      active: 0,
      gender: '',
      age: 0,
      registrationDate: null
    },
    events: {
      total: 0,
      upcoming: 0,
      ongoing: 0,
      completed: 0
    },
    feedback: {
      total: 0,
      averageRating: 0,
      recommendationRate: 0,
      positive: 0,
      negative: 0
    },
    complaints: {
      total: 0,
      pending: 0,
      solved: 0,
      resolutionRate: 0
    },
    queries: {
      total: 0,
      responded: 0,
      responseRate: 0
    },

    subscription: {
      hasSubscription: false,
      plan: '',
      planPrice: 0,
      vertualAmount: 0,
      duration: '',
      daysRemaining: 0,
      status: '',
      paymentStatus: ''
    },

    // certificates: {
    //   totalCertificates:0,
    //   recentCertificates:0,
    //   certificatesWithRewards:0,
    //   certificatesByType:0,
    // },

    // participation: {
    //   totalParticipations:0, completedEvents:0, upcomingEvents:0, ongoingEvents:0, wonEvents:0
    // },
    


    // stocks: {
    //   all: totalStocks,
    //   nifty50: totalNifty50,
    //   nifty500: totalNifty500,
    //   etf: totalETF,
    // },
  },
  status: 'idle',
  error: null
};

const userStatsSlice = createSlice({
  name: 'userStats',
  initialState,
  reducers: {
    resetUserStats: (state) => {
      Object.assign(state, initialState);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload;
        state.error = null;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { resetUserStats } = userStatsSlice.actions;

export const selectUserStats = (state) => state?.user?.userDashboard?.stats;
export const selectUserStatsStatus = (state) => state?.user?.userDashboard?.status;
export const selectUserStatsError = (state) => state?.user?.userDashboard?.error;

export default userStatsSlice.reducer;






