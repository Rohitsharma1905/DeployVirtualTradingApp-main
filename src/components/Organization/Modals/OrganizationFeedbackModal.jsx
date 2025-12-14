import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const validationSchema = Yup.object({
  feedbackCategory: Yup.string().required("Feedback category is required"),
  feedbackMessage: Yup.string().min(5, "Message must be at least 5 characters")
  .max(200, "Message must be less than 200 characters").required("Feedback message is required"),
  rating: Yup.number().min(1, "Rating is required").required("Rating is required"),
  recommend: Yup.boolean().required("Recommendation is required"),
  suggestions: Yup.string(),
});

const OrganizationFeedbackModal = ({ isOpen, onClose, onSubmit, feedbackData }) => {
  const org = localStorage.getItem("org");

  const formik = useFormik({
    initialValues: {
      feedbackCategory: "",
      feedbackMessage: "",
      rating: 0,
      recommend: false,
      suggestions: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (!org) {
        toast.error("Organization not found. Please log in.");
        return;
      }

      const payload = {
        ...values,
        orgName: localStorage.getItem("orgName"),
        organizationId: org._id,
      };

      onSubmit(payload);
      onClose();
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (feedbackData) {
        formik.setValues({
          feedbackCategory: feedbackData.feedbackCategory || "",
          feedbackMessage: feedbackData.feedbackMessage || "",
          rating: feedbackData.rating || 0,
          recommend: feedbackData.recommend || false,
          suggestions: feedbackData.suggestions || "",
        });
      } else {
        formik.resetForm();
      }
    }
  }, [isOpen, feedbackData]);

  if (!isOpen) return null;

  return (
    // <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
    //   <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
    //   <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
    //     {/* Header */}
    //     <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 sm:p-6 border-b border-gray-100">
    //       <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
    //         <i className="fas fa-comment-dots text-lightBlue-600 mr-2"></i>
    //         {feedbackData ? "Edit Feedback" : "Submit Feedback"}
    //       </h2>
    //       <button
    //         onClick={onClose}
    //         className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
    //       >
    //         <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
    //       </button>
    //     </div>

    //     {/* Form Content */}
    //     <div className="p-4 sm:p-6">
    //       <form onSubmit={formik.handleSubmit} className="space-y-4 sm:space-y-6">
    //         <div className="grid grid-cols-1 gap-4 sm:gap-6">
    //           {/* Feedback Category */}
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               Feedback Category
    //             </label>
    //             <select
    //               name="feedbackCategory"
    //               value={formik.values.feedbackCategory}
    //               onChange={formik.handleChange}
    //               onBlur={formik.handleBlur}
    //               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
    //             >
    //               <option value="">Select Category</option>
    //               <option value="Website UI/UX">Website UI/UX</option>
    //               <option value="Trading Features">Trading Features</option>
    //               <option value="Data Accuracy">Data Accuracy</option>
    //               <option value="Performance & Speed">Performance & Speed</option>
    //               <option value="Customer Support">Customer Support</option>
    //               <option value="Other">Other</option>
    //             </select>
    //             {formik.touched.feedbackCategory && formik.errors.feedbackCategory && (
    //               <div className="text-red-500 text-sm mt-1">{formik.errors.feedbackCategory}</div>
    //             )}
    //           </div>

    //           {/* Rating */}
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               Rating
    //             </label>
    //             <div className="flex space-x-2">
    //               {[1, 2, 3, 4, 5].map((star) => (
    //                 <Star
    //                   key={star}
    //                   size={24}
    //                   className="cursor-pointer"
    //                   fill={star <= formik.values.rating ? "#FFD700" : "none"}
    //                   stroke={star <= formik.values.rating ? "#FFD700" : "gray"}
    //                   onClick={() => formik.setFieldValue("rating", star)}
    //                 />
    //               ))}
    //             </div>
    //             {formik.touched.rating && formik.errors.rating && (
    //               <div className="text-red-500 text-sm mt-1">{formik.errors.rating}</div>
    //             )}
    //           </div>

    //           {/* Feedback Message */}
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               Feedback Message
    //             </label>
    //             <textarea
    //               name="feedbackMessage"
    //               placeholder="Write your feedback here..."
    //               value={formik.values.feedbackMessage}
    //               onChange={formik.handleChange}
    //               onBlur={formik.handleBlur}
    //               rows="3"
    //               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
    //             ></textarea>
    //             {formik.touched.feedbackMessage && formik.errors.feedbackMessage && (
    //               <div className="text-red-500 text-sm mt-1">{formik.errors.feedbackMessage}</div>
    //             )}
    //           </div>

    //           {/* Suggestions */}
    //           <div>
    //             <label className="block text-sm font-medium text-gray-700 mb-2">
    //               Suggestions
    //             </label>
    //             <textarea
    //               name="suggestions"
    //               value={formik.values.suggestions}
    //               onChange={formik.handleChange}
    //               onBlur={formik.handleBlur}
    //               rows="3"
    //               className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
    //               placeholder="Enter your suggestions"
    //             ></textarea>
    //             {formik.touched.suggestions && formik.errors.suggestions && (
    //               <div className="text-red-500 text-sm mt-1">{formik.errors.suggestions}</div>
    //             )}
    //           </div>

    //           {/* Recommendation */}
    //           <div className="flex flex-col sm:flex-row sm:items-center gap-2">
    //             <label className="text-sm font-medium text-gray-700">
    //               Would you recommend us?
    //             </label>
    //             <div className="flex space-x-4">
    //               <label className="flex items-center">
    //                 <input
    //                   type="radio"
    //                   name="recommend"
    //                   value="true"
    //                   checked={formik.values.recommend === true}
    //                   onChange={() => formik.setFieldValue("recommend", true)}
    //                   className="mr-2"
    //                 />
    //                 Yes
    //               </label>
    //               <label className="flex items-center">
    //                 <input
    //                   type="radio"
    //                   name="recommend"
    //                   value="false"
    //                   checked={formik.values.recommend === false}
    //                   onChange={() => formik.setFieldValue("recommend", false)}
    //                   className="mr-2"
    //                 />
    //                 No
    //               </label>
    //             </div>
    //           </div>
    //         </div>

    //         {/* Buttons */}
    //         <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 sm:justify-end">
    //           <button
    //             type="button"
    //             onClick={onClose}
    //             className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100"
    //           >
    //             Cancel
    //           </button>
    //           <button
    //             type="submit"
    //             className="w-full sm:w-auto px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-blue-700"
    //             disabled={!formik.isValid || formik.isSubmitting}
    //           >
    //             {feedbackData ? "Update Feedback" : "Submit Feedback"}
    //           </button>
    //         </div>
    //       </form>
    //     </div>
    //   </div>
    //   <Toaster />
    // </div>
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
  <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
  <div
    className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
    style={{ width: "100%", maxWidth: "80%" }}
  >
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        <i className="fas fa-comment-dots text-lightBlue-600 mr-2"></i>
        {feedbackData ? "Edit Feedback" : "Submit Feedback"}
      </h2>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
      >
        <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
      </button>
    </div>

    {/* Form */}
    <div className="p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Feedback Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              name="feedbackCategory"
              value={formik.values.feedbackCategory}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
            >
              <option value="">Select Category</option>
              <option value="Website UI/UX">Website UI/UX</option>
              <option value="Trading Features">Trading Features</option>
              <option value="Data Accuracy">Data Accuracy</option>
              <option value="Performance & Speed">Performance & Speed</option>
              <option value="Customer Support">Customer Support</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.feedbackCategory && formik.errors.feedbackCategory && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.feedbackCategory}
              </p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className="cursor-pointer"
                  fill={star <= formik.values.rating ? "#FFD700" : "none"}
                  stroke={star <= formik.values.rating ? "#FFD700" : "gray"}
                  onClick={() => formik.setFieldValue("rating", star)}
                />
              ))}
            </div>
            {formik.touched.rating && formik.errors.rating && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.rating}
              </p>
            )}
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Message
            </label>
            <textarea
              name="feedbackMessage"
              value={formik.values.feedbackMessage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Write your feedback here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
            ></textarea>
            {formik.touched.feedbackMessage && formik.errors.feedbackMessage && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.feedbackMessage}
              </p>
            )}
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suggestions
            </label>
            <textarea
              name="suggestions"
              value={formik.values.suggestions}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your suggestions"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
            ></textarea>
            {formik.touched.suggestions && formik.errors.suggestions && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.suggestions}
              </p>
            )}
          </div>

          {/* Recommendation */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Would you recommend us?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recommend"
                  value="true"
                  checked={formik.values.recommend === true}
                  onChange={() => formik.setFieldValue("recommend", true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recommend"
                  value="false"
                  checked={formik.values.recommend === false}
                  onChange={() => formik.setFieldValue("recommend", false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-blue-700 transition"
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {feedbackData ? "Update Feedback" : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  </div>

  <Toaster />
</div>

  );
};

export default OrganizationFeedbackModal;