import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import {
  registerUser,
  updateUser,
  resetForm,
  selectRegistrationLoading,
  selectRegistrationError,
  selectRegistrationSuccess,
  selectNotificationStatus,
} from '../../../redux/Admin/RegisteredUsersPage/UserRegisterSlice';
import { fetchUsers } from '../../../redux/User/userSlice';

const UserRegisterModal = ({ isOpen, onClose, selectedUser, onSuccess }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectRegistrationLoading);
  const error = useSelector(selectRegistrationError);
  const success = useSelector(selectRegistrationSuccess);
  const notification = useSelector(selectNotificationStatus);

  // Helper function to calculate max date for DOB (18 years ago)
  const calculateMaxDate = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Initial form values
  const initialValues = {
    name: selectedUser?.name || "",
    email: selectedUser?.email || "",
    mobile: selectedUser?.mobile || "",
    gender: selectedUser?.gender || "",
    dob: selectedUser?.dob ? new Date(selectedUser.dob).toISOString().split('T')[0] : "",
    // orgtype: selectedUser?.orgtype || ""
  };

  // Validation schema - aligned with backend Joi validation
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format"),
    
    mobile: Yup.string()
      .required("Mobile number is required")
      .matches(
        /^[6-9]\d{9}$/,
        "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
      ),
    
    gender: Yup.string()
      .required("Gender is required")
      .oneOf(['Male', 'Female', 'Other'], "Invalid gender selection"),
    
    dob: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future")
      .test("age", "Must be at least 18 years old", function(value) {
        if (!value) return false;
        return calculateAge(value) >= 18;
      }),
    
    // orgtype: Yup.string()
    //   .min(2, "Organization type must be at least 2 characters")
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        if (selectedUser) {
          await dispatch(updateUser({
            id: selectedUser._id,
            data: values
          })).unwrap();
          toast.success('User updated successfully!');
        } else {
          const result = await dispatch(registerUser(values)).unwrap();
          await dispatch(fetchUsers());
          // toast.success('User registered successfully!');
        }
        onSuccess?.();
        resetForm();
        onClose();
      } catch (err) {
        toast.error(err.message || 'Operation failed');
        console.error('Operation failed:', err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
      dispatch(resetForm());
    }
  }, [isOpen, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900 opacity-50 transition-opacity" onClick={onClose}></div>

      {/* Mobile View */}
      <div className="relative w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden sm:hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lightBlue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user text-white text-sm"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedUser ? "Edit User" : "Register New User"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            disabled={formik.isSubmitting}
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600 text-sm"></i>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-4">
          <div className="flex-1 max-h-[300px] overflow-y-auto pr-1 grid grid-cols-1 gap-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                {...formik.getFieldProps('name')}
                className={`w-full px-3 py-2 !rounded-xl border ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-500'
                    : 'border-gray-200'
                } !border-gray-200 
                 bg-white text-gray-900 
                 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                 focus:outline-none transition-all duration-200`}
                placeholder="Enter full name"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                {...formik.getFieldProps('email')}
                className={`w-full px-3 py-2 !rounded-xl border ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-500'
                    : 'border-gray-200'
                } !border-gray-200 
                 bg-white text-gray-900 
                 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                 focus:outline-none transition-all duration-200`}
                placeholder="Enter email address"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="mobile"
                {...formik.getFieldProps('mobile')}
                className={`w-full px-3 py-2 !rounded-xl border ${
                  formik.touched.mobile && formik.errors.mobile
                    ? 'border-red-500'
                    : 'border-gray-200'
                } !border-gray-200 
                 bg-white text-gray-900 
                 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                 focus:outline-none transition-all duration-200`}
                placeholder="Enter mobile number"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.mobile}</p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                {...formik.getFieldProps('gender')}
                className={`w-full px-3 py-2 rounded-xl border ${
                  formik.touched.gender && formik.errors.gender
                    ? 'border-red-500'
                    : 'border-gray-200'
                } focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200`}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.gender}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                {...formik.getFieldProps('dob')}
                max={calculateMaxDate()}
                className={`w-full px-3 py-2 rounded-xl border ${
                  formik.touched.dob && formik.errors.dob
                    ? 'border-red-500'
                    : 'border-gray-200'
                }  border-gray-200 
                   focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 
                   focus:outline-none transition-all duration-200`}
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.dob}</p>
              )}
            </div>

            {/* Organization Type Field - commented out to match backend */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Type
              </label>
              <input
                type="text"
                name="orgtype"
                {...formik.getFieldProps('orgtype')}
                className={`w-full px-3 py-2 !rounded-xl border ${
                  formik.touched.orgtype && formik.errors.orgtype
                    ? 'border-red-500'
                    : 'border-gray-200'
                } !border-gray-200 
                 bg-white text-gray-900 
                 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                 focus:outline-none transition-all duration-200`}
                placeholder="Enter organization type"
              />
              {formik.touched.orgtype && formik.errors.orgtype && (
                <p className="mt-1 text-xs text-red-500">{formik.errors.orgtype}</p>
              )}
            </div> */}
          </div>

          {/* Error Message Display */}
          {error && (
            // For Mobile View (adjust class names if needed for Desktop too)
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm">
              {/* Render error.message if error is an object, otherwise render error itself */}
              {typeof error === 'object' && error !== null ? error.message : error}
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t border-gray-100">
            <div className="flex justify-end items-center space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm"
                disabled={formik.isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`px-4 py-2 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 text-sm ${
                  (formik.isSubmitting || !formik.isValid) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : selectedUser ? (
                  'Update User'
                ) : (
                  'Register User'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Desktop View */}
      <div className="relative hidden sm:block lg:w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-user text-white text-base"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedUser ? "Edit User" : "Register New User"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            disabled={formik.isSubmitting}
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600 text-base"></i>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  {...formik.getFieldProps('name')}
                  className={`w-full px-4 py-3 !rounded-xl border ${
                    formik.touched.name && formik.errors.name
                      ? 'border-red-500'
                      : 'border-gray-200'
                  } !border-gray-200 
                   bg-white text-gray-900 
                   focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                   focus:outline-none transition-all duration-200`}
                  placeholder="Enter full name"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  {...formik.getFieldProps('email')}
                  className={`w-full px-4 py-3 !rounded-xl border ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-500'
                      : 'border-gray-200'
                  } !border-gray-200 
                   bg-white text-gray-900 
                   focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                   focus:outline-none transition-all duration-200`}
                  placeholder="Enter email address"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="mobile"
                  {...formik.getFieldProps('mobile')}
                  className={`w-full px-4 py-3 !rounded-xl border ${
                    formik.touched.mobile && formik.errors.mobile
                      ? 'border-red-500'
                      : 'border-gray-200'
                  } !border-gray-200 
                   bg-white text-gray-900 
                   focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
                   focus:outline-none transition-all duration-200`}
                  placeholder="Enter mobile number"
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.mobile}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  {...formik.getFieldProps('gender')}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    formik.touched.gender && formik.errors.gender
                      ? 'border-red-500'
                      : 'border-gray-200'
                  } focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200`}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {formik.touched.gender && formik.errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dob"
                  {...formik.getFieldProps('dob')}
                  max={calculateMaxDate()}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    formik.touched.dob && formik.errors.dob
                      ? 'border-red-500'
                      : 'border-gray-200'
                  }  border-gray-200 
                     focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 
                     focus:outline-none transition-all duration-200`}
                />
                {formik.touched.dob && formik.errors.dob && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.dob}</p>
                )}
              </div>

              {/* Information Box */}
              <div className="bg-blue-50 p-4 rounded-xl">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Important Information
                </h4>
                <ul className="text-xs text-blue-600 space-y-1">
                  <li>• All fields marked with * are required</li>
                  <li>• Mobile number must be a valid Indian number</li>
                  <li>• User must be at least 18 years old</li>
                  <li>• Email address will be used for account verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Message Display */}
          {error && (
            // For Mobile View (adjust class names if needed for Desktop too)
            <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-xl text-sm">
              {/* Render error.message if error is an object, otherwise render error itself */}
              {typeof error === 'object' && error !== null ? error.message : error}
            </div>
          )}

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white pt-6 mt-6 border-t border-gray-100">
            <div className="flex justify-end items-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-base"
                disabled={formik.isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting || !formik.isValid}
                className={`px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 text-base flex items-center ${
                  (formik.isSubmitting || !formik.isValid) && 'opacity-50 cursor-not-allowed'
                }`}
              >
                {formik.isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : selectedUser ? (
                  'Update User'
                ) : (
                  'Register User'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

UserRegisterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default UserRegisterModal;