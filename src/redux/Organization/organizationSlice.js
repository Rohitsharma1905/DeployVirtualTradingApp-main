// src/Organization/organizationReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import organizationAuthReducer from './auth/organizationAuthSlice';
import organizationDashboardReducer from './dashboard/organizationDashboardSlice';
import organizationUsersReducer from './users/organizationUsersSlice';
import organizationUsersFeedbacksReducer from "./feedbacks/organizationUsersFeedbackSlice"; //organation feedbacks 
import orguserFeedbacksReducer from "./feedbacks/organizationFeedbackSlice" // organization user feedbacks
import orgComplaintReducer from "./complaints/complaintsSlice";
import organizationAuthSlicereducer from "./count/CardStatCountSlice"


const organizationReducer = combineReducers({
  auth: organizationAuthReducer,
  dashboard: organizationDashboardReducer,
  users: organizationUsersReducer,
  feedbacks:organizationUsersFeedbacksReducer,
  complaints: orgComplaintReducer,
  userFeedbacks:orguserFeedbacksReducer,
  organization:organizationAuthSlicereducer
});

export default organizationReducer;