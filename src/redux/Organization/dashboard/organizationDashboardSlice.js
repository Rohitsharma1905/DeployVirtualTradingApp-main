
// // new refresh vesion
// working version

// // organizationDashboardSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl";
// import toast from "react-hot-toast";

// // Async Thunk for Fetching Dashboard Data
// export const fetchDashboardData = createAsyncThunk(
//   "organizationDashboard/fetchDashboardData",
//   async (orgName, { rejectWithValue }) => {
//     try {
//       const [
//         totalUsersRes,
//         newUsersLastWeekRes,
//         maleUsersRes,
//         femaleUsersRes,
//         activeUsersRes,
//         deactiveUsersRes,
//         averageUserAgeRes,
//         totalOrganizationRes
//       ] = await Promise.all([
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/total`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/new-week`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/male`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/female`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/active`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/deactive`),
//         axios.get(`${BASE_API_URL}/organization/${orgName}/users/count/average-age`),
//         axios.get(`${BASE_API_URL}/organization/organizationCount/total`),
//       ]);

//       return {
//         totalUsers: totalUsersRes.data.count,
//         newUsersLastWeek: newUsersLastWeekRes.data.count,
//         maleUsers: maleUsersRes.data.count,
//         femaleUsers: femaleUsersRes.data.count,
//         activeUsers: activeUsersRes.data.count,
//         deactiveUsers: deactiveUsersRes.data.count,
//         averageUserAge: averageUserAgeRes.data.averageAge,
//         totalOrganizations:totalOrganizationRes.data.count
//       };
//     } catch (error) {
//       toast.error(error.response?.data?.msg || "Failed to fetch dashboard data.");
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   totalUsers: 0,
//   totalOrganizations:0,
//   newUsersLastWeek: 0,
//   maleUsers: 0,
//   femaleUsers: 0,
//   activeUsers: 0,
//   deactiveUsers: 0,
//   averageUserAge: 0,
//   loading: false,
//   error: null,
// };

// // Slice
// const organizationDashboardSlice = createSlice({
//   name: "organizationDashboard",
//   initialState,
//   reducers: {
//     resetDashboardState: (state) => {
//       state.totalUsers = 0;
//       state.totalOrganizations = 0;
//       state.newUsersLastWeek = 0;
//       state.maleUsers = 0;
//       state.femaleUsers = 0;
//       state.activeUsers = 0;
//       state.deactiveUsers = 0;
//       state.averageUserAge = 0;
//       state.loading = false;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch Dashboard Data
//       .addCase(fetchDashboardData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         state.loading = false;
//         state.totalUsers = action.payload.totalUsers;
//         state.newUsersLastWeek = action.payload.newUsersLastWeek;
//         state.maleUsers = action.payload.maleUsers;
//         state.femaleUsers = action.payload.femaleUsers;
//         state.activeUsers = action.payload.activeUsers;
//         state.deactiveUsers = action.payload.deactiveUsers;
//         state.averageUserAge = action.payload.averageUserAge;
//         state.totalOrganizations = action.payload.totalOrganizations;

//       })
//       .addCase(fetchDashboardData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload.message;
//       });
//   },
// });

// export const { resetDashboardState } = organizationDashboardSlice.actions;
// export default organizationDashboardSlice.reducer;







// deepseek admin version

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { BASE_API_URL } from '../../../utils/BaseUrl';
// import toast from 'react-hot-toast';

// export const fetchOrganizationDashboardStats = createAsyncThunk(
//   'organizationDashboard/fetchStats',
//   async (organizationId, { rejectWithValue }) => {
//     try {
//       const endpoints = [
//         'users',
//         'events',
//         'feedback',
//         'complaints'
//       ];

//       const requests = endpoints.map(endpoint => 
//         axios.get(`${BASE_API_URL}/organization/stats/${endpoint}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`
//           }
//         })
//       );

//       const responses = await Promise.all(requests);

//       const stats = {
//         users: responses[0].data.stats,
//         events: responses[1].data.stats,
//         feedback: responses[2].data.stats,
//         complaints: responses[3].data.stats
//       };
      
//       return stats;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to fetch organization dashboard stats');
//       return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
//     }
//   }
// );

// const initialState = {
//   stats: {
//     users: {
//       total: 0,
//       male: 0,
//       female: 0,
//       active: 0,
//       deactive: 0,
//       averageAge: 0
//     },
//     events: {
//       total: 0,
//       upcoming: 0,
//       completed: 0,
//       ongoing: 0
//     },
//     feedback: {
//       total: 0,
//       averageRating: 0,
//       recommendationRate: 0,
//       ratingDistribution: [0, 0, 0, 0, 0],
//       recentFeedbacks: []
//     },
//     complaints: {
//       total: 0,
//       pending: 0,
//       resolved: 0,
//       resolutionRate: 0,
//       recentComplaints: []
//     }
//   },
//   status: 'idle',
//   error: null
// };

// const organizationDashboardSlice = createSlice({
//   name: 'organizationDashboard',
//   initialState,
//   reducers: {
//     clearOrganizationError: (state) => {
//       state.error = null;
//     },
//     resetOrganizationStats: (state) => {
//       state.stats = initialState.stats;
//       state.status = 'idle';
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchOrganizationDashboardStats.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchOrganizationDashboardStats.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.stats = action.payload;
//         state.error = null;
//       })
//       .addCase(fetchOrganizationDashboardStats.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   }
// });

// export const { 
//   clearOrganizationError, 
//   resetOrganizationStats 
// } = organizationDashboardSlice.actions;

// export const selectOrganizationStats = (state) => state.organizationDashboard.stats;
// export const selectOrganizationStatus = (state) => state.organizationDashboard.status;
// export const selectOrganizationError = (state) => state.organizationDashboard.error;

// export default organizationDashboardSlice.reducer;







// user detail in one ----

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import toast from "react-hot-toast";

// Async Thunk for Fetching All Dashboard Data
export const fetchOrganizationDashboardData = createAsyncThunk(
  "organizationDashboard/fetchDashboardData",
  async (orgName, { rejectWithValue }) => {
    try {
      const [users, events, feedback, complaints, userFeedbacks, userQueries, stocks, gallery, eventParticipation, trading,userComplaints] = await Promise.all([
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/users`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/events`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/feedback`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/complaints`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/user-feedbacks`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/user-queries`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/stocks`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/gallery`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/event-participation`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/trading`),
        axios.get(`${BASE_API_URL}/organization/${orgName}/stats/user-complaints`) 
      ]);

      console.log([users, events, feedback, complaints, userFeedbacks, userQueries, stocks, gallery, eventParticipation, trading, userComplaints  ]);

      return {
        userStats: users.data.stats,
        eventStats: events.data.stats,
        feedbackStats: feedback.data.stats,
        complaintStats: complaints.data.stats,
        organizationUserFeedbacksStats:userFeedbacks.data.stats,
        organizationUserQueriesStats:userQueries.data.stats,
        stocksStats:stocks.data.stats,
        galleryStats:gallery.data.stats,
        eventParticipationStats: eventParticipation.data.stats, // Add new data
        tradingStats: trading.data.stats,  
        userComplaintStats: userComplaints.data.stats,
      };
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  // User Stats
  userStats: {
    total: 0,
    male: 0,
    female: 0,
    active: 0,
    deactive: 0,
    averageAge: 0,
    newUsersLastWeek: 0
  },
  // Event Stats
  eventStats: {
    total: 0,
    upcoming: 0,
    completed: 0,
    ongoing: 0,
  },
  // Feedback Stats
  feedbackStats: {
    total: 0,
    averageRating: 0,
    recommendationRate: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
    recentFeedbacks: [],
  },
  // Complaint Stats
  complaintStats: {
    total: 0,
    pending: 0,
    resolved: 0,
    resolutionRate: 0,
    recentComplaints: [],
  },

  // user feedabacks stats

  organizationUserFeedbacksStats:{
    total: 0,
    averageRating: 0,
    recommendationRate: 0,
    participationRate:0,
    ratingDistribution: 0,
    topFeedbackUsers: 0,
    recentFeedbacks:0,
  },

  organizationUserQueriesStats:{
   total: 0,
  responseRate:0,
  },

  stocksStats: {
    all: 0,
    nifty50: 0,
    nifty500: 0,
    etf: 0
  },
  galleryStats:{
    total:0,          // Total gallery items (including deleted)
    active:0,         // Currently active items
    deleted:0,        // Soft-deleted items
    byCategory:0,
    totalCategories:0,
    totalPhotos:0  
  },

  eventParticipationStats: {
    participatingUsers: 0,
    participationRate: 0,
    certificatesIssued: 0,
  },

  // NEW: Trading Stats
  tradingStats: {
    totalTrades: 0,
  },

  userComplaintStats: {
    total: 0,
    pending: 0,
    resolved: 0,
    resolutionRate: 0,
    recentUserComplaints: [], // Renamed for clarity
  },

  loading: false,
  error: null,
};

// Slice
const organizationDashboardSlice = createSlice({
  name: "organizationDashboard",
  initialState,
  reducers: {
    resetDashboardState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganizationDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload.userStats;
        state.eventStats = action.payload.eventStats;
        state.feedbackStats = action.payload.feedbackStats;
        state.complaintStats = action.payload.complaintStats;
        state.organizationUserFeedbacksStats = action.payload.organizationUserFeedbacksStats;
        state.organizationUserQueriesStats = action.payload.organizationUserQueriesStats;
        state.stocksStats = action.payload.stocksStats;
        state.galleryStats = action.payload.galleryStats;
        state.eventParticipationStats = action.payload.eventParticipationStats;
        state.tradingStats = action.payload.tradingStats;
        state.userComplaintStats = action.payload.userComplaintStats; 
      })
      .addCase(fetchOrganizationDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch dashboard data";
      });
  },
});

export const { resetDashboardState } = organizationDashboardSlice.actions;
export default organizationDashboardSlice.reducer;