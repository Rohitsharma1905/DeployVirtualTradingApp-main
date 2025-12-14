// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import userReducer from '../User/mainSlice';
import organizationReducer from '../Organization/organizationSlice';
import adminReducer from '../Admin/AdminSlice';
import commonReducer from '../Common/commonReducer';

// Custom middleware for handling API errors
const errorMiddleware = () => (next) => (action) => {
  if (action.type.endsWith('/rejected')) {
    // You can add global error handling here
    console.error('API Error:', action.payload);
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
    organization: organizationReducer,
    common: commonReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'organizationRegistration/register/rejected',
          'feedbackTable/updateFeedbackStatus/rejected',
          'trading/placeOrder/rejected'
        ],
        serializableCheck: false,
      },
    }).concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export default store;