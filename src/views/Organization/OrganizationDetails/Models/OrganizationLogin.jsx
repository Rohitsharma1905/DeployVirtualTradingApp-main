// // new working...
// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import ForgotPasswordModal from "./ForgetPasswordModal"; 
// import { loginOrganization, resetAuthState } from '../../../../redux/Organization/auth/organizationAuthSlice';
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const OrganizationLogin = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading } = useSelector((state) => state.organization.auth);
//    const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       emailOrMobile: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       emailOrMobile: Yup.string()
//         .required('Email or Mobile is required')
//         .test('is-email-or-mobile', 'Invalid email or mobile format', (value) => {
//           // Check if the input is a valid email or a valid mobile number
//           const isEmail = Yup.string().email().isValidSync(value);
//           const isMobile = /^\d{10}$/.test(value); // Assuming mobile number is 10 digits
//           return isEmail || isMobile;
//         }),
//       password: Yup.string()
//         .min(8, "Password must be at least 8 characters")
//         .max(15, "Password cannot be more than 20 characters")
//         .matches(
//           /^(?=.*[A-Za-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//           "Password must contain at least one letter and one special character"
//         )
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         // Determine if the input is an email or mobile number
//         const isEmail = Yup.string().email().isValidSync(values.emailOrMobile);
//         const credentials = isEmail
//           ? { email: values.emailOrMobile, password: values.password }
//           : { mobile: values.emailOrMobile, password: values.password };

//         const resultAction = await dispatch(loginOrganization(credentials));

//         if (loginOrganization.fulfilled.match(resultAction)) {
        
//           // localStorage.setItem('orgName', resultAction.payload.orgName);
//           // localStorage.setItem('token', resultAction.payload.token);
//           // localStorage.setItem('orgId', resultAction.payload.orgId);
//           // localStorage.setItem('org', JSON.stringify(resultAction.payload.org));
//           navigate('/organization/dashboard');
//           toast.success('Login successful!');
//         } else if (loginOrganization.rejected.match(resultAction)) {
//           toast.error(resultAction.payload?.message || 'Login failed. Please try again.');
//         }
//       } catch (error) {
//         console.error('Error during login:', error);
//         toast.error('An unexpected error occurred. Please try again.');
//       } finally {
//         resetForm();
//       }
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <>
//     {!isForgotPasswordOpen ? (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//       <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
//       <div style={{ width: '100%', maxWidth: '40%' }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-user text-white"></i>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Organization Login</h2>
//           </div>
//           <button
//             onClick={() => {
//               onClose();
//               formik.resetForm();
//               dispatch(resetAuthState());
//             }}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//           </button>
//         </div>
//         <div className="p-6 overflow-y-auto max-h-[80vh]">
//           {loading ? (
//             <p className="text-center">Loading...</p>
//           ) : (
//             <form onSubmit={formik.handleSubmit} className="space-y-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
//                   <input
//                     type="text"
//                     name="emailOrMobile"
//                     value={formik.values.emailOrMobile}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter email or mobile number"
//                     required
//                   />
//                   {formik.touched.emailOrMobile && formik.errors.emailOrMobile && (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.emailOrMobile}</div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                   <input
//                     type="password"
//                     name="password"
//                     value={formik.values.password}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter password"
//                     required
//                   />
//                   {formik.touched.password && formik.errors.password && (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
//                   )}
//                 </div>
//               </div>
              
//                {/* Forgot Password Link */}
//                <div className="text-left">
//               <button
//                 type="button"
//                 className="text-lightBlue-600 hover:underline focus:outline-none"
//                 onClick={() => setForgotPasswordOpen(true)}
//               >
//                 Forgot Password?
//               </button>
//             </div>

//               <div className="flex justify-end items-center space-x-4 pt-4 border-t border-gray-100">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onClose();
//                     formik.resetForm();
//                     dispatch(resetAuthState());
//                   }}
//                   className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
//                 >
//                   {loading ? 'Logging in...' : 'Organization Login'}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//      ) : (
//     <ForgotPasswordModal onClose={() => setForgotPasswordOpen(false)} />
//   )}
//     </>
//   );
// };

// export default OrganizationLogin;


// import React, { useState, useEffect } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useDispatch, useSelector } from 'react-redux';
// import ForgotPasswordModal from "./ForgetPasswordModal"; // Ensure path is correct
// import {
//     loginOrganization,
//     resetAuthState,
//     selectOrgAuthLoading,   // <-- Correct import name
//     selectOrgAuthError,
//     selectOrgAuthErrorType
// } from '../../../../redux/Organization/auth/organizationAuthSlice'; // Ensure path is correct
// import toast from 'react-hot-toast';
// import { useNavigate } from 'react-router-dom';

// const OrganizationLogin = ({ isOpen, onClose }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Use the correct selectors
//   const loading = useSelector(selectOrgAuthLoading);
//   const authError = useSelector(selectOrgAuthError); // Gets the error message string
//   const errorType = useSelector(selectOrgAuthErrorType); // Gets the specific error type string

//   const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

//   const formik = useFormik({
//     initialValues: {
//       emailOrMobile: '',
//       password: '',
//     },
//     validationSchema: Yup.object({
//       emailOrMobile: Yup.string()
//         .required('Email or Mobile is required')
//         .test('is-email-or-mobile', 'Invalid email or mobile format', (value) => {
//           if (!value) return false;
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           const mobileRegex = /^\d{10}$/; // Basic 10-digit mobile
//           return emailRegex.test(value) || mobileRegex.test(value);
//         }),
//       password: Yup.string()
//         .min(8, "Password must be at least 8 characters")
//         .matches(
//           /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // Requires letter, number, special char
//           "Password must contain at least one letter, one number and one special character"
//         )
//         .required("Password is required"),
//     }),
//     onSubmit: async (values, { setFieldValue }) => {
//       // Optionally clear previous auth error shown in the modal before new submit
//       // dispatch(clearAuthError()); // Or rely on pending state clearing it

//       try {
//         const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrMobile);
//         const credentials = isEmail
//           ? { email: values.emailOrMobile, password: values.password }
//           : { mobile: values.emailOrMobile, password: values.password };

//         const resultAction = await dispatch(loginOrganization(credentials));

//         if (loginOrganization.fulfilled.match(resultAction)) {
//           toast.success(resultAction.payload?.message || 'Login successful!');
//           navigate('/organization/dashboard');
//           onClose(); // Close modal on successful login
//         } else if (loginOrganization.rejected.match(resultAction)) {
//           // Error message is now in Redux state (authError) and displayed in the UI
//           // Still show a toast for immediate feedback
//           const errorMessage = resultAction.payload?.message || 'Login failed. Please try again.';
//           toast.error(errorMessage);

//           // Decide whether to clear the password field based on error type
//           const rejectedErrorType = resultAction.payload?.errorType;
//           if (!['PENDING_APPROVAL', 'REJECTED'].includes(rejectedErrorType)) {
//             // Clear password only for invalid credentials, etc.
//              setFieldValue('password', '', false); // Don't trigger validation yet
//           }
//         }
//       } catch (error) {
//         // Catch unexpected errors during dispatch/logic *before* dispatch
//         console.error('Error during login form submission:', error);
//         toast.error('An unexpected error occurred. Please try again.');
//         // Ensure loading is stopped if error happened before thunk handled it
//         // This case is less likely with proper thunk error handling
//         if (loading) {
//             dispatch(resetAuthState()); // Reset state if caught outside thunk cycle
//         }
//       }
//     },
//   });

//   // Effect to clear Redux error state and reset form when the modal is closed
//   useEffect(() => {
//     if (!isOpen) {
//       dispatch(resetAuthState()); // Clear loading, errors, success messages from Redux
//       formik.resetForm();      // Reset formik values and touched status
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isOpen]); // Dependency array ensures this runs only when isOpen changes

//   // Function to handle closing the main modal
//   const handleCloseModal = () => {
//     onClose();
//     // Cleanup is now handled by the useEffect hook based on isOpen
//   };

//   // Function to handle closing the forgot password modal
//   const handleCloseForgotPassword = () => {
//     setForgotPasswordOpen(false);
//     // Optionally reset auth state if needed after closing forgot password
//     // dispatch(resetAuthState());
//   };

//   if (!isOpen) return null;

//   return (
//     <>
//       {!isForgotPasswordOpen ? (
//         // Main Login Modal
//         <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm p-4">
//           <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 my-8">
//             {/* Header */}
//             <div className="flex justify-between items-center p-5 border-b border-gray-200 rounded-t-2xl">
//                <div className="flex items-center space-x-3">
//                  <div className="w-10 h-10 bg-gradient-to-br from-lightBlue-600 to-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//                    <i className="fas fa-building text-white"></i>
//                  </div>
//                  <h2 className="text-xl font-semibold text-gray-800">Organization Login</h2>
//                </div>
//               <button
//                 onClick={handleCloseModal}
//                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
//                 aria-label="Close modal"
//               >
//                 <i className="fas fa-times text-lg"></i>
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 overflow-y-auto max-h-[75vh]">
//               {/* Display API Error Message from Redux State */}
//               {authError && ( // Display error if authError string exists
//                  <div className={`mb-4 p-3 border rounded-lg text-sm ${errorType === 'PENDING_APPROVAL' || errorType === 'REJECTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-100 border-red-200 text-red-700'}`} role="alert">
//                     {errorType === 'PENDING_APPROVAL' && <i className="fas fa-exclamation-triangle mr-2"></i>}
//                     {errorType === 'REJECTED' && <i className="fas fa-times-circle mr-2"></i>}
//                     {errorType !== 'PENDING_APPROVAL' && errorType !== 'REJECTED' && <i className="fas fa-exclamation-circle mr-2"></i>}
//                    {authError} {/* Render the error message string */}
//                  </div>
//               )}

//               <form onSubmit={formik.handleSubmit} className="space-y-5">
//                 {/* Email or Mobile Field */}
//                 <div>
//                   <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
//                   <div className="relative">
//                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                        <i className="fas fa-envelope text-gray-400"></i>
//                      </span>
//                     <input
//                       id="emailOrMobile"
//                       type="text"
//                       name="emailOrMobile"
//                       value={formik.values.emailOrMobile}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full pl-10 pr-4 py-2.5 !rounded-lg border ${formik.touched.emailOrMobile && formik.errors.emailOrMobile ? '!border-red-500 ring-1 ring-red-500' : '!border-gray-300'}
//                                bg-white text-gray-900
//                                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
//                                focus:outline-none transition-all duration-200`}
//                       placeholder="Enter email or mobile number"
//                       aria-invalid={formik.touched.emailOrMobile && !!formik.errors.emailOrMobile}
//                       aria-describedby="emailOrMobile-error"
//                       disabled={loading}
//                     />
//                    </div>
//                   {formik.touched.emailOrMobile && formik.errors.emailOrMobile && (
//                     <p id="emailOrMobile-error" className="text-red-600 text-xs mt-1">{formik.errors.emailOrMobile}</p>
//                   )}
//                 </div>

//                 {/* Password Field */}
//                 <div>
//                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                    <div className="relative">
//                       <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                         <i className="fas fa-lock text-gray-400"></i>
//                       </span>
//                     <input
//                       id="password"
//                       type="password"
//                       name="password"
//                       value={formik.values.password}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full pl-10 pr-4 py-2.5 !rounded-lg border ${formik.touched.password && formik.errors.password ? '!border-red-500 ring-1 ring-red-500' : '!border-gray-300'}
//                                bg-white text-gray-900
//                                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
//                                focus:outline-none transition-all duration-200`}
//                       placeholder="Enter password"
//                       aria-invalid={formik.touched.password && !!formik.errors.password}
//                       aria-describedby="password-error"
//                       autoComplete="current-password"
//                       disabled={loading}
//                     />
//                   </div>
//                   {formik.touched.password && formik.errors.password && (
//                     <p id="password-error" className="text-red-600 text-xs mt-1">{formik.errors.password}</p>
//                   )}
//                 </div>

//                 {/* Forgot Password Link */}
//                 <div className="text-right text-sm">
//                   <button
//                     type="button"
//                     className="font-medium text-lightBlue-600 hover:text-blue-700 hover:underline focus:outline-none disabled:text-gray-400 disabled:no-underline"
//                     onClick={() => setForgotPasswordOpen(true)}
//                     disabled={loading} // Disable if login is in progress
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200 mt-6">
//                   <button
//                     type="button"
//                     onClick={handleCloseModal}
//                     disabled={loading}
//                     className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading || !formik.isValid || !formik.dirty}
//                     className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-lightBlue-600 to-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/30 focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]" // Added min-width
//                   >
//                     {loading ? (
//                         <>
//                           <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           <span>Logging in...</span>
//                         </>
//                     ) : (
//                       <span>Login</span>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div> {/* End Body */}
//           </div> {/* End Modal Content */}
//         </div>
//       ) : (
//         // Render ForgotPasswordModal when isForgotPasswordOpen is true
//         <ForgotPasswordModal onClose={handleCloseForgotPassword} />
//       )}
//     </>
//   );
// };

// export default OrganizationLogin;



// src/components/Organization/Auth/Login/OrganizationLogin.jsx

import React, { useState, useEffect } from 'react'; // Import useEffect
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import ForgotPasswordModal from "./ForgetPasswordModal";
import {
    loginOrganization,
    resetAuthState, // <-- Make sure resetAuthState is imported
    selectOrgAuthLoading,
    selectOrgAuthError,
    selectOrgAuthErrorType
} from '../../../../redux/Organization/auth/organizationAuthSlice'; // Adjust path if needed
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OrganizationLogin = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectOrgAuthLoading);
  const authError = useSelector(selectOrgAuthError);
  const errorType = useSelector(selectOrgAuthErrorType);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const formik = useFormik({
    // ... initialValues, validationSchema, onSubmit ...
     initialValues: {
      emailOrMobile: '',
      password: '',
    },
    validationSchema: Yup.object({
      emailOrMobile: Yup.string()
        .required('Email or Mobile is required')
        .test('is-email-or-mobile', 'Invalid email or mobile format', (value) => {
          if (!value) return false;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const mobileRegex = /^\d{10}$/; // Basic 10-digit mobile
          return emailRegex.test(value) || mobileRegex.test(value);
        }),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/, // Requires letter, number, special char
          "Password must contain at least one letter, one number and one special character"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, { setFieldValue }) => {
       try {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.emailOrMobile);
        const credentials = isEmail
          ? { email: values.emailOrMobile, password: values.password }
          : { mobile: values.emailOrMobile, password: values.password };

        const resultAction = await dispatch(loginOrganization(credentials));

        if (loginOrganization.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload?.message || 'Login successful!');
          navigate('/organization/dashboard');
          if (onClose) onClose(); // Close modal on successful login
        } else if (loginOrganization.rejected.match(resultAction)) {
          const errorMessage = resultAction.payload?.message || 'Login failed. Please try again.';
          toast.error(errorMessage);
          const rejectedErrorType = resultAction.payload?.errorType;
          if (!['PENDING_APPROVAL', 'REJECTED'].includes(rejectedErrorType)) {
             setFieldValue('password', '', false);
          }
        }
      } catch (error) {
        console.error('Error during login form submission:', error);
        toast.error('An unexpected error occurred. Please try again.');
        if (loading) {
            dispatch(resetAuthState());
        }
      }
    },
  });

  // --- ADD THIS useEffect ---
  useEffect(() => {
    // This effect runs whenever 'isOpen' changes.
    // If 'isOpen' becomes false, it means the modal was just closed.
    if (!isOpen) {
      // Dispatch the action to clear errors, loading flags, etc.
      dispatch(resetAuthState());
      // It's also good practice to reset the formik form itself
      formik.resetForm();
    }
    // Add dispatch and formik to dependency array (they are stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dispatch]); // formik is usually stable, add if lint complains

  // Function to handle closing the main modal
  const handleCloseModal = () => {
    // The useEffect above will handle the state reset when isOpen changes
    onClose();
  };

  // Function to handle closing the forgot password modal
  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  // --- REST OF YOUR COMPONENT JSX ---
  return (
    <>
      {!isForgotPasswordOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 backdrop-blur-sm p-4">
           <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 my-8">
             {/* Header */}
             <div className="flex justify-between items-center p-5 border-b border-gray-200 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-lightBlue-600 to-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-building text-white"></i>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Organization Login</h2>
                </div>
               <button
                 onClick={handleCloseModal} // Use the handler that calls onClose
                 className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                 aria-label="Close modal"
               >
                 <i className="fas fa-times text-lg"></i>
               </button>
             </div>

              {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[75vh]">
              {/* Display API Error Message from Redux State */}
              {authError && ( // Display error if authError string exists
                 <div className={`mb-4 p-3 border rounded-lg text-sm ${errorType === 'PENDING_APPROVAL' || errorType === 'REJECTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-100 border-red-200 text-red-700'}`} role="alert">
                    {errorType === 'PENDING_APPROVAL' && <i className="fas fa-exclamation-triangle mr-2"></i>}
                    {errorType === 'REJECTED' && <i className="fas fa-times-circle mr-2"></i>}
                    {errorType !== 'PENDING_APPROVAL' && errorType !== 'REJECTED' && <i className="fas fa-exclamation-circle mr-2"></i>}
                   {authError} {/* Render the error message string */}
                 </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-5">
                 {/* Email or Mobile Field */}
                <fieldset disabled={loading} className="space-y-5">
                 <div>
                   <label htmlFor="emailOrMobile" className="block text-sm font-medium text-gray-700 mb-1">Email or Mobile</label>
                   <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <i className="fas fa-envelope text-gray-400"></i>
                      </span>
                     <input
                       id="emailOrMobile"
                       type="text"
                       name="emailOrMobile"
                       value={formik.values.emailOrMobile}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       className={`w-full pl-10 pr-4 py-2.5 !rounded-lg border ${formik.touched.emailOrMobile && formik.errors.emailOrMobile ? '!border-red-500 ring-1 ring-red-500' : '!border-gray-300'}
                                bg-white text-gray-900
                                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
                                focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                       placeholder="Enter email or mobile number"
                       aria-invalid={formik.touched.emailOrMobile && !!formik.errors.emailOrMobile}
                       aria-describedby="emailOrMobile-error"
                     />
                    </div>
                   {formik.touched.emailOrMobile && formik.errors.emailOrMobile && (
                     <p id="emailOrMobile-error" className="text-red-600 text-xs mt-1">{formik.errors.emailOrMobile}</p>
                   )}
                 </div>

                 {/* Password Field */}
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                       <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                         <i className="fas fa-lock text-gray-400"></i>
                       </span>
                     <input
                       id="password"
                       type="password"
                       name="password"
                       value={formik.values.password}
                       onChange={formik.handleChange}
                       onBlur={formik.handleBlur}
                       className={`w-full pl-10 pr-4 py-2.5 !rounded-lg border ${formik.touched.password && formik.errors.password ? '!border-red-500 ring-1 ring-red-500' : '!border-gray-300'}
                                bg-white text-gray-900
                                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
                                focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                       placeholder="Enter password"
                       aria-invalid={formik.touched.password && !!formik.errors.password}
                       aria-describedby="password-error"
                       autoComplete="current-password"
                     />
                   </div>
                   {formik.touched.password && formik.errors.password && (
                     <p id="password-error" className="text-red-600 text-xs mt-1">{formik.errors.password}</p>
                   )}
                 </div>
               </fieldset>

                {/* Forgot Password Link */}
                
                <div className="text-right text-sm">
                  <button
                    type="button"
                    className="font-medium text-lightBlue-600 hover:text-blue-700 hover:underline focus:outline-none disabled:text-gray-400 disabled:no-underline"
                    onClick={() => setForgotPasswordOpen(true)}
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal} // Use the handler
                    disabled={loading}
                    className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !formik.isValid || !formik.dirty}
                    className="px-5 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-lightBlue-600 to-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/30 focus:outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                  >
                    {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Logging in...</span>
                        </>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
              </form>
            </div> {/* End Body */}

            </div>
          </div>
      ) : (
        <ForgotPasswordModal onClose={handleCloseForgotPassword} />
      )}
    </>
  );
};

export default OrganizationLogin;