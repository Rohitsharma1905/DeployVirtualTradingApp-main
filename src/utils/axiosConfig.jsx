// import axios from 'axios';
// import { BASE_API_URL } from './BaseUrl';

// // Create an axios instance
// const axiosInstance = axios.create({
//   baseURL: BASE_API_URL,
// });

// // Add a request interceptor to include the token in every request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;











import axios from 'axios';
import { BASE_API_URL } from './BaseUrl';
import React, { useState } from 'react';
// import SessionExpiredModal from '../components/Organization/Session/SessionExpiredModal'; // Import the modal component

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

// Add a request interceptor to include the token in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.response.data.message === "Token expired. Please log in again.") {
        // Token expired - show the modal
        const event = new CustomEvent('show-session-expired-modal');
        window.dispatchEvent(event);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;