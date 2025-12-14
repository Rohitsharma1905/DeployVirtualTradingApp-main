// adminDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import toast from "react-hot-toast";

// Initial state with all possible stats initialized


// Async Thunks
export const fetchUserStats = createAsyncThunk(
  "adminDashboard/fetchUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const [
        totalRes,
        maleRes,
        femaleRes,
        activeRes,
        deactiveRes,
        averageAgeRes,
      ] = await Promise.all([
        axios.get(`${BASE_API_URL}/admin/stats/user/totalUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/user/totalMaleUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/user/totalFemaleUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/user/totalActiveUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/user/totalDeactiveUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/user/averageUserAge`),
      ]);

      return {
        total: totalRes.data.count,
        male: maleRes.data.count,
        female: femaleRes.data.count,
        active: activeRes.data.count,
        deactive: deactiveRes.data.count,
        averageAge: averageAgeRes.data.averageAge,
      };
    } catch (error) {
      toast.error("Failed to fetch user statistics");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchOrgUserStats = createAsyncThunk(
  "adminDashboard/fetchOrgUserStats",
  async (_, { rejectWithValue }) => {
    try {
      const [
        totalRes,
        maleRes,
        femaleRes,
        activeRes,
        deactiveRes,
        averageAgeRes,
      ] = await Promise.all([
        axios.get(`${BASE_API_URL}/admin/stats/organization/totalOrganizations`),
        axios.get(`${BASE_API_URL}/admin/stats/organization/organizationTotalMaleUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/organization/OrganizationTotalFemaleUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/organization/OrganizationTotalActiveUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/organization/OrganizationTotalDeactiveUsers`),
        axios.get(`${BASE_API_URL}/admin/stats/organization/organizationAverageUserAge`),
      ]);

    //   return {
    //     total: totalRes.data.count,
    //     male: maleRes.data.count,
    //     female: femaleRes.data.count,
    //     active: activeRes.data.count,
    //     deactive: deactiveRes.data.count,
    //     averageAge: averageAgeRes.data.averageAge,
    //   };
    return {
        orgTotal: totalRes.data.count,
        orgMale: maleRes.data.count,
        orgFemale: femaleRes.data.count,
        orgActive: activeRes.data.count,
        orgDeactive: deactiveRes.data.count,
        orgAverageAge: averageAgeRes.data.averageAge,
      };
    } catch (error) {
      toast.error("Failed to fetch organization user statistics");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // User statistics (all users)
  totalUsers: 0,
  maleUsers: 0,
  femaleUsers: 0,
  activeUsers: 0,
  deactiveUsers: 0,
  averageUserAge: 0,
  
  // Organization-registered user statistics
  orgTotalUsers: 0,
  orgMaleUsers: 0,
  orgFemaleUsers: 0,
  orgActiveUsers: 0,
  orgDeactiveUsers: 0,
  orgAverageUserAge: 0,
  
  // Organization statistics
  totalOrganizations: 0,
  
  // Loading states
  loading: {
    userStats: false,
    orgUserStats: false,
    orgStats: false,
  },
  
  // Error states
  error: {
    userStats: null,
    orgUserStats: null,
    orgStats: null,
  }
};

// export const fetchOrgStats = createAsyncThunk(
//   "adminDashboard/fetchOrgStats",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${BASE_API_URL}/admin/organization/count/total`);
//       return {
//         total: response.data.count,
//       };
//     } catch (error) {
//       toast.error("Failed to fetch organization statistics");
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// Slice
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    resetAdminDashboardState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading.userStats = true;
        state.error.userStats = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading.userStats = false;
        state.totalUsers = action.payload.total;
        state.maleUsers = action.payload.male;
        state.femaleUsers = action.payload.female;
        state.activeUsers = action.payload.active;
        state.deactiveUsers = action.payload.deactive;
        state.averageUserAge = action.payload.averageAge;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading.userStats = false;
        state.error.userStats = action.payload;
      })
      
      // Organization User Stats
      .addCase(fetchOrgUserStats.pending, (state) => {
        state.loading.orgUserStats = true;
        state.error.orgUserStats = null;
      })
      .addCase(fetchOrgUserStats.fulfilled, (state, action) => {
        state.loading.orgUserStats = false;
        state.orgTotalUsers = action.payload.orgTotal;
        state.orgMaleUsers = action.payload.orgMale;
        state.orgFemaleUsers = action.payload.orgFemale;
        state.orgActiveUsers = action.payload.orgActive;
        state.orgDeactiveUsers = action.payload.orgDeactive;
        state.orgAverageUserAge = action.payload.orgAverageAge;
      })
     
      .addCase(fetchOrgUserStats.rejected, (state, action) => {
        state.loading.orgUserStats = false;
        state.error.orgUserStats = action.payload;
      })
      
      // Organization Stats
      // .addCase(fetchOrgStats.pending, (state) => {
      //   state.loading.orgStats = true;
      //   state.error.orgStats = null;
      // })
      // .addCase(fetchOrgStats.fulfilled, (state, action) => {
      //   state.loading.orgStats = false;
      //   state.totalOrganizations = action.payload.total;
      // })
      // .addCase(fetchOrgStats.rejected, (state, action) => {
      //   state.loading.orgStats = false;
      //   state.error.orgStats = action.payload;
      // });
  },
});

export const { resetAdminDashboardState } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;