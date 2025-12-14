import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { submitFeedback, updateFeedback } from "../../../redux/User/feedbackSlice";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

const FeedbackModal = ({ onClose, onFeedbackSubmit, feedbackData }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user.feedback);

  const validationSchema = Yup.object({
    feedbackCategory: Yup.string().required("Category is required"),
    feedbackMessage: Yup.string().min(5, "Message must be at least 5 characters")
    .max(200, "Message must be less than 200 characters").required("Feedback message is required"),
    suggestions: Yup.string(),
    recommend: Yup.boolean().required("Recommendation is required"),
    rating: Yup.number().min(1, "Please give at least 1 star").required("Rating is required"),
  });

  const formik = useFormik({
    initialValues: {
      userId: "",
      feedbackCategory: "",
      feedbackMessage: "",
      rating: 0,
      recommend: false,
      suggestions: "",
      
    },
    validationSchema,
    onSubmit: async (values) => {
      
      if (!values.userId) {
        toast.error("User not found. Please log in.");
        return;
      }
      
     
      const action = feedbackData
        ? updateFeedback({ feedbackId: feedbackData._id, formData: values })
        : submitFeedback(values);

      dispatch(action)
        .unwrap()
        .then(() => {
          toast.success(feedbackData ? "Feedback updated successfully!" : "Feedback submitted successfully!");
          onFeedbackSubmit?.();
          onClose();
        })
        .catch((err) => toast.error(err || "Failed to submit feedback"));
    },
  });

  useEffect(() => {
    if (feedbackData) {
      formik.setValues({
        userId: feedbackData.userId || "",
        feedbackCategory: feedbackData.feedbackCategory || "",
        feedbackMessage: feedbackData.feedbackMessage || "",
        rating: feedbackData.rating || 0,
        recommend: feedbackData.recommend || false,
        suggestions: feedbackData.suggestions || "",
        
      });
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      formik.setValues((prev) => ({
        ...prev,
        userId: user?._id || "",
     
      }));
    }
  }, [feedbackData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray">
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100" style={{ width: "100%", maxWidth: "80%" }}>
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <i className="fas fa-comment-dots text-lightBlue-600 mr-2"></i> {feedbackData ? "Edit Feedback" : "Submit Feedback"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category</label>
                <select
                  name="feedbackCategory"
                  value={formik.values.feedbackCategory}
                  onChange={formik.handleChange}
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
                  <p className="text-red-500 text-sm mt-1">{formik.errors.feedbackCategory}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
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
                  <p className="text-red-500 text-sm mt-1">{formik.errors.rating}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Message</label>
                <textarea
                  name="feedbackMessage"
                  value={formik.values.feedbackMessage}
                  onChange={formik.handleChange}
                  placeholder="Write your feedback here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
                ></textarea>
                {formik.touched.feedbackMessage && formik.errors.feedbackMessage && (
                  <p className="text-red-500 text-sm mt-1">{formik.errors.feedbackMessage}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Suggestions</label>
                <textarea
                  name="suggestions"
                  value={formik.values.suggestions}
                  onChange={formik.handleChange}
                  placeholder="Write your suggestions here..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
                ></textarea>
              </div>
              <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2">Would you recommend us?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommend"
                    value="true"
                    checked={formik.values.recommend === true}
                    onChange={() => formik.setFieldValue("recommend", true)}
                    className="mr-1"
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
                    className="mr-1"
                  />
                  No
                </label>
              </div>
              {formik.touched.recommend && formik.errors.recommend && (
                <p className="text-red-500 text-sm ml-4">{formik.errors.recommend}</p>
              )}
            </div>
            </div>

           

            <div className="sticky flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white" disabled={loading}>
                {loading ? "Submitting..." : feedbackData ? "Update Feedback" : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
