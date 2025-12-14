


import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerOrganization, resetAuthState } from '../../../../redux/Organization/auth/organizationAuthSlice';
import toast from 'react-hot-toast';
// import OTPModal from './OtpModal';
import OTPModal from './OTPModal';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Name is required')
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  address: Yup.string().required('Address is required'),
  website: Yup.string().url('Invalid URL format').nullable(),
  contactPerson: Yup.string().nullable().min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  mobile: Yup.string()
    .matches(/^[9876]\d{9}$/, 'Mobile number must start with 9, 8, 7, or 6 and contain 10 digits')
    .required("Mobile number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password cannot be more than 15 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/,
      "Password must contain at least one letter and one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const OrganizationRegistration = ({ onClose, onOpenLogin }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.organization.auth);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [organizationData, setOrganizationData] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      address: '',
      website: '',
      contactPerson: '',
      email: '',
      mobile: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const resultAction = await dispatch(registerOrganization(values));

        if (registerOrganization.fulfilled.match(resultAction)) {
          toast.success(resultAction.payload.message);
          setOrganizationData(resultAction.payload.organization);
          setShowOtpModal(true);
        } else if (registerOrganization.rejected.match(resultAction)) {
          toast.error(resultAction.payload?.message || "Registration failed");
        }
      } catch (error) {
        toast.error("Something went wrong. Please try again.");
      }
    },
  });

  const handleOtpVerificationSuccess = () => {
    formik.resetForm();
    onClose();
    toast.success("Organization verified successfully!");
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 max-h-[350px] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter organization name"
              {...formik.getFieldProps("name")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              required
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-xs">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter organization address"
              {...formik.getFieldProps("address")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              required
            />
            {formik.touched.address && formik.errors.address && (
              <div className="text-red-500 text-xs">{formik.errors.address}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              name="website"
              placeholder="Enter website URL"
              {...formik.getFieldProps("website")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            />
            {formik.touched.website && formik.errors.website && (
              <div className="text-red-500 text-xs">{formik.errors.website}</div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              placeholder="Enter contact person name"
              {...formik.getFieldProps("contactPerson")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            />
            {formik.touched.contactPerson && formik.errors.contactPerson && (
              <div className="text-red-500 text-xs">{formik.errors.contactPerson}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              {...formik.getFieldProps("email")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-xs">{formik.errors.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
            <input
              type="text"
              name="mobile"
               placeholder="Enter mobile number"
              {...formik.getFieldProps("mobile")}
              className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="text-red-500 text-xs">{formik.errors.mobile}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
             placeholder="Create a password"
            {...formik.getFieldProps("password")}
            className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            required
          />
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-xs">{formik.errors.password}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
             placeholder="Confirm your password"
            {...formik.getFieldProps("confirmPassword")}
            className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
            required
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
          )}
        </div>
        </div>
        <div className="sticky bottom-0 bg-white pt-4 pb-2 mt-4 border-t border-gray-100">

        <div className="flex flex-col sm:flex-row justify-between items-center px-2">
          <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-0">
            Already have an account?{" "}
            <button
              type="button"
              className="text-lightBlue-600 hover:underline font-medium"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
            >
              Login here
            </button>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                dispatch(resetAuthState());
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/20 transition-all text-sm"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </div>
        </div>
      </form>

      {showOtpModal && organizationData && (
        <OTPModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          email={organizationData.email}
          onVerified={handleOtpVerificationSuccess}
          resendEndpoint="http://localhost:5000/v1/api/organization/resend-otp"
          verifyEndpoint="http://localhost:5000/v1/api/organization/verify-otp"
        />
      )}
    </div>
  );
};

export default OrganizationRegistration;