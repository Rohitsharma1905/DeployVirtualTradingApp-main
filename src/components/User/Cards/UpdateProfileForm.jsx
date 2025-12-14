// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import toast, { Toaster } from "react-hot-toast";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { fetchUserData, updateUserProfile } from "../../../redux/User/userprofileSlice";

// const UpdateProfileForm = ({ isOpen, onClose, onUpdate }) => {
//   const dispatch = useDispatch();
//   const { userData, loading, error } = useSelector((state) => state.user.profile);

//   useEffect(() => {
//     if (isOpen) {
//       dispatch(fetchUserData());
//     }
//   }, [isOpen, dispatch]);

//   const validationSchema = Yup.object({
//     name: Yup.string().min(3, "Name must be at least 3 characters").required("Name is required"),
//     email: Yup.string().email("Invalid email format").required("Email is required"),
//     mobile: Yup.string().matches(/^[0-9]{10}$/, "Mobile number must be 10 digits").required("Mobile number is required"),
//     gender: Yup.string().oneOf(["male", "female", "other"], "Invalid gender").required("Gender is required"),
//     dob: Yup.date().max(new Date(), "Date of birth cannot be in the future").required("Date of birth is required"),
//   });

//   const formik = useFormik({
//     initialValues: userData || { name: "", email: "", mobile: "", gender: "", dob: "" },
//     enableReinitialize: true,
//     validationSchema,
//     onSubmit: async (values) => {
//       dispatch(updateUserProfile(values))
//         .unwrap()
//         .then(() => {
//           // alert("Profile updated successfully!");
//           toast.success("Profile updated successfully!");
//           onUpdate(values);
//           onClose();
//         })
//         .catch((error) => {
//           console.error("Error updating profile:", error);
//         });
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
//     <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
//     <div style={{ width: "100%", maxWidth: "80%" }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//       <div className="flex justify-between items-center p-6 border-b border-gray-100">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//             <i className="fas fa-user-edit text-white"></i>
//           </div>
//           <h2 className="text-2xl font-semibold text-gray-800">Update Profile</h2>
//         </div>
//         <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
//           <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//         </button>
//       </div>
//       <div className="p-6">
//         <form className="space-y-6" onSubmit={formik.handleSubmit}>
//           <div className="flex flex-col md:flex-row gap-6">
//             <div className="bg-gray-50 p-6 rounded-xl flex-1">
//               <h3 className="text-sm font-semibold text-gray-400 uppercase mb-6">Personal Information</h3>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
//                   <input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200" required />
//                   {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
//                   <input type="date" name="dob" value={formik.values.dob} onChange={formik.handleChange} onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200" required />
//                   {formik.touched.dob && formik.errors.dob && <p className="text-red-500 text-sm">{formik.errors.dob}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                   <select name="gender" value={formik.values.gender} onChange={formik.handleChange} onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200" required>
//                     <option value="">Select Gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {formik.touched.gender && formik.errors.gender && <p className="text-red-500 text-sm">{formik.errors.gender}</p>}
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 p-6 rounded-xl flex-1">
//               <h3 className="text-sm font-semibold text-gray-400 uppercase mb-6">Contact Information</h3>
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                   <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200" required />
//                   {formik.touched.email && formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
//                   <input type="text" name="mobile" value={formik.values.mobile} onChange={formik.handleChange} onBlur={formik.handleBlur}
//                     className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
//              bg-white text-gray-900 
//              focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
//              focus:outline-none transition-all duration-200" required />
//                   {formik.touched.mobile && formik.errors.mobile && <p className="text-red-500 text-sm">{formik.errors.mobile}</p>}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
//             <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100">Cancel</button>
//             <button type="submit" className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white">Save Changes</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   </div>
//   );
// };

// export default UpdateProfileForm;






// abhsihek code for image 
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import { toast } from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUserProfile } from "../../../redux/User/userprofileSlice";

// const UpdateProfileForm = ({ isOpen, onClose, userData }) => {
//   const dispatch = useDispatch();
//   const { loading } = useSelector((state) => state.user.profile);
//   const [image, setImage] = useState(userData?.userPhoto || ""); // State for the base64 image
//   const [selectedFile, setSelectedFile] = useState(null); // State for the selected file

//   // Convert image file to base64
//   const handleImageChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImage(reader.result); // Set the base64 string
//         setSelectedFile(file); // Set the selected file
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       name: userData?.name || "",
//       email: userData?.email || "",
//       mobile: userData?.mobile || "",
//       gender: userData?.gender || "",
//       dob: userData?.dob || "",
//       userPhoto: userData?.userPhoto || "",
//     },
//     enableReinitialize: true, // Reinitialize form when userData changes
//     onSubmit: async (values) => {
//       const updatedData = { ...values, userPhoto: image }; // Include the base64 image

//       try {
//         await dispatch(updateUserProfile(updatedData)).unwrap();
//         toast.success("Profile updated successfully!");
//         onClose(); // Close the modal
//       } catch (error) {
//         toast.error(error.message || "Failed to update profile");
//       }
//     },
//   });

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-semibold">Update Profile</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             &times;
//           </button>
//         </div>

//         <form onSubmit={formik.handleSubmit} className="space-y-6">
//           {/* Profile Photo Upload */}
//           <div className="flex flex-col items-center">
//             <label htmlFor="profilePhoto" className="cursor-pointer">
//               <img
//                 src={image || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
//                 alt="Profile"
//                 className="w-24 h-24 rounded-full object-cover mb-4"
//               />
//               <input
//                 type="file"
//                 id="profilePhoto"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>
//             <p className="text-sm text-gray-500">
//               Click on the image to upload a new photo.
//             </p>
//           </div>

//           {/* Name Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
//             />
//             {formik.touched.name && formik.errors.name && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
//             )}
//           </div>

//           {/* Email Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
//             )}
//           </div>

//           {/* Mobile Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Mobile
//             </label>
//             <input
//               type="text"
//               name="mobile"
//               value={formik.values.mobile}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
//             />
//             {formik.touched.mobile && formik.errors.mobile && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.mobile}</p>
//             )}
//           </div>

//           {/* Gender Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Gender
//             </label>
//             <select
//               name="gender"
//               value={formik.values.gender}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
//             >
//               <option value="">Select Gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </select>
//             {formik.touched.gender && formik.errors.gender && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
//             )}
//           </div>

//           {/* Date of Birth Field */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Date of Birth
//             </label>
//             <input
//               type="date"
//               name="dob"
//               value={formik.values.dob}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
//             />
//             {formik.touched.dob && formik.errors.dob && (
//               <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
//             )}
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 text-white bg-lightBlue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
//             >
//               {loading ? "Updating..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateProfileForm;







// abhsihek code new styling as before for imag

import React, { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../../redux/User/userprofileSlice";

const UpdateProfileForm = ({ isOpen, onClose, userData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user.profile);
  const [image, setImage] = useState(userData?.userPhoto || ""); // State for the base64 image
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file

  // Convert image file to base64
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the base64 string
        setSelectedFile(file); // Set the selected file
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
      toast.success("Photo removed. Click on update profile to save the changes");
      setImage("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png");
    };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: userData?.name || "",
      email: userData?.email || "",
      mobile: userData?.mobile || "",
      gender: userData?.gender || "",
      dob: userData?.dob || "",
      userPhoto: userData?.userPhoto || "",
    },
    enableReinitialize: true, // Reinitialize form when userData changes
    onSubmit: async (values) => {
      const updatedData = { ...values, userPhoto: image }; // Include the base64 image

      try {
        await dispatch(updateUserProfile(updatedData)).unwrap();
        toast.success("Profile updated successfully!");
        onClose(); // Close the modal
      } catch (error) {
        toast.error(error.message || "Failed to update profile");
      }
    },
  });

  if (!isOpen) return null;
return(
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 bg-opacity-50 overflow-auto">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[80vh] flex flex-col p-0 overflow-hidden">

    {/* Header (Fixed) */}
    <div className="sticky top-0 z-10 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-user-edit text-white"></i>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Update Profile</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
      </button>
    </div>

    {/* Form */}
    <form onSubmit={formik.handleSubmit} className="flex-1 flex flex-col overflow-hidden">

      {/* Scrollable Fields */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile
              </label>
              <input
                type="text"
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.mobile}</p>
              )}
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.gender}</p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
              />
              {formik.touched.dob && formik.errors.dob && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.dob}</p>
              )}
            </div>
            <div >
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={image || "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full cursor-pointer"
                  onClick={() => document.getElementById("profilePhoto").click()}
                />
                <input
                  type="file"
                  id="profilePhoto"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                 {image !== "https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_1280.png" && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="-mt-10 text-sm text-black font-semibold hover:opacity-80 ml-24 px-2 py-2 rounded-xl"
                    >
                      Remove Photo
                    </button>
                  )}
              </div>
              {/* {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )} */}
            </div>
          </div>
          </div>
          </div>

          {/* Profile Photo Upload at the End */}
         

          {/* Form Actions */}
          <div className="sticky bottom-0 z-10 bg-white p-6 border-t border-gray-100 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;