import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../redux/User/forgetPasswordSlice";
import { toast } from "react-hot-toast";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Yup validation schema for email
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
});

const ForgotPasswordModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user.forgetpassword);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "succeeded") {
      setMessage("✅ Reset password link sent successfully! Check your email.");
    }
    if (error) {
      setMessage(` ${error}`);
    }
  }, [status, error]);

  return (
    <>
      {/* Toast Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        {/* Background Overlay */}
        <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>

        {/* Modal Content */}
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 z-50 p-6">
          {/* Modal Header */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-lock text-white text-sm"></i>
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Forgot Password</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>

          {/* Modal Body */}
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              setMessage(""); 
              dispatch(forgotPassword(values.email));
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
                      bg-white text-gray-900 
                      focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                      focus:outline-none transition-all duration-200"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || status === "loading"}
                  className="w-full px-4 py-3 rounded-lg bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-blue-400 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 disabled:opacity-50"
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </button>
              </Form>
            )}
          </Formik>

          {/* Message Display (Success/Error) */}
          {message && (
            <p className={`mt-2 text-sm ${status === "succeeded" ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          {/* Close Button */}
          <div className="text-right mt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordModal;
