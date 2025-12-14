// utils/messages.js
export const messages = {
    // Success Messages
    REGISTRATION_SUCCESS: 'Organization registered successfully!',
    LOGIN_SUCCESS: 'Logged in successfully!',
    DATA_FETCH_SUCCESS: 'Data fetched successfully!',
    UPDATE_SUCCESS: 'Updated successfully!',
    DELETE_SUCCESS: 'Deleted successfully!',
  
    // Error Messages
    REGISTRATION_FAILED: 'Failed to register organization.',
    LOGIN_FAILED: 'Failed to login. Please check your credentials.',
    DATA_FETCH_FAILED: 'Failed to fetch data.',
    UPDATE_FAILED: 'Failed to update.',
    DELETE_FAILED: 'Failed to delete.',
  
    // Validation Errors
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PASSWORD: 'Password must be at least 8 characters long.',
    INVALID_MOBILE: 'Mobile number must start with 9, 8, 7, or 6 and contain 10 digits.',
    INVALID_URL: 'Please enter a valid URL.',
  
    // Generic Messages
    SOMETHING_WENT_WRONG: 'Something went wrong!',
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
  };
  
  export const toastConfig = {
    success: {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#4CAF50',
        color: '#fff',
      },
    },
    error: {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#FF5252',
        color: '#fff',
      },
    },
  };

