// // working --- without design
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const OTPModal = ({ 
//   isOpen, 
//   onClose, 
//   email, 
//   onVerified,
//   resendEndpoint,
//   verifyEndpoint
// }) => {
//   const [otp, setOtp] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await fetch(verifyEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       toast.success('OTP verified successfully!');
//       onVerified();
//       onClose();
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     try {
//       const response = await fetch(resendEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       toast.success('OTP resent successfully!');
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md">
//         <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
//         <p className="mb-4">We've sent a 6-digit OTP to {email}</p>
        
//         <form onSubmit={handleVerify}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Enter OTP
//             </label>
//             <input
//               type="text"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full px-4 py-3 rounded-xl border border-gray-200 
//                 bg-white text-gray-900 
//                 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 
//                 focus:outline-none transition-all duration-200"
//               placeholder="Enter 6-digit OTP"
//               maxLength="6"
//               required
//             />
//           </div>
          
//           <div className="flex justify-between items-center">
//             <button
//               type="button"
//               onClick={handleResendOtp}
//               className="text-lightBlue-600 hover:underline text-sm"
//             >
//               Resend OTP
//             </button>
            
//             <div className="flex space-x-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
//               >
//                 {isLoading ? 'Verifying...' : 'Verify'}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default OTPModal;


// components/YourPath/OtpModal.js (For Organization)
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
    verifyOrganizationOtp,          // Redux action for verification
    selectOrgAuthLoading,           // Selector for loading state
    clearAuthError,                 // Action to clear potential Redux errors
    clearSuccessMessage             // Action to clear potential Redux success messages
} from '../../../../redux/Organization/auth/organizationAuthSlice'; // Adjust path as needed
import { BASE_API_URL } from '../../../../utils/BaseUrl'; // Adjust path for BASE_API_URL

const OTPModal = ({
  isOpen,
  onClose, // Function to close the modal
  email,   // Email address to verify/resend OTP
  onVerified // Function to call on successful verification
}) => {
  if (!isOpen) return null; // Don't render if not open

  const [otp, setOtp] = useState('');
  const [otpExpired, setOtpExpired] = useState(false);
  const [timer, setTimer] = useState(600); // 600 seconds = 10 minutes
  const [isResending, setIsResending] = useState(false); // Local loading state for resend

  const dispatch = useDispatch();
  // isLoading will primarily reflect the verify action from Redux
  const isLoadingVerify = useSelector(selectOrgAuthLoading);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  // --- Timer Logic ---
  const startTimer = () => {
    setTimer(600);
    setOtpExpired(false);
    setOtp(''); // Clear OTP input on new timer start
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setOtpExpired(true);
          toast.error("OTP expired. Please request a new one.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isOpen) {
      startTimer();
      setTimeout(() => inputRef.current?.focus(), 100);
      // Clear Redux state on open, just in case
      dispatch(clearAuthError());
      dispatch(clearSuccessMessage());
    }
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, dispatch]); // Add dispatch dependency

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, "0");
    const sec = (seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  // --- Event Handlers ---

  const handleOtpChange = (e) => {
     const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
     setOtp(value);
  };

  // --- Verify OTP (Uses Redux) ---
  const handleVerify = async (e) => {
    e.preventDefault();

    if (otpExpired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      inputRef.current?.focus();
      return;
    }

    dispatch(clearAuthError()); // Clear previous Redux errors

    try {
      // Dispatch the Redux thunk for verification
      const resultAction = await dispatch(verifyOrganizationOtp({ email, otp }));

      if (verifyOrganizationOtp.fulfilled.match(resultAction)) {
        // Let the parent component handle success actions via onVerified
        if (onVerified) onVerified();
      } else if (verifyOrganizationOtp.rejected.match(resultAction)) {
        // Show error from Redux state/payload using toast
        toast.error(resultAction.payload?.message || 'OTP verification failed.');
        setOtp(''); // Clear OTP input on error
        inputRef.current?.focus();
      }
    } catch (error) {
      console.error("Verification dispatch error:", error);
      toast.error("An unexpected error occurred during verification.");
      setOtp('');
      inputRef.current?.focus();
    }
  };

  // --- Resend OTP (Uses Direct Fetch) ---
  const handleResendOtp = async () => {
    // Prevent multiple clicks if already resending or verifying
    if (isLoadingVerify || isResending) return;

    setIsResending(true); // Set local resend loading state

    try {
      // Direct fetch call to the organization resend endpoint
      const res = await fetch(`${BASE_API_URL}/organization/resend-otp`, { // Ensure correct endpoint
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || "New OTP sent successfully!");
        startTimer(); // Restart the timer and clear OTP input
        inputRef.current?.focus(); // Focus input again
      } else {
        // Handle API errors (e.g., { success: false, message: '...' })
        toast.error(data.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      // Handle network errors
      console.error("Resend OTP fetch error:", err);
      toast.error("Something went wrong while resending OTP. Check your connection.");
    } finally {
      setIsResending(false); // Reset local resend loading state
    }
  };


  // --- JSX Structure (Copied from User Modal) ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={!isLoadingVerify && !isResending ? onClose : undefined}></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 z-50 p-6 m-4">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lightBlue-600 rounded-full flex items-center justify-center shadow-lg">
              <i className="fas fa-shield-alt text-white text-sm"></i> {/* Org Icon */}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Organization OTP</h2>
          </div>
          <button onClick={!isLoadingVerify && !isResending ? onClose : undefined} className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none" disabled={isLoadingVerify || isResending}>
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleVerify} className="space-y-4 mt-4">
          <div>
            <label htmlFor="org-otp-input" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP sent to <span className='font-medium'>{email}</span>
            </label>
            <input
              ref={inputRef}
              id="org-otp-input"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={handleOtpChange}
              required
              // Disable if expired OR verifying OR resending
              disabled={otpExpired || isLoadingVerify || isResending}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              className="w-full px-4 py-3 !rounded-xl border !border-gray-300
               bg-white text-gray-900 tracking-widest text-center text-lg font-medium
               focus:!border-lightBlue-600 focus:ring-1 focus:!ring-lightBlue-600
               focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Timer Display */}
          {!otpExpired && (
             <div className="text-sm text-gray-500 text-center">
                Time left: <span className='font-medium text-gray-700'>{formatTime(timer)}</span>
             </div>
          )}

          {/* Verify Button */}
          <button
            type="submit"
            // Disable if verifying, resending, expired, or OTP length is not 6
            disabled={isLoadingVerify || isResending || otpExpired || otp.length !== 6}
            className="w-full px-4 py-3 rounded-lg bg-lightBlue-600 text-white font-medium hover:from-lightBlue-600 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-lightBlue-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Show appropriate loading text */}
            {isLoadingVerify ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Conditional Resend Link Area */}
        {otpExpired && (
          <div className="mt-4 text-center text-sm text-gray-600">
            OTP expired.{" "}
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={handleResendOtp}
              // Disable if verifying OR resending
              disabled={isLoadingVerify || isResending}
              className="text-lightBlue-600 underline hover:text-blue-800 transition-colors focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isResending ? "Sending..." : "Click here to resend."}
            </button>
          </div>
        )}

        {/* Optional: Simple Resend button even if not expired (can be removed if only needed on expiry) */}
        {!otpExpired && timer < 570 && ( // Example: Show after 30s
           <div className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the code?{" "}
              <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoadingVerify || isResending}
              className="text-lightBlue-600 underline hover:text-blue-800 transition-colors focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed"
              >
              {isResending ? "Sending..." : "Resend OTP"}
              </button>
           </div>
        )}

        {/* Removed the extra bottom close button to match the user modal likely behavior */}

      </div>
    </div>
  );
};

export default OTPModal;