import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userProfileReducer from './userprofileSlice';
import feedbackReducer from "./feedbackSlice";
import complaintReducer from './complaintSlice';
import tradingReducer from './trading/tradingSlice';
import forgetpasswordReducer from './forgetPasswordSlice';
import eventsReducer from './events/eventsSlice';
import certificateReducer from "./certificateSlice";
// import userSlice from './userSlice';
import dashboardReducer from "./userSlice";
import subscriptionPlanReducer from './userSubscriptionPlan/userSubscriptionPlansSlice';
import userDashboardReducer from "./userDashboardSlice";
const userReducer = combineReducers({
  auth: authReducer,
  profile: userProfileReducer,
  // users: userSlice,
  dashboard: dashboardReducer,
  subscriptionPlan: subscriptionPlanReducer,
  feedback: feedbackReducer,
  complaint: complaintReducer,
  tradingModal: tradingReducer,
  forgetpassword: forgetpasswordReducer,
  events: eventsReducer,
  userDashboard:userDashboardReducer,
  certificate:certificateReducer
});

export default userReducer;
