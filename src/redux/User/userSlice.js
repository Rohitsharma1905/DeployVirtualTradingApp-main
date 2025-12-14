// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';
// import { BASE_API_URL } from '../../utils/BaseUrl';
// import toast from 'react-hot-toast';

// // Async Thunk for fetching users
// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_API_URL}/user/display-users`);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || 'Failed to fetch users');
//     }
//   }
// );

// export const fetchUsers = createAsyncThunk(
//   'users/fetchUsers',
//   async (_, { rejectWithValue }) => {
//     try {
//       const [usersRes, maleCountRes, femaleCountRes, activeCountRes, inactiveCountRes, averageAgeRes, totalCountRes,  totalOrganizationRes, totalOrganizationUsersRes, totalMaleRes, totalFemaleRes, totalActiveRes, totalInactiveRes, organizationAvgAgeRes] = await Promise.all([
//         axios.get(`${BASE_API_URL}/user/display-users`),
//         axios.get(`${BASE_API_URL}/user/userCount/male`),
//         axios.get(`${BASE_API_URL}/user/userCount/female`),
//         axios.get(`${BASE_API_URL}/user/userCount/active`),
//         axios.get(`${BASE_API_URL}/user/userCount/deactive`),
//         axios.get(`${BASE_API_URL}/user/userCount/averageAge`),
//         axios.get(`${BASE_API_URL}/user/userCount/total`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/total`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/totalUsers`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/male`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/female`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/active`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/deactive`),
//         axios.get(`${BASE_API_URL}/user/organizationCount/averageAge`),

//       ]);

//       return {
//         users: usersRes.data,
//         maleCount: maleCountRes.data.count,
//         femaleCount: femaleCountRes.data.count,
//         activeCount: activeCountRes.data.count,
//         inactiveCount: inactiveCountRes.data.count,
//         averageAge: averageAgeRes.data.averageAge,
//         totalUserCount:totalCountRes.data.count,
//         totalOrganizations:totalOrganizationRes.data.count,
//         // totalEvents:totalEventsRes.data.count

//         totalOrganizationCount:totalOrganizationRes.count,
//         totalOrganizationMaleCount:totalOrganizationRes.count,
//         totalOrganizationFemaleCount:totalOrganizationRes.count,
//         totalOrganizationActiveCount:totalOrganizationRes.count,
//         totalOrganizationInactiveCount:totalOrganizationRes.count,
//         totalOrganizationAverageAge:totalOrganizationRes.averageAge,

//       };
//     } catch (error) {
//       toast.error(error.response?.data?.msg || 'Failed to fetch users');
//       return rejectWithValue(error.response?.data || 'Failed to fetch users');
//     }
//   }
// );

// // Initial state
// const initialState = {
//   list: [],
//   status: 'idle',
//   error: null,
//   // totalUsers: 0,
//   // activeUsers: 0,
//   // maleUsers: 0,
//   // femaleUsers: 0
//   totalUsers: 0,
//   // totalOrganizations:0,
//   // totalEvents:0,
//   activeUsers: 0,
//   inactiveUsers: 0,
//   maleUsers: 0,
//   femaleUsers: 0,
//   averageUserAge: 0,


//   // organization

//   totalOrganizations:0,
//   totalOrganizationUsers:0,
//   totalOrganizationMaleUsers:0,
//   totalOrganizationFemaleUsers:0,
//   totalOrganizationActiveUsers:0,
//   totalOrganizationInactiveUsers:0,
//   totalOrganizationAverageUserAge:0,
// };

// // Slice
// const userSlice = createSlice({
//   name: 'users',
//   initialState,
//   reducers: {
//     addUser: (state, action) => {
//       state.list.push(action.payload);
//       state.totalUsers = state.list.length;
//     },
//     updateUserStatus: (state, action) => {
//       const { userId, status } = action.payload;
//       const user = state.list.find(u => u._id === userId);
//       if (user) {
//         user.status = status;
//         state.activeUsers = state.list.filter(u => u.status === 'active').length;
//         state.inactiveUsers = state.list.filter(u => u.status === 'inactive').length;
//       }
//     },
//     clearError: (state) => {
//       state.error = null;
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.status = 'loading';
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.list = action.payload;
//         // state.totalUsers = action.payload.length;
//         // state.activeUsers = action.payload.filter(user => user.status === 'active').length;
//         // added by abhishek
//         state.activeUsers = action.payload.activeCount;
//         state.inactiveUsers = action.payload.inactiveCount;
//         state.maleUsers = action.payload.maleCount;
//         state.femaleUsers = action.payload.femaleCount;
//         state.averageUserAge = action.payload.averageAge;
//         state.totalUsers = action.payload.totalUserCount
//         state.totalOrganizations = action.payload.totalOrganizations;
//         state.totalEvents = action.payload.totalEvents;
//         // till this point


//         // organization counts

//         state.totalOrganizations = action.payload.totalOrganizationCount;
//         state.totalOrganizationMaleUsers = action.payload.totalOrganizationMaleCount;
//         state.totalOrganizationFemaleUsers = action.payload.totalOrganizationFemaleCount;
//         state.totalOrganizationActiveUsers = action.payload.totalOrganizationActiveCount;
//         state.totalOrganizationInactiveUsers = action.payload.totalOrganizationInactiveCount;
//         state.totalOrganizationAverageUserAge = action.payload.totalOrganizationAverageAge;
//         state.error = null;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       });
//   }
// });

// // Selectors
// export const selectUserCount = (state) => {
//   const listCount = state.admin?.registeredUsersTable?.list?.length || 0;
//   const userCount = state.user?.list?.length || 0;
//   return Math.max(listCount, userCount);
// };

// export const selectActiveUserCount = (state) => {
//   const adminUsers = state.admin?.registeredUsersTable?.list || [];
//   const users = state.user?.list || [];
//   const adminActiveCount = adminUsers.filter(user => user.status === 'active').length;
//   const userActiveCount = users.filter(user => user.status === 'active').length;
//   return Math.max(adminActiveCount, userActiveCount);
// };

// // added by me ----
// export const selectActiveUserCounts = (state) => state.user?.activeUsers || 0;
// export const selectInactiveUserCount = (state) => state.user?.inactiveUsers || 0;
// export const selectMaleUserCount = (state) => state.user?.maleUsers || 0;
// export const selectFemaleUserCount = (state) => state.user?.femaleUsers || 0;
// export const selectAverageUserAge = (state) => state.user?.averageUserAge || 0;
// export const selectTotalUser = (state) => state.user?.totalUsers ?? 0;
// export const selectTotalOrganization = (state) => state.user?.totalOrganizations ?? 0;
// export const selectTotalEvent = (state) => state.user?.totalEvents ?? 0;




// export const selectUsers = state => state.user?.list ?? [];
// export const selectUserStatus = state => state.user?.status ?? 'idle';
// export const selectUserError = state => state.user?.error ?? null;
// export const selectTotalUsers = state => state.user?.totalUsers ?? 0;

// // Export actions
// export const { addUser, updateUserStatus, clearError } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_API_URL } from '../../utils/BaseUrl';
import toast from 'react-hot-toast';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const endpoints = [
        'users',
        'organizations',
        'events',
        'feedback',
        'queries',
        'complaints',
        'stocks',
        'gallery'
      ];

      const requests = endpoints.map(endpoint => 
        axios.get(`${BASE_API_URL}/admin/stats/${endpoint}`)
      );

      const responses = await Promise.all(requests);

      const stats = {
        users: responses[0].data.stats,
        organizations: responses[1].data.stats,
        events: responses[2].data.stats,
        feedback: responses[3].data.stats,
        queries: responses[4].data.stats,
        complaints:responses[5].data.stats,
        stocks:responses[6].data.stats,
        gallery:responses[7].data.stats
      };
      console.log(stats);
      
      return stats;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard stats');
      return rejectWithValue(error.response?.data || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/display-users`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);

const initialState = {
  dashboardStats: {
    users: {
      total: 0,
      male: 0,
      female: 0,
      active: 0,
      deactive: 0,
      averageAge: 0
    },
    organizations: {
      totalOrganizations: 0,
      totalUsers: 0,
      maleUsers: 0,
      femaleUsers: 0,
      activeUsers: 0,
      deactiveUsers: 0,
      averageAge: 0,
      activeOrgs:0,
      pendingOrgs:0,
      rejectedOrgs:0,
    },
    events: {
      total: 0,
      upcoming: 0,
      completed: 0,
      ongoing: 0
    },
    feedback: {
      total: 0,
      averageRating: 0,
      recommendationRate: 0,
      byType: [],
      mostPopularCategory:0,
    },
    queries: {
      total: 0,
      recentQueries:0,
      queriesByType:0,
      queriesWithResponse:0,
      popularTimes:0,
      deviceBreakdown:0,
    },
    complaints: {
      total: 0,
      recentComplaint:0,
      pendingComplaint:0,
      resolvedComplaint:0,
    },
    stocks: {
      all: 0,
      nifty50: 0,
      nifty500: 0,
      etf: 0
    },
    gallery:{
      total:0,          // Total gallery items (including deleted)
      active:0,         // Currently active items
      deleted:0,        // Soft-deleted items
      byCategory:0,
      totalCategories:0,
      totalPhotos:0  
    }
  },
  status: 'idle',
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.dashboardStats = action.payload;
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { clearError } = dashboardSlice.actions;

export const selectDashboardStats = (state) => state?.user?.dashboard?.dashboardStats;
export const selectDashboardStatus = (state) => state?.user?.dashboard.status;
export const selectDashboardError = (state) => state.dashboard.error;

export default dashboardSlice.reducer;