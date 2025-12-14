import React from "react";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";

const CATEGORY_COLORS = {
  "Website UI/UX": "bg-blue-100 text-blue-800",
  "Trading Features": "bg-green-100 text-green-800",
  "Data Accuracy": "bg-purple-100 text-purple-800",
  "Performance & Speed": "bg-yellow-100 text-yellow-800",
  "Customer Support": "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-800",
};

const OrganizationFeedbackTable = ({ feedbacks }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Category",
                "Message",
                "Rating",
                "Recommend",
                "Date",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map((feedback) => (
              <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      CATEGORY_COLORS[feedback.feedbackCategory]
                    }`}
                  >
                    {feedback.feedbackCategory}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {feedback.feedbackMessage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < feedback.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {feedback.recommend ? (
                    <ThumbsUp className="text-green-500 inline" size={20} />
                  ) : (
                    <ThumbsDown className="text-red-500 inline" size={20} />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(feedback.createdDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationFeedbackTable;