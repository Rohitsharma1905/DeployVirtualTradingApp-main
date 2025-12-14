import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, selectAuthStatus, selectAuthError } from "../../redux/User/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const UserLoginForm = ({ onClose, onOpenRegister, onOpenForgotPassword }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);
  const loading = authStatus === "loading";

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema: Yup.object({
      identifier: Yup.string()
        .required("Email or Mobile is required")
        .test("is-email-or-mobile", "Invalid email or mobile format", (value) => {
          const isEmail = Yup.string().email().isValidSync(value);
          const isMobile = /^[6-9]\d{9}$/.test(value);
          return isEmail || isMobile;
        }),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(15, "Password cannot be more than 15 characters")
        .matches(
          /^(?=.*[A-Za-z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/,
          "Password must contain at least one letter and one special character"
        )
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const isEmail = Yup.string().email().isValidSync(values.identifier);
        const credentials = isEmail
          ? { email: values.identifier, password: values.password }
          : { mobile: values.identifier, password: values.password };
    
        const resultAction = await dispatch(loginUser(credentials));
    
        if (loginUser.fulfilled.match(resultAction)) {
          const user = resultAction.payload?.user;
          
          setTimeout(() => {
            setSubmitting(false);
            resetForm();

            if (user?.role === "admin") {
              navigate("/admin");
              toast.success("Login successful!");
            } else {
              navigate("/user");
              toast.success("Login successful!");
            }
            onClose();
          }, 2000);
        } else {
          setSubmitting(false);
          toast.error(resultAction.payload || "Login failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="space-y-4">
      {loading && (
        <div className="absolute inset-0 flex h-full items-center justify-center rounded-xl z-50">
          <div className="absolute inset-0 bg-gray-900/50 rounded-xl z-40"></div>
          <div className="z-50 flex flex-col items-center gap-4">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-lightBlue-600 border-t-transparent"
              role="status"
            ></div>
          </div>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4 h-full flex flex-col ">
        <div className="flex-1  overflow-y-auto pr-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email or Mobile
            </label>
            <input
              type="text"
              name="identifier"
              className="w-full ml-1 px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              placeholder="Enter email or mobile"
              {...formik.getFieldProps("identifier")}
            />
            {formik.touched.identifier && formik.errors.identifier && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.identifier}
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full ml-1 mb-1 px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              placeholder="Enter your password"
              {...formik.getFieldProps("password")}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>
        </div>
   
        <div className="sticky pt-4 border-t border-gray-100 space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <button
            type="button"
            className="text-lightBlue-600 hover:underline focus:outline-none text-xs font-medium"
            onClick={onOpenForgotPassword}
          >
            Forgot Password?
          </button>
          <div className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-lightBlue-600 hover:underline focus:outline-none font-medium"
              onClick={onOpenRegister}
            >
              Register now
            </button>
          </div>
        </div>

        <div className="flex space-x-3 sm:flex-row justify-center items-center ">
          <button
            type="button"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || loading}
            className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default UserLoginForm;