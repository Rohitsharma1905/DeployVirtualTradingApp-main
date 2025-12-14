
// // updapte and remove iimage

// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrgById, updateOrgDetails } from "../../../../redux/Organization/auth/organizationAuthSlice";
// import toast, { Toaster } from "react-hot-toast";

// // Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   address: Yup.string().required("Address is required"),
//   website: Yup.string().url("Invalid URL format"),
//   contactPerson: Yup.string(),
//   email: Yup.string().email("Invalid email format").required("Email is required"),
//   mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits"),
//   password: Yup.string().min(6, "Password must be at least 6 characters"),
//   photo: Yup.string().url("Invalid URL format"),
// });

// const OrganizationProfileModal = ({ isOpen, onClose, initialValues, refreshData }) => {
//   const dispatch = useDispatch();
//   const { loading, orgId } = useSelector((state) => state.organization.auth);
//   const [photo, setPhoto] = useState(initialValues?.photo || "");
//   const [isPhotoHovered, setIsPhotoHovered] = useState(false);

//   // Fetch organization data when the modal opens
//   useEffect(() => {
//     if (isOpen && orgId) {
//       dispatch(fetchOrgById(orgId));
//     }
//   }, [isOpen, orgId, dispatch]);

//   // Update photo state when initialValues change
//   useEffect(() => {
//     if (initialValues?.photo) {
//       setPhoto(initialValues.photo);
//     }
//   }, [initialValues]);

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       address: "",
//       website: "",
//       contactPerson: "",
//       email: "",
//       mobile: "",
//       password: "",
//       photo: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const updatedValues = { ...values, photo }; // Include the photo in the update
//         await dispatch(updateOrgDetails({ orgId, orgData: updatedValues }));
//         toast.success("Organization details updated successfully!");
//         onClose();
//         refreshData(); // Refresh the data in the parent component
//       } catch (error) {
//         toast.error("Failed to update organization details.");
//       }
//     },
//     enableReinitialize: true, // Reinitialize form values when initialValues change
//   });

//   // Handle photo file upload
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle photo removal
//   const handleRemovePhoto = () => {
//     toast.success("photo removed. click on update profile to save the changes");
//     setPhoto("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png");
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-45 flex items-center justify-center overflow-y-auto">
//       <Toaster />

//       <div className="fixed inset-0 bg-gray-900 opacity-50 z-40"></div>
//       <div style={{ width: "100%", maxWidth: "80%" }} className="relative w-full max-w-4xl p-6 mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">

//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-building text-white"></i>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Organization Profile</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6 overflow-y-auto max-h-[80vh]">
//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-4">
//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formik.values.name}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization name"
//                     required
//                   />
//                   {formik.touched.name && formik.errors.name ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
//                   ) : null}
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formik.values.address}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization address"
//                     required
//                   />
//                   {formik.touched.address && formik.errors.address ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
//                   ) : null}
//                 </div>

//                 {/* Website */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//                   <input
//                     type="text"
//                     name="website"
//                     value={formik.values.website}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization website"
//                   />
//                   {formik.touched.website && formik.errors.website ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
//                   ) : null}
//                 </div>

//                 {/* Contact Person */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
//                   <input
//                     type="text"
//                     name="contactPerson"
//                     value={formik.values.contactPerson}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter contact person name"
//                   />
//                   {formik.touched.contactPerson && formik.errors.contactPerson ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.contactPerson}</div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-4">
//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formik.values.email}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization email"
//                     required
//                   />
//                   {formik.touched.email && formik.errors.email ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
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
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization mobile number"
//                   />
//                   {formik.touched.mobile && formik.errors.mobile ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
//                   ) : null}
//                 </div>

//                 {/* Password */}
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
//                     placeholder="Enter new password (leave blank to keep current)"
//                   />
//                   {formik.touched.password && formik.errors.password ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
//                   ) : null}
//                 </div>

//                 {/* Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//                   <div
//                     className="relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer"
//                     onMouseEnter={() => setIsPhotoHovered(true)}
//                     onMouseLeave={() => setIsPhotoHovered(false)}
//                     onClick={() => document.getElementById("photo-upload").click()}
//                   >
//                     <img
//                       src={photo || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
//                       alt="Organization"
//                       className="w-full h-full object-cover"
//                     />
//                     {isPhotoHovered && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <span className="text-white text-sm">Change Photo</span>
//                       </div>
//                     )}
//                   </div>
//                   <input
//                     type="file"
//                     id="photo-upload"
//                     onChange={handlePhotoChange}
//                     className="hidden"
//                   />
//                   {photo !== "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png" && (
//                     <button
//                       type="button"
//                       onClick={handleRemovePhoto}
//                       className="-mt-10 text-sm text-black font-semibold hover:opacity-80 ml-24 px-2 py-2 rounded-xl"
//                     >
//                       Remove Photo
//                     </button>
//                   )}
//                   {formik.touched.photo && formik.errors.photo ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.photo}</div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={() => {
//                   formik.resetForm();
//                   onClose();
//                 }}
//                 className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
//               >
//                 {loading ? "Updating..." : "Update Profile"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationProfileModal;



// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrgById, updateOrgDetails } from "../../../../redux/Organization/auth/organizationAuthSlice";
// import toast, { Toaster } from "react-hot-toast";

// // Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   address: Yup.string().required("Address is required"),
//   website: Yup.string().url("Invalid URL format"),
//   contactPerson: Yup.string(),
//   email: Yup.string().email("Invalid email format").required("Email is required"),
//   mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits"),
//   photo: Yup.string().url("Invalid URL format"),
// });

// const OrganizationProfileModal = ({ isOpen, onClose, initialValues, refreshData }) => {
//   const dispatch = useDispatch();
//   const { loading, orgId } = useSelector((state) => state.organization.auth);
//   const [photo, setPhoto] = useState(initialValues?.photo || "");
//   const [isPhotoHovered, setIsPhotoHovered] = useState(false);

//   // Fetch organization data when the modal opens
//   useEffect(() => {
//     if (isOpen && orgId) {
//       dispatch(fetchOrgById(orgId));
//     }
//   }, [isOpen, orgId, dispatch]);

//   // Update photo state when initialValues change
//   useEffect(() => {
//     if (initialValues?.photo) {
//       setPhoto(initialValues.photo);
//     }
//   }, [initialValues]);

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       address: "",
//       website: "",
//       contactPerson: "",
//       email: "",
//       mobile: "",
//       photo: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const updatedValues = { ...values, photo }; // Include the photo in the update
//         await dispatch(updateOrgDetails({ orgId, orgData: updatedValues }));
//         toast.success("Organization details updated successfully!");
//         onClose();
//         refreshData(); // Refresh the data in the parent component
//       } catch (error) {
//         toast.error("Failed to update organization details.");
//       }
//     },
//     enableReinitialize: true, // Reinitialize form values when initialValues change
//   });

//   // Handle photo file upload
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle photo removal
//   const handleRemovePhoto = () => {
//     toast.success("Photo removed. Click on update profile to save the changes");
//     setPhoto("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png");
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//       <Toaster />

//       <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
//       <div style={{ width: "100%", maxWidth: "80%" }} className="relative w-full max-w-4xl p-6 mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-building text-white"></i>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Organization Profile</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6 overflow-y-auto max-h-[80vh] z-50">
//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-4">
//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formik.values.name}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization name"
//                     required
//                   />
//                   {formik.touched.name && formik.errors.name ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
//                   ) : null}
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formik.values.address}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization address"
//                     required
//                   />
//                   {formik.touched.address && formik.errors.address ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
//                   ) : null}
//                 </div>

//                 {/* Website */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//                   <input
//                     type="text"
//                     name="website"
//                     value={formik.values.website}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization website"
//                   />
//                   {formik.touched.website && formik.errors.website ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
//                   ) : null}
//                 </div>

//                 {/* Contact Person */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
//                   <input
//                     type="text"
//                     name="contactPerson"
//                     value={formik.values.contactPerson}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter contact person name"
//                   />
//                   {formik.touched.contactPerson && formik.errors.contactPerson ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.contactPerson}</div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-4">
//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formik.values.email}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization email"
//                     required
//                   />
//                   {formik.touched.email && formik.errors.email ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
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
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization mobile number"
//                   />
//                   {formik.touched.mobile && formik.errors.mobile ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
//                   ) : null}
//                 </div>

//                 {/* Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//                   <div
//                     className="relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer"
//                     onMouseEnter={() => setIsPhotoHovered(true)}
//                     onMouseLeave={() => setIsPhotoHovered(false)}
//                     onClick={() => document.getElementById("photo-upload").click()}
//                   >
//                     <img
//                       src={photo || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
//                       alt="Organization"
//                       className="w-full h-full object-cover"
//                     />
//                     {isPhotoHovered && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <span className="text-white text-sm">Change Photo</span>
//                       </div>
//                     )}
//                   </div>
//                   <input
//                     type="file"
//                     id="photo-upload"
//                     onChange={handlePhotoChange}
//                     className="hidden"
//                   />
//                   {photo !== "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png" && (
//                     <button
//                       type="button"
//                       onClick={handleRemovePhoto}
//                       className="-mt-10 text-sm text-black font-semibold hover:opacity-80 ml-24 px-2 py-2 rounded-xl"
//                     >
//                       Remove Photo
//                     </button>
//                   )}
//                   {formik.touched.photo && formik.errors.photo ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.photo}</div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={() => {
//                   formik.resetForm();
//                   onClose();
//                 }}
//                 className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
//               >
//                 {loading ? "Updating..." : "Update Profile"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationProfileModal;









// new code after oush iomaeg upaod not working so to reolsbe this isuue 



// updapte and remove iimage
// image uplaod working but passworf is there
// import React, { useEffect, useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchOrgById, updateOrgDetails } from "../../../../redux/Organization/auth/organizationAuthSlice";
// import toast, { Toaster } from "react-hot-toast";

// // Validation schema
// const validationSchema = Yup.object({
//   name: Yup.string().required("Name is required"),
//   address: Yup.string().required("Address is required"),
//   website: Yup.string().url("Invalid URL format"),
//   contactPerson: Yup.string(),
//   email: Yup.string().email("Invalid email format").required("Email is required"),
//   mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits"),
//   password: Yup.string().min(6, "Password must be at least 6 characters"),
//   photo: Yup.string().url("Invalid URL format"),
// });

// const OrganizationProfileModal = ({ isOpen, onClose, initialValues, refreshData }) => {
//   const dispatch = useDispatch();
//   const { loading, orgId } = useSelector((state) => state.organization.auth);
//   const [photo, setPhoto] = useState(initialValues?.photo || "");
//   const [isPhotoHovered, setIsPhotoHovered] = useState(false);

//   // Fetch organization data when the modal opens
//   useEffect(() => {
//     if (isOpen && orgId) {
//       dispatch(fetchOrgById(orgId));
//     }
//   }, [isOpen, orgId, dispatch]);

//   // Update photo state when initialValues change
//   useEffect(() => {
//     if (initialValues?.photo) {
//       setPhoto(initialValues.photo);
//     }
//   }, [initialValues]);

//   const formik = useFormik({
//     initialValues: initialValues || {
//       name: "",
//       address: "",
//       website: "",
//       contactPerson: "",
//       email: "",
//       mobile: "",
//       password: "",
//       photo: "",
//     },
//     validationSchema: validationSchema,
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const updatedValues = { ...values, photo }; // Include the photo in the update
//         await dispatch(updateOrgDetails({ orgId, orgData: updatedValues }));
//         toast.success("Organization details updated successfully!");
//         onClose();
//         refreshData(); // Refresh the data in the parent component
//       } catch (error) {
//         toast.error("Failed to update organization details.");
//       }
//     },
//     enableReinitialize: true, // Reinitialize form values when initialValues change
//   });

//   // Handle photo file upload
//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPhoto(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle photo removal
//   const handleRemovePhoto = () => {
//     toast.success("photo removed. click on update profile to save the changes");
//     setPhoto("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png");
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//       <Toaster />

//       <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
//       <div style={{ width: "100%", maxWidth: "80%" }} className="relative w-full max-w-4xl p-6 mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">

//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-building text-white"></i>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Organization Profile</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6 overflow-y-auto max-h-[80vh] z-50">
//           <form onSubmit={formik.handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Left Column */}
//               <div className="space-y-4">
//                 {/* Name */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formik.values.name}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization name"
//                     required
//                   />
//                   {formik.touched.name && formik.errors.name ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
//                   ) : null}
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     value={formik.values.address}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization address"
//                     required
//                   />
//                   {formik.touched.address && formik.errors.address ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
//                   ) : null}
//                 </div>

//                 {/* Website */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
//                   <input
//                     type="text"
//                     name="website"
//                     value={formik.values.website}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization website"
//                   />
//                   {formik.touched.website && formik.errors.website ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
//                   ) : null}
//                 </div>

//                 {/* Contact Person */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
//                   <input
//                     type="text"
//                     name="contactPerson"
//                     value={formik.values.contactPerson}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter contact person name"
//                   />
//                   {formik.touched.contactPerson && formik.errors.contactPerson ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.contactPerson}</div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Right Column */}
//               <div className="space-y-4">
//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formik.values.email}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization email"
//                     required
//                   />
//                   {formik.touched.email && formik.errors.email ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
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
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200"
//                     placeholder="Enter organization mobile number"
//                   />
//                   {formik.touched.mobile && formik.errors.mobile ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
//                   ) : null}
//                 </div>

//                 {/* Password */}
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
//                     placeholder="Enter new password (leave blank to keep current)"
//                   />
//                   {formik.touched.password && formik.errors.password ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
//                   ) : null}
//                 </div>

//                 {/* Photo */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
//                   <div
//                     className="relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer"
//                     onMouseEnter={() => setIsPhotoHovered(true)}
//                     onMouseLeave={() => setIsPhotoHovered(false)}
//                     onClick={() => document.getElementById("photo-upload").click()}
//                   >
//                     <img
//                       src={photo || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
//                       alt="Organization"
//                       className="w-full h-full object-cover"
//                     />
//                     {isPhotoHovered && (
//                       <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//                         <span className="text-white text-sm">Change Photo</span>
//                       </div>
//                     )}
//                   </div>
//                   <input
//                     type="file"
//                     id="photo-upload"
//                     onChange={handlePhotoChange}
//                     className="hidden"
//                   />
//                   {photo !== "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png" && (
//                     <button
//                       type="button"
//                       onClick={handleRemovePhoto}
//                       className="-mt-10 text-sm text-black font-semibold hover:opacity-80 ml-24 px-2 py-2 rounded-xl"
//                     >
//                       Remove Photo
//                     </button>
//                   )}
//                   {formik.touched.photo && formik.errors.photo ? (
//                     <div className="text-red-500 text-sm mt-1">{formik.errors.photo}</div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={() => {
//                   formik.resetForm();
//                   onClose();
//                 }}
//                 className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
//               >
//                 {loading ? "Updating..." : "Update Profile"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationProfileModal;








// remove password from the profile


import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrgById, updateOrgDetails } from "../../../../redux/Organization/auth/organizationAuthSlice";
import toast, { Toaster } from "react-hot-toast";

// Validation schema (removed password field)
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required").min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters"),
  address: Yup.string().required("Address is required"),
  website: Yup.string().url("Invalid URL format"),
  contactPerson: Yup.string(),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  mobile: Yup.string().matches(/^[9876]\d{9}$/, "Mobile number must start with 9, 8, 7, or 6 and contain 10 digits"),
  photo: Yup.string().url("Invalid URL format"),
});

const OrganizationProfileModal = ({ isOpen, onClose, initialValues, refreshData }) => {
  const dispatch = useDispatch();
  const { loading, orgId } = useSelector((state) => state.organization.auth);
  const [photo, setPhoto] = useState(initialValues?.photo || "");
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);

  // Fetch organization data when the modal opens
  useEffect(() => {
    if (isOpen && orgId) {
      dispatch(fetchOrgById(orgId));
    }
  }, [isOpen, orgId, dispatch]);

  // Update photo state when initialValues change
  useEffect(() => {
    if (initialValues?.photo) {
      setPhoto(initialValues.photo);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues: initialValues || {
      name: "",
      address: "",
      website: "",
      contactPerson: "",
      email: "",
      mobile: "",
      photo: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const updatedValues = { ...values, photo }; // Include the photo in the update
        await dispatch(updateOrgDetails({ orgId, orgData: updatedValues }));
        toast.success("Organization details updated successfully!");
        localStorage.setItem("orgName", updatedValues.name);
        onClose();
        refreshData(); // Refresh the data in the parent component
      } catch (error) {
        toast.error("Failed to update organization details.");
      }
    },
    enableReinitialize: true, // Reinitialize form values when initialValues change
  });

  // Handle photo file upload
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle photo removal
  const handleRemovePhoto = () => {
    toast.success("Photo removed. Click on update profile to save the changes");
    setPhoto("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <Toaster />

      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div  className="relative w-full max-w-4xl max-h-[90vh] mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-100 rounded-xl sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-building text-white"></i>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Organization Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-4 md:px-6 py-4 md:py-6 flex-1 overflow-hidden">
          <form onSubmit={formik.handleSubmit} className="flex flex-col h-full">
          <div className="overflow-y-auto pr-2 max-h-[calc(90vh-136px)] px-4 md:px-6 py-4 md:py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter organization name"
                    required
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                  ) : null}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter organization address"
                    required
                  />
                  {formik.touched.address && formik.errors.address ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.address}</div>
                  ) : null}
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    name="website"
                    value={formik.values.website}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter organization website"
                  />
                  {formik.touched.website && formik.errors.website ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.website}</div>
                  ) : null}
                </div>

                {/* Contact Person */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formik.values.contactPerson}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter contact person name"
                  />
                  {formik.touched.contactPerson && formik.errors.contactPerson ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.contactPerson}</div>
                  ) : null}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter organization email"
                    required
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  ) : null}
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
             bg-white text-gray-900 
             focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
             focus:outline-none transition-all duration-200"
                    placeholder="Enter organization mobile number"
                  />
                  {formik.touched.mobile && formik.errors.mobile ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.mobile}</div>
                  ) : null}
                </div>

                {/* Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                  <div
                    className="relative w-24 h-24 rounded-xl overflow-hidden cursor-pointer"
                    onMouseEnter={() => setIsPhotoHovered(true)}
                    onMouseLeave={() => setIsPhotoHovered(false)}
                    onClick={() => document.getElementById("photo-upload").click()}
                  >
                    <img
                      src={photo || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
                      alt="Organization"
                      className="w-full h-full object-cover rounded-full"
                    />
                    {isPhotoHovered && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm">Change Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="photo-upload"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photo !== "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png" && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="-mt-10 text-sm text-black font-semibold hover:opacity-80 ml-24 px-2 py-2 rounded-xl"
                    >
                      Remove Photo
                    </button>
                  )}
                  {formik.touched.photo && formik.errors.photo ? (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.photo}</div>
                  ) : null}
                </div>
              </div>
            </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end items-center space-x-4 px-4 md:px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white z-10">
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  onClose();
                }}
                className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationProfileModal;