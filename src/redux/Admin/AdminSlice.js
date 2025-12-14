import { combineReducers } from '@reduxjs/toolkit';
import { logoutUser } from './Auth/LogoutSlice'; // Import logout action

// Import existing reducers
import adminQueryTableReducer from './QueryListPage/QueryTableSllice';
import registeredUsersReducer from "./RegisteredUsersPage/RegisteredUserListSlice";
import organizationListReducer from './OrganizationListPage/OrganizationListSlice';
import organizationRegistrationReducer from './OrganizationListPage/OrganizationRegisterSlice';
import userRegistrationReducer from './RegisteredUsersPage/UserRegisterSlice';
import feedbackTableReducer from '../Admin/FeedbackListPage/FeedbackTableSlice';
import complaintTableReducer from '../Admin/ComplaintListPage/complaintTableSlice';
import eventTableReducer from '../Admin/EventManage/eventSlice';
import adminDashboardReducer from "../Admin/StatsCount/adminDashboardSlice";
import participantReducer from "./ParticipantsManage/participantSlice";

// Create a custom reducer to handle logout across admin slices
const createLogoutReducer = (reducer) => {
  return (state, action) => {
    if (action.type === logoutUser.fulfilled.type) {
      // Reset the specific slice to its initial state
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
};

// Create a reset action for the entire admin reducer
const resetAdminState = () => ({
  type: 'RESET_ADMIN_STATE'
});

// Apply logout handling to each reducer
const adminReducer = combineReducers({
  queryTable: createLogoutReducer(adminQueryTableReducer),
  registeredUsersTable: createLogoutReducer(registeredUsersReducer),
  organizationList: createLogoutReducer(organizationListReducer),
  organizationRegistration: createLogoutReducer(organizationRegistrationReducer),
  userRegistration: createLogoutReducer(userRegistrationReducer),
  feedbackTable: feedbackTableReducer,
  complaintTable: complaintTableReducer,
  eventTable: eventTableReducer,
  adminDashboardStats:adminDashboardReducer,
  participants: participantReducer
});

const rootAdminReducer = (state, action) => {
  if (action.type === 'RESET_ADMIN_STATE') {
    // Reset entire admin state
    return adminReducer(undefined, action);
  }
  return adminReducer(state, action);
};

export { resetAdminState };
export default rootAdminReducer;