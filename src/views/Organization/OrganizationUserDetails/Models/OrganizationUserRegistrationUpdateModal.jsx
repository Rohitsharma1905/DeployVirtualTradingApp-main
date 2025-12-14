// import React from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { registerOrganizationUser, updateOrganizationUser, resetUserState } from "../../../../redux/Organization/users/organizationUsersSlice";
// import toast, { Toaster } from "react-hot-toast";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../../../../assets/styles/customDatePicker.css";

// // Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters")
//   .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
//   email: Yup.string().email("Invalid email format").required("Email is required"),
//   mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits").required("Mobile number is required"),
//   gender: Yup.string().required("Gender is required"),
//   dob: Yup.date().required("Date of Birth is required").test("age", "You must be at least 18 years old", function (value) {
//     return new Date().getFullYear() - new Date(value).getFullYear() >= 18;
//   }),
//   addedby: Yup.string().required("Added by is required"),
// });

// const OrganizationUserRegistration = ({ isOpen, onClose, initialValues, refreshStudents, refreshDashboard }) => {
//   const dispatch = useDispatch();
//   const { loading, error, success } = useSelector((state) => state.organization.users);
//   const orgName = localStorage.getItem("orgName");

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       email: "",
//       mobile: "",
//       gender: "",
//       dob: "",
//       addedby: "",

//       // status: "",

//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         if (initialValues) {
//           await dispatch(updateOrganizationUser({ id: initialValues._id, userData: values }));
//           onClose();
//         } else {
//           await dispatch(registerOrganizationUser(values));
//         }

//         // resetForm(); // Reset form values
//         onClose(); // Close the modal after successful submission
//         refreshStudents();
//       } catch (error) {
//         console.error("Error submitting form:", error);
//       }
//     },
//     enableReinitialize: true,
//   });

//   React.useEffect(() => {
//     if (!isOpen) {
//       dispatch(resetUserState());
//     }
//   }, [isOpen, dispatch]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto">
//       <Toaster />
//       <div className="fixed inset-0 bg-gray-900 opacity-50"></div>

//       <div className="relative w-full mx-4 sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[80vh] max-w-[90%] z-50 sm:max-w-[80%]">
//         {/* Modal Header - Sticky */}
//         <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 rounded-t-2xl">
//           <div className="flex items-center space-x-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-building text-white text-sm sm:text-base"></i>
//             </div>
//             <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
//               {initialValues ? "Edit User" : "Sign Up"}
//             </h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-1 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600 text-sm sm:text-base"></i>
//           </button>
//         </div>

//         {/* Modal Body - Scrollable */}
//         <div className="overflow-y-auto flex-grow px-4 sm:px-6 py-4">
//           <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {/* Left Column */}
//               <div className="space-y-3 sm:space-y-4">
//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formik.values.name}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 
//                       bg-white text-gray-900 
//                       focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                       focus:outline-none transition-all duration-200"
//                     placeholder="Enter name"
//                     required
//                   />
//                   {formik.touched.name && formik.errors.name ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.name}</div>
//                   ) : null}
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formik.values.email}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 
//                       bg-white text-gray-900 
//                       focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                       focus:outline-none transition-all duration-200"
//                     placeholder="Enter email address"
//                     required
//                   />
//                   {formik.touched.email && formik.errors.email ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</div>
//                   ) : null}
//                 </div>

//                 {/* Mobile */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
//                   <input
//                     type="text"
//                     name="mobile"
//                     value={formik.values.mobile}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 
//                       bg-white text-gray-900 
//                       focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                       focus:outline-none transition-all duration-200"
//                     placeholder="Enter mobile number"
//                     required
//                   />
//                   {formik.touched.mobile && formik.errors.mobile ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.mobile}</div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-3 sm:space-y-4">
//                 {/* Gender */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                   <select
//                     name="gender"
//                     value={formik.values.gender}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-200 
//                       focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 
//                       transition-all duration-200"
//                     required
//                   >
//                     <option value="">Select Gender</option>
//                     <option value="Male">Male</option>
//                     <option value="Female">Female</option>
//                     <option value="Other">Other</option>
//                   </select>
//                   {formik.touched.gender && formik.errors.gender ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.gender}</div>
//                   ) : null}
//                 </div>

//                 {/* Date of Birth */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                   <DatePicker
//                     selected={formik.values.dob ? new Date(formik.values.dob) : null}
//                     onChange={(date) => formik.setFieldValue("dob", date)}
//                     dateFormat="yyyy-MM-dd"
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-200 
//                       focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 
//                       transition-all duration-200"
//                     placeholderText="Select date of birth"
//                     showYearDropdown
//                     scrollableYearDropdown
//                     yearDropdownItemNumber={100}
//                     required
//                   />
//                   {formik.touched.dob && formik.errors.dob ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.dob}</div>
//                   ) : null}
//                 </div>

//                 {/* Added By */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Added By</label>
//                   <input
//                     type="text"
//                     name="addedby"
//                     value={formik.values.addedby}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 
//                       bg-white text-gray-900 
//                       focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//                       focus:outline-none transition-all duration-200"
//                     placeholder="Enter added by"
//                     required
//                   />
//                   {formik.touched.addedby && formik.errors.addedby ? (
//                     <div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.addedby}</div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>
//           </form>
//         </div>

//         {/* Footer - Sticky */}
//         <div className="sticky bottom-0 z-10 bg-white flex justify-end items-center space-x-3 sm:space-x-4 p-4 sm:p-6 border-t border-gray-100 rounded-b-2xl">
//           <button
//             type="button"
//             onClick={() => {
//               formik.resetForm();
//               onClose();
//             }}
//             className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             onClick={formik.handleSubmit}
//             className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white 
//               hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all 
//               duration-200 text-sm sm:text-base"
//           >
//             {loading ? "Processing..." : initialValues ? "Update User" : "Register User"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationUserRegistration;


import React, { useEffect, useRef } from "react"; // Added useRef
import ReactDOM from 'react-dom'; // IMPORT ReactDOM for Portals
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerOrganizationUser, updateOrganizationUser, resetUserState } from "../../../../redux/Organization/users/organizationUsersSlice";
import toast, { Toaster } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../assets/styles/customDatePicker.css"; // Ensure this path is correct

// Validation schema from your original code
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits").required("Mobile number is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.date().required("Date of Birth is required").test("age", "You must be at least 18 years old", function (value) {
    if (!value) return true; // This was likely a mistake if dob is required. Let's assume it is, so !value is an error.
                           // If DOB can be nullable but still validated for age if present, adjust schema.
                           // For a required date, this condition should perhaps be: if (!value) return false;
    return new Date().getFullYear() - new Date(value).getFullYear() >= 18;
  }),
  addedby: Yup.string().required("Added by is required"),
});

const OrganizationUserRegistration = ({ isOpen, onClose, initialValues, refreshStudents }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.organization.users);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      email: "",
      mobile: "",
      gender: "",
      dob: "", // Per your original snippet
      addedby: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (initialValues && initialValues._id) {
          await dispatch(updateOrganizationUser({ id: initialValues._id, userData: values })).unwrap();
        } else {
          await dispatch(registerOrganizationUser(values)).unwrap();
        }
        toast.success(initialValues?._id ? "User updated successfully!" : "User registered successfully!");
        resetForm();
        onClose();
        if (refreshStudents) refreshStudents();
      } catch (err) {
        toast.error(err.message || (initialValues?._id ? "Failed to update user." : "Failed to register user."));
        console.error("Error submitting form:", err);
      }
    },
    enableReinitialize: true,
  });

  // useRef to track previous isOpen state to prevent infinite loop
  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (prevIsOpen.current && !isOpen) { // Only run if modal changed from open to closed
      formik.resetForm();
      dispatch(resetUserState());
    }
    prevIsOpen.current = isOpen; // Update ref for next render
  }, [isOpen, dispatch, formik]); // formik dependency is okay here due to prevIsOpen check

  if (!isOpen) return null;

  const modalContent = (
    // Modal Wrapper - VERY HIGH Z-INDEX
    <div className="fixed inset-0 z-[5000] flex items-center justify-center overflow-y-auto p-4">
      <Toaster position="top-center" reverseOrder={false} containerClassName="z-[6000]" />
      
      {/* Backdrop - HIGH Z-INDEX (below modal content) */}
      <div className="fixed inset-0 bg-gray-900 opacity-50 z-[4990]" onClick={onClose}></div>

      {/* Modal Content Container - UI structure from your original file */}
      <div className="relative w-full mx-4 sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col max-h-[80vh] max-w-[90%] z-[5000] sm:max-w-[80%]">
        {/* Modal Header - UI as per your original */}
        <div className="sticky top-0 z-10 bg-white flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-building text-white text-sm sm:text-base"></i>
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
              {initialValues ? "Edit User" : "Sign Up"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600 text-sm sm:text-base"></i>
          </button>
        </div>

        {/* Modal Body - UI as per your original */}
        <div className="overflow-y-auto flex-grow px-4 sm:px-6 py-4">
          <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter name" required
                  />
                  {formik.touched.name && formik.errors.name ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.name}</div>) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter email address" required
                  />
                  {formik.touched.email && formik.errors.email ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.email}</div>) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter mobile number" required
                  />
                  {formik.touched.mobile && formik.errors.mobile ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.mobile}</div>) : null}
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
                    required
                  >
                    <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                  {formik.touched.gender && formik.errors.gender ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.gender}</div>) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <DatePicker
                  // popperPlacement="bottom-start"
                  // popperModifiers={[
                  //   {
                  //     name: 'flip',
                  //     options: {
                  //       fallbackPlacements: ['top-start', 'bottom-start'],
                  //     },
                  //   },
                  //   {
                  //     name: 'preventOverflow',
                  //     options: {
                  //       boundary: 'clippingParents',
                  //     },
                  //   },
                  // ]}
                    selected={formik.values.dob ? new Date(formik.values.dob) : null}
                    onChange={(date) => formik.setFieldValue("dob", date)}
                    onBlur={() => formik.setFieldTouched("dob", true)} name="dob" dateFormat="yyyy-MM-dd"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
                    placeholderText="Select date of birth" showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} required popperClassName="z-[6000]" 
                  />
                  {formik.touched.dob && formik.errors.dob ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.dob}</div>) : null}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Added By</label>
                  <input
                    type="text" name="addedby" value={formik.values.addedby} onChange={formik.handleChange} onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
                    placeholder="Enter added by" required
                  />
                  {formik.touched.addedby && formik.errors.addedby ? (<div className="text-red-500 text-xs sm:text-sm mt-1">{formik.errors.addedby}</div>) : null}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer - UI as per your original */}
        <div className="sticky bottom-0 z-10 bg-white flex justify-end items-center space-x-3 sm:space-x-4 p-4 sm:p-6 border-t border-gray-100 rounded-b-2xl">
          <button
            type="button" onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm sm:text-base"
          >Cancel</button>
          <button
            type="submit" disabled={loading || !formik.isValid || !formik.dirty} onClick={formik.handleSubmit}
            className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200 text-sm sm:text-base"
          >
            {loading ? "Processing..." : initialValues ? "Update User" : "Register User"}
          </button>
        </div>
      </div>
    </div>
  );

  // Render into the portal
  return ReactDOM.createPortal(
    modalContent,
    document.getElementById('modal-root') // Ensure 'modal-root' div exists in your public/index.html
  );
};

export default OrganizationUserRegistration;