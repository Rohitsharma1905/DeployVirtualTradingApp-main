// OrganizationRegistrationForm.jsx - PART 1 of 3

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from "formik"; // Using Formik components
import * as Yup from "yup";
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

// --- Redux Slice Imports ---
import {
  registerOrganization,
  updateOrganization,
  resetForm, // Action to reset the slice's form-related state
  selectRegistrationState // Selector to get the entire slice state
} from '../../../redux/Admin/OrganizationListPage/OrganizationRegisterSlice'; // Adjust path if needed

// --- Action to fetch organizations (adjust path) ---
import { fetchOrganizations } from '../../../redux/Organization/auth/organizationAuthSlice';

// === Component Definition ===
const OrganizationRegistrationForm = ({ isOpen, onClose, selectedOrg, onSuccess }) => {
  const dispatch = useDispatch();

  // --- Select Redux State ---
  // Using a single selector for the relevant part of the state
  const {
    isLoading,
    error, // Error message/object from the slice state
    notification // Separate notification state if needed, or rely on error/success
  } = useSelector(selectRegistrationState); // Use the main state selector

  // --- Initial Form Values ---
  // Use useMemo to compute initial values only when selectedOrg changes
  const initialValues = useMemo(() => ({
    name: selectedOrg?.name || "",
    address: selectedOrg?.address || "",
    website: selectedOrg?.website || "", // Allow empty string
    contactPerson: selectedOrg?.contactPerson || "",
    email: selectedOrg?.email || "",
    mobile: selectedOrg?.mobile || "",
    // Password is not part of the form fields the user interacts with
    // approvalStatus is handled by backend
  }), [selectedOrg]); // Recalculate only if selectedOrg changes

  // --- Yup Validation Schema (Aligned with Backend Joi) ---
  // This validates the fields the user *inputs*
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Organization Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must not exceed 100 characters"),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters"),
    website: Yup.string()
      .url("Website must be a valid URL (e.g., http://example.com)")
      .nullable(), // Allows empty input, which Formik treats as null/empty string
    contactPerson: Yup.string()
      .required("Contact Person is required")
      .min(2, "Contact person name must be at least 2 characters"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobile: Yup.string()
      // Matches backend Joi pattern
      .matches(/^[9876]\d{9}$/, "Mobile number must be 10 digits and start with 9, 8, 7, or 6")
      .required("Mobile number is required"),
    // NO 'password' validation here - user doesn't input it.
  });

  // --- End of Part 1 ---
  // (Part 2 will contain generatePassword and handleSubmit)
  // (Part 3 will contain useEffects and JSX)
  // OrganizationRegistrationForm.jsx - PART 2 of 3
// (Continues from Part 1)

  // --- Helper Function: Generate Password ---
  // This function prepares the password *before* sending data to the backend
  // during registration.
  const generatePassword = (orgName) => {
    const baseName = String(orgName || 'Org').replace(/[^a-zA-Z0-9]/g, '');
    const maxNameLength = 11; // Max 15 total: 11 name + 1 symbol + 3 numbers
    const namePart = baseName.slice(0, maxNameLength);
    const symbols = ['@', '#', '$', '%', '&', '*', '!'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const randomNumbers = String(Math.floor(Math.random() * 900 + 100)).padStart(3, '0'); // Ensure 3 digits

    const generated = `${namePart}${randomSymbol}${randomNumbers}`;
    // Ensure final length doesn't exceed constraints (though logic aims for <=15)
    const finalPassword = generated.slice(0, 15);
    console.log("Generated Password:", finalPassword);
    return finalPassword;
  };

  // --- Form Submission Handler ---
  const handleSubmit = async (values, { setSubmitting, setFieldError, resetForm: formikResetForm }) => {
    // Use try-catch to handle errors from dispatch().unwrap()
    try {
      // Trim string values automatically
      const cleanedValues = Object.entries(values).reduce((acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? value.trim() : value;
          return acc;
      }, {});


      if (selectedOrg) {
        // --- UPDATE ORGANIZATION ---
        // Prepare payload, potentially removing fields that shouldn't be updated
        const updatePayload = { ...cleanedValues };
        // Example: If email should not be updatable
        // delete updatePayload.email;

        console.log("Dispatching updateOrganization:", { id: selectedOrg._id, data: updatePayload });

        // Dispatch update action and await its unwrapped result/error
        const result = await dispatch(updateOrganization({
          id: selectedOrg._id,
          data: updatePayload
        })).unwrap(); // .unwrap() is key for RTK error handling

        toast.success(result?.message || 'Organization updated successfully!');
        dispatch(fetchOrganizations()); // Refresh list
        onSuccess?.(); // Callback for parent component
        onClose(); // Close modal

      } else {
        // --- REGISTER NEW ORGANIZATION ---
        const generatedPassword = generatePassword(cleanedValues.name); // Use cleaned name
        const registrationData = {
          ...cleanedValues,
          password: generatedPassword, // Add generated password to the data sent
          // approvalStatus is set by backend
        };

        console.log("Dispatching registerOrganization:", registrationData);

        // Dispatch register action and await its unwrapped result/error
        const result = await dispatch(registerOrganization(registrationData)).unwrap(); // .unwrap()

        toast.success(result?.message || 'Organization registered successfully!');
        dispatch(fetchOrganizations()); // Refresh list
        onSuccess?.(); // Callback
        onClose(); // Close modal
      }

      // Reset forms only on SUCCESS (handled within try block)
      formikResetForm(); // Reset Formik's internal state
      dispatch(resetForm()); // Reset Redux slice state (error, isLoading, etc.)

    } catch (err) {
      // --- ERROR HANDLING ---
      // Catches errors from .unwrap() (rejected thunks) or other sync errors
      console.error('handleSubmit Error:', err);

      // Extract message from the rejected payload (err) or provide a fallback
      const errorMessage = err?.message || 'An operation failed. Please try again.';
      toast.error(errorMessage);

      // Handle field-specific errors from backend validation (passed via rejectWithValue)
      if (err?.fieldErrors && typeof setFieldError === 'function') {
        Object.entries(err.fieldErrors).forEach(([field, message]) => {
          setFieldError(field, message); // Display error next to the specific field
        });
      } else if (errorMessage.toLowerCase().includes('email already exists')) {
         // Example of handling specific error messages if fieldErrors aren't provided
         if (typeof setFieldError === 'function') {
            setFieldError('email', 'This email is already registered.');
         }
      }
      // NOTE: No need to dispatch error to Redux here, as the rejected
      // thunk action handled by extraReducers already updates the state.error

    } finally {
      // Ensure the submitting state is always turned off
      // Check if setSubmitting is a function before calling
       if (typeof setSubmitting === 'function') {
          setSubmitting(false);
       }
    }
  };

  // --- End of Part 2 ---
  // (Part 3 will contain useEffects and JSX)
  // OrganizationRegistrationForm.jsx - PART 3 of 3
// (Continues from Part 2)

  // --- useEffect Hooks ---

  // Effect to reset Redux slice state when the modal is closed or unmounted
  useEffect(() => {
    return () => {
      // Only dispatch reset if the modal is not open (i.e., on close/unmount)
      // This prevents resetting state while it might still be needed (e.g., showing error)
      // The reset on successful submission happens inside handleSubmit
      if (!isOpen) {
         dispatch(resetForm());
      }
    };
  }, [isOpen, dispatch]); // Rerun when isOpen changes or dispatch function changes


  // --- Conditional Rendering: Don't render if not open ---
  if (!isOpen) return null;


  // --- JSX Structure ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-gray-900 opacity-50 transition-opacity" onClick={onClose} />

      {/* --- MOBILE VIEW --- */}
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden sm:hidden max-h-[90vh]"> {/* Increased max-h */}
        {/* Mobile Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-md">
              <i className="fas fa-building text-white text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800"> {/* Adjusted size */}
              {selectedOrg ? "Edit Organization" : "Register Organization"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" /* Adjusted padding/shape */
          >
            <i className="fas fa-times text-gray-500 hover:text-gray-700 text-base" /> {/* Adjusted size/color */}
          </button>
        </div>

        {/* Mobile Notification/Error Display */}
        {error && ( // Only display if there's an error from Redux state
          <div className={`p-3 mx-4 mt-3 text-xs rounded-lg text-red-700 bg-red-100`}>
            {/* Safely access error message */}
            {typeof error === 'object' && error !== null ? error.message : error}
          </div>
        )}

        {/* Mobile Form Content Area with Scrolling */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}> {/* Dynamic max height */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize // Important if selectedOrg can change while modal is open
          >
            {({ isSubmitting, isValid }) => (
              <Form className="space-y-4">
                {/* Single Column Layout for Mobile */}
                <FormField name="name" label="Organization Name" required placeholder="Enter organization name"/>
                <FormField name="address" label="Address" required placeholder="Enter address"/>
                <FormField name="website" label="Website" placeholder="http://example.com"/>
                <FormField name="contactPerson" label="Contact Person" required placeholder="Enter contact person"/>
                <FormField name="email" type="email" label="Email" required placeholder="Enter email address"/>
                <FormField name="mobile" label="Mobile" required placeholder="Enter mobile number"/>

                 {/* Info Box for Registration */}
                {!selectedOrg && (
                    <div className="bg-blue-50 p-3 rounded-lg mt-2">
                        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                            <li>A secure password will be generated.</li>
                            <li>Login details sent via email.</li>
                        </ul>
                    </div>
                )}

                {/* Mobile Action Buttons (Sticky Footer Simulation) */}
                {/* Wrap actions in a div that stays at the bottom */}
                 <div className="pt-4 mt-4 border-t border-gray-100">
                   <div className="flex justify-end items-center space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading || isSubmitting}
                        className="px-4 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors text-sm disabled:opacity-60"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting || !isValid}
                        className="px-4 py-2 rounded-lg bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/30 transition-all disabled:opacity-60 flex items-center justify-center text-sm"
                      >
                        {/* Loading/Submit Text */}
                        {isLoading || isSubmitting ? (
                            <> {/* Spinner */} </>
                        ) : (selectedOrg ? "Update" : "Register")}
                      </button>
                    </div>
                 </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>


      {/* --- DESKTOP VIEW --- */}
      <div className="relative hidden sm:block lg:w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Desktop Header */}
         <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-building text-white text-base" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                {selectedOrg ? "Edit Organization" : "Register New Organization"}
                </h2>
            </div>
            <button onClick={onClose} disabled={isLoading} className="p-2 hover:bg-gray-100 rounded-full transition-colors"> {/* Rounded button */}
                <i className="fas fa-times text-gray-500 hover:text-gray-700 text-xl" /> {/* Larger icon */}
            </button>
        </div>

        {/* Desktop Notification/Error Display */}
        {error && ( // Only display if there's an error from Redux state
           <div className={`p-4 mx-6 mt-4 text-sm rounded-lg text-red-800 bg-red-100 border border-red-200`}> {/* Enhanced styling */}
             <i className="fas fa-exclamation-triangle mr-2"></i> {/* Icon */}
             {typeof error === 'object' && error !== null ? error.message : error}
           </div>
        )}

        {/* Desktop Form Content Area with Scrolling */}
        <div className="p-6 max-h-[75vh] overflow-y-auto"> {/* Adjusted max height */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting, isValid }) => (
              <Form>
                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8"> {/* Adjusted gaps */}
                  {/* Left Column */}
                  <div className="space-y-5"> {/* Consistent spacing */}
                    <FormField name="name" label="Organization Name" required placeholder="Enter organization name"/>
                    <FormField name="website" label="Website" placeholder="http://example.com"/>
                    <FormField name="contactPerson" label="Contact Person" required placeholder="Enter contact person"/>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-5">
                    <FormField name="email" type="email" label="Email" required placeholder="Enter email address"/>
                    <FormField name="address" label="Address" required placeholder="Enter address"/>
                    <FormField name="mobile" label="Mobile" required placeholder="Enter mobile number"/>

                    {/* Info Box for Registration */}
                    {!selectedOrg && (
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-1"> {/* Added border */}
                            <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                               <i className="fas fa-info-circle mr-2"></i> Registration Info
                            </h4>
                            <ul className="text-xs text-blue-700 space-y-1.5 pl-1"> {/* Adjusted spacing/padding */}
                               <li>A secure password (max 15 chars) will be generated.</li>
                               <li>Login credentials will be sent via email upon success.</li>
                               <li>Ensure all required fields (*) are accurate.</li>
                            </ul>
                        </div>
                    )}
                  </div>
                </div>

                {/* Desktop Action Buttons (Sticky Footer) */}
                <div className="sticky bottom-0 bg-white pt-5 pb-1 -mx-6 px-6 border-t border-gray-200"> {/* Adjusted padding/border */}
                  <div className="flex justify-end items-center space-x-4">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading || isSubmitting}
                      className="px-6 py-2.5 rounded-lg text-gray-800 bg-gray-100 hover:bg-gray-200 transition-colors text-base font-medium disabled:opacity-60" // Adjusted style
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting || !isValid}
                      className="px-6 py-2.5 rounded-lg bg-lightBlue-600 text-white hover:bg-lightBlue-700 focus:ring-2 focus:ring-offset-2 focus:ring-lightBlue-500 transition-all text-base font-medium disabled:opacity-60 flex items-center justify-center" // Adjusted style
                    >
                      {isLoading || isSubmitting ? (
                        <> {/* Loading spinner */} </>
                      ) : (selectedOrg ? "Update Organization" : "Register Organization")}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div> {/* End Desktop View */}
    </div> // End Modal Wrapper
  );
}; // End Component


// === Reusable Form Field Component ===
// (Placed outside the main component for clarity)
const FormField = ({ name, label, required = false, type = "text", placeholder = "", className = "" }) => (
  <div className={`flex flex-col ${className}`}> {/* Ensure vertical layout */}
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5"> {/* Increased bottom margin */}
      {label} {required && <span className="text-red-500 ml-1">*</span>} {/* Added margin */}
    </label>
    <Field
      id={name} // Added id for label association
      type={type}
      name={name}
      className={`w-full px-4 py-2.5 rounded-lg border border-gray-300 // Adjusted styles
                  bg-white text-gray-900 placeholder-gray-400
                  focus:border-lightBlue-500 focus:ring-1 focus:ring-lightBlue-500
                  focus:outline-none transition duration-150 ease-in-out
                  disabled:bg-gray-50 disabled:cursor-not-allowed`} // Added disabled styles
      placeholder={placeholder}
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-600 text-xs mt-1.5" // Adjusted style/margin
    />
  </div>
);

// --- PropTypes ---
FormField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

OrganizationRegistrationForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedOrg: PropTypes.object, // Can be null or undefined
  onSuccess: PropTypes.func, // Optional callback
};

// --- Default Export ---
export default OrganizationRegistrationForm;