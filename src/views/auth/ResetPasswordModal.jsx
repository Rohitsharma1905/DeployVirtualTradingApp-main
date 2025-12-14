import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, verifyResetToken } from "../../redux/User/forgetPasswordSlice";
import { resetPasswordOrganization } from "../../redux/Organization/auth/organizationAuthSlice";
import logoImage from "../../assets/img/PGR_logo.jpeg";
import { useParams, useSearchParams,  useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

import { toast } from "react-hot-toast";

const ResetPasswordModal = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role"); // Extract role from URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" }); // New state for messages
  const [isExpired, setIsExpired] = useState(false); // Expiration state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select Redux state dynamically based on role
  const { status, error } = useSelector((state) =>
    role === "organization" ? state.organization.auth : state.user.forgetpassword
  );

// ✅ Verify token on component mount
useEffect(() => {
  if (token) {
    dispatch(verifyResetToken(token))
      .unwrap()
      .then(() => setIsExpired(false))
      .catch((errMsg) => {
        setIsExpired(true);
        setFeedback({ message: errMsg, type: "error" });
      });
  }
}, [token, dispatch]);


const formik = useFormik({
  initialValues: {
    newPassword: "",
    confirmPassword: ""
  },
  validationSchema: Yup.object({
    newPassword: Yup.string()
    .min(8, "New password must be at least 8 characters")
    .max(15, "New password cannot be more than 15 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/,
      "New password must contain at least one letter and one special character"
    )
    .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "New password and confirm password must match")
      .required("Confirm password is required")
  }),
  onSubmit: (values) => {
    if (!token || !role || isExpired) {
      setFeedback({ message: "Reset link has expired. Please request a new one.", type: "error" });
      return;
    }

    const action = role === "organization" ? resetPasswordOrganization : resetPassword;

    dispatch(action({ token, ...values })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFeedback({ message: "Password reset successfully! Please log in.", type: "success" });
      } else {
        setFeedback({ message: "Failed to reset password. Try again.", type: "error" });
      }

    });
  }
});

return (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
    <div className="fixed inset-0 bg-gray-900 opacity-50"></div>

    <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 z-50 p-6">
      <div className="flex flex-col items-center justify-center pb-4 border-b border-gray-100">
        <img src={logoImage} alt="PGR Logo" className="w-16 h-16 object-contain rounded-full mb-2" />
        <h1 className="text-2xl font-semibold text-gray-800">PGR - Virtual Trading App</h1>
      </div>

      <div className="flex justify-between items-center pb-4 border-b border-gray-100 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lightBlue-600 rounded-full flex items-center justify-center shadow-lg">
            <i className="fas fa-lock text-white"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isExpired}
            className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.newPassword}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={isExpired}
            className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || isExpired}
          className="w-full px-4 py-3 rounded-lg bg-lightBlue-600 text-white 
                     hover:from-lightBlue-600 hover:to-blue-400 focus:ring-2 focus:ring-lightBlue-600/20 
                     transition-all duration-200 disabled:opacity-50"
        >
          {status === "loading" ? "Resetting..." : "Reset Password"}
        </button>

        {feedback.message && (
          <p className={`text-sm mt-2 ${feedback.type === "success" ? "text-green-500" : "text-red-500"}`}>
            {feedback.message}
          </p>
        )}
      </form>

      <div className="text-right mt-4">
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          Go To Home
        </button>
      </div>
    </div>
  </div>
);
};


export default ResetPasswordModal;

// export default ResetPasswordModal;
// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { resetPassword } from "../../redux/User/forgetPasswordSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";


// const ResetPasswordModal = () => {
//   const { token } = useParams();
//   console.log("Reset Token from URL:", token);
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { status, error } = useSelector((state) => state.user.forgetpassword);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(resetPassword({ token, newPassword, confirmPassword })).then((res) => {
//       if (res.meta.requestStatus === "fulfilled") {
//         toast.success("Password reset successfully! Please log in.");
//         navigate("/login");
//       }
//     });
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reset Password</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lightBlue-600"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               placeholder="Confirm new password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lightBlue-600"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={status === "loading"}
//             className="w-full px-4 py-3 rounded-lg bg-lightBlue-600 text-white hover:bg-lightBlue-600 disabled:opacity-50"
//           >
//             {status === "loading" ? "Resetting..." : "Reset Password"}
//           </button>
//           {error && <p className="text-sm text-red-500">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ResetPasswordModal;
