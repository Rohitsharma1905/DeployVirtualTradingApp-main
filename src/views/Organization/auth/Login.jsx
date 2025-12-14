// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { loginOrganization, selectOrgAuthStatus } from "../../../redux/Organization/auth/organizationAuthSlice";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const OrgLoginForm = ({ onClose, onOpenRegister, onOpenForgotPassword }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const authStatus = useSelector(selectOrgAuthStatus);
//   const loading = authStatus === "loading";

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Invalid email address")
//         .required("Email is required"),
//       password: Yup.string()
//         .required("Password is required")
//         .min(8, "Password must be at least 8 characters"),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         const resultAction = await dispatch(loginOrganization(values));
        
//         if (loginOrganization.fulfilled.match(resultAction)) {
//           setTimeout(() => {
//             setSubmitting(false);
//             navigate("/organization");
//             toast.success("Login successful!");
//             onClose();
//           }, 2000);
//         } else {
//           setSubmitting(false);
//           toast.error(resultAction.payload || "Login failed. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error during login:", error);
//         toast.error("An unexpected error occurred. Please try again.");
//       }
//     },
//   });

//   return (
//     <div className="space-y-4">
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center rounded-xl z-50">
//           <div className="absolute inset-0 bg-gray-900/50 rounded-xl z-40"></div>
//           <div className="z-50 flex flex-col items-center gap-4">
//             <div
//               className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-lightBlue-600 border-t-transparent"
//               role="status"
//             ></div>
//           </div>
//         </div>
//       )}

//       <form onSubmit={formik.handleSubmit} className="space-y-4">
//         <div className="space-y-3">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Organization Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//                bg-white text-gray-900 
//                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                focus:outline-none transition-all duration-200"
//               placeholder="Enter organization email"
//               {...formik.getFieldProps("email")}
//             />
//             {formik.touched.email && formik.errors.email && (
//               <div className="text-red-500 text-xs mt-1">
//                 {formik.errors.email}
//               </div>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               name="password"
//               className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//                bg-white text-gray-900 
//                focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                focus:outline-none transition-all duration-200"
//               placeholder="Enter your password"
//               {...formik.getFieldProps("password")}
//             />
//             {formik.touched.password && formik.errors.password && (
//               <div className="text-red-500 text-xs mt-1">
//                 {formik.errors.password}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
//           <button
//             type="button"
//             className="text-lightBlue-600 hover:underline focus:outline-none text-xs font-medium"
//             onClick={onOpenForgotPassword}
//           >
//             Forgot Password?
//           </button>
//           <div className="text-xs sm:text-sm text-gray-600">
//             Don't have an account?{" "}
//             <button
//               type="button"
//               className="text-lightBlue-600 hover:underline focus:outline-none font-medium"
//               onClick={onOpenRegister}
//             >
//               Register now
//             </button>
//           </div>
//         </div>

//         <div className="flex space-x-3 sm:flex-row justify-center items-center ">
//           <button
//             type="button"
//             onClick={() => {
//               formik.resetForm();
//               onClose();
//             }}
//             className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={formik.isSubmitting || loading}
//             className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
//           >
//             {formik.isSubmitting ? "Logging in..." : "Login"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default OrgLoginForm;



import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
    loginOrganization,
    selectOrgAuthLoading, // <-- CORRECTED IMPORT
    selectOrgAuthError,   // <-- Added for error display
    selectOrgAuthErrorType // <-- Added for specific error type
} from "../../../redux/Organization/auth/organizationAuthSlice"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const OrgLoginForm = ({ onClose, onOpenRegister, onOpenForgotPassword }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the correct selector which returns the boolean loading state
  const loading = useSelector(selectOrgAuthLoading);
  const authError = useSelector(selectOrgAuthError); // Get the error message string
  const errorType = useSelector(selectOrgAuthErrorType); // Get the specific error type

  const formik = useFormik({
    initialValues: {
      email: "", // Assuming this form specifically takes email
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
    }),
    // Note: Removed setSubmitting from onSubmit parameters as we use Redux loading state
    onSubmit: async (values) => {
      try {
        // Dispatch login action with email and password
        // Ensure backend '/organization/login' endpoint handles { email, password }
        const resultAction = await dispatch(loginOrganization({
            email: values.email,
            password: values.password
        }));

        if (loginOrganization.fulfilled.match(resultAction)) {
          // Use toast immediately, navigate after state updates
          toast.success(resultAction.payload?.message || "Login successful!");
          navigate("/organization"); // Navigate to dashboard or relevant page
          if (onClose) onClose(); // Close modal if applicable
        } else if (loginOrganization.rejected.match(resultAction)) {
          // Error message is handled by Redux state and displayed in the component UI
          // Show toast for immediate feedback
          const errorMessage = resultAction.payload?.message || "Login failed. Please try again.";
          toast.error(errorMessage);
          // Potentially clear password field based on error type
          const rejectedErrorType = resultAction.payload?.errorType;
           if (!['PENDING_APPROVAL', 'REJECTED'].includes(rejectedErrorType)) {
            formik.setFieldValue('password', '', false);
           }
        }
      } catch (error) {
        // Catch unexpected errors (e.g., network issues before dispatch resolves)
        console.error("Error during login dispatch:", error);
        toast.error("An unexpected network error occurred. Please try again.");
      }
      // No need to manually setSubmitting(false), Redux state handles loading UI
    },
  });

  return (
    // Added relative positioning for the loading overlay
    <div className="space-y-4 relative">
      {/* Loading Overlay - Conditionally rendered based on Redux state */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl z-50">
          {/* Semi-transparent background */}
          <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-xl z-40"></div>
          {/* Spinner */}
          <div className="z-50">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-lightBlue-600 border-t-transparent"
              role="status"
              aria-label="Loading..." // Accessibility
            ></div>
          </div>
        </div>
      )}

       {/* Display API Error Message from Redux State */}
       {authError && !loading && ( // Display error only if not loading
            <div className={`mb-4 p-3 border rounded-lg text-sm ${errorType === 'PENDING_APPROVAL' || errorType === 'REJECTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-100 border-red-200 text-red-700'}`} role="alert">
                {errorType === 'PENDING_APPROVAL' && <i className="fas fa-exclamation-triangle mr-2"></i>}
                {errorType === 'REJECTED' && <i className="fas fa-times-circle mr-2"></i>}
                {errorType !== 'PENDING_APPROVAL' && errorType !== 'REJECTED' && <i className="fas fa-exclamation-circle mr-2"></i>}
                {authError} {/* Render the error message string */}
            </div>
       )}


      {/* Form - Disable fields when loading */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <fieldset disabled={loading} className="space-y-3"> {/* Disable fieldset */}
          <div>
            <label htmlFor="org-email" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Email
            </label>
            <input
              id="org-email"
              type="email"
              name="email"
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200
               bg-white text-gray-900
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
               focus:outline-none transition-all duration-200 disabled:bg-gray-100"
              placeholder="Enter organization email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
          <div>
            <label htmlFor="org-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="org-password"
              type="password"
              name="password"
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200
               bg-white text-gray-900
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20
               focus:outline-none transition-all duration-200 disabled:bg-gray-100"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>
        </fieldset>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            className="text-lightBlue-600 hover:underline focus:outline-none text-xs font-medium disabled:text-gray-400 disabled:no-underline"
            onClick={onOpenForgotPassword}
            disabled={loading} // Disable when loading
          >
            Forgot Password?
          </button>
          <div className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-lightBlue-600 hover:underline focus:outline-none font-medium disabled:text-gray-400 disabled:no-underline"
              onClick={onOpenRegister}
              disabled={loading} // Disable when loading
            >
              Register now
            </button>
          </div>
        </div>

        {/* Use Redux loading state for disabling buttons */}
        <div className="flex space-x-3 sm:flex-row justify-center items-center ">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              if (onClose) onClose();
            }}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm disabled:opacity-50"
            disabled={loading} // Disable when loading
          >
            Cancel
          </button>
          <button
            type="submit"
            // Disable if loading OR form is invalid/not touched
            disabled={loading || !formik.isValid || !formik.dirty}
            className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
             {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Wait...</span>
                </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrgLoginForm;