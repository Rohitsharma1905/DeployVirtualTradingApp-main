


import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "react-hot-toast";

const OrganizationFeedbackFormModal = ({ isOpen, onClose, onSubmit, feedbackData }) => {
  const [formData, setFormData] = useState({
    feedbackCategory: "",
    feedbackMessage: "",
    rating: 0,
    recommend: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (feedbackData) {
        setFormData({
          feedbackCategory: feedbackData.feedbackCategory,
          feedbackMessage: feedbackData.feedbackMessage,
          rating: feedbackData.rating,
          recommend: feedbackData.recommend,
        });
      } else {
        setFormData({
          feedbackCategory: "",
          feedbackMessage: "",
          rating: 0,
          recommend: true,
        });
      }
    }
  }, [isOpen, feedbackData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.feedbackCategory || !formData.feedbackMessage || !formData.rating) {
      toast.error("Please fill in all required fields.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
      <div style={{ width: "100%", maxWidth: "80%", height: "auto", maxHeight: "80vh" }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
            <i className="fas fa-comment-dots text-lightBlue-600 mr-2 "></i> {feedbackData ? "Edit Feedback" : "Submit Feedback"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
            <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
          </button>
        </div>
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Category</label>
                <select
                  name="feedbackCategory"
                  value={formData.feedbackCategory}
                  onChange={handleChange}
                  required
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
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className="cursor-pointer"
                      fill={star <= formData.rating ? "#FFD700" : "none"}
                      stroke={star <= formData.rating ? "#FFD700" : "gray"}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Feedback Message</label>
                <textarea
                  name="feedbackMessage"
                  value={formData.feedbackMessage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
                ></textarea>
              </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-center">
              <label className="text-sm font-medium text-gray-700 mr-2">Would you recommend us?</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="recommend" 
                    value="true" 
                    checked={formData.recommend === true} 
                    onChange={() => setFormData({ ...formData, recommend: true })} 
                    className="mr-1" 
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="recommend" 
                    value="false" 
                    checked={formData.recommend === false} 
                    onChange={() => setFormData({ ...formData, recommend: false })} 
                    className="mr-1" 
                  />
                  No
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100">
                Cancel
              </button>
              <button type="submit" className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white" disabled={!formData.feedbackCategory || !formData.feedbackMessage || !formData.rating}>
                {feedbackData ? "Update Feedback" : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationFeedbackFormModal;