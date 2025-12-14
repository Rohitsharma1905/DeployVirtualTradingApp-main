// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   ChevronDown,
//   ChevronUp,
//   PlusCircle,


//   Building2,
//   MessageSquare,
//   Calendar,
//   Users
// } from 'lucide-react';
// import axios from "axios";
// import CardStats from "../../components/User/Cards/CardStats";
// import { Edit, Trash2, Star, ThumbsUp, ThumbsDown } from "lucide-react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
// import { BASE_API_URL } from "../../utils/BaseUrl";
// import FeedbackModal from "../../components/User/Modals/FeedbackModal";
// import ConfirmationModal from "../../components/User/Cards/ConfirmationModal";
// import { fetchFeedback, deleteFeedback } from "../../redux/User/feedbackSlice";
// import StatsSection from "../../components/User/Cards/StatsSection";
// import { useUserStats } from "../../hooks/userUserStats";

// export default function FeedbackTable() {
//   useUserStats();
//   const dispatch = useDispatch();
//   const feedbackData = useSelector((state) => state.user.feedback.feedbackList);
//   const feedbackStatus = useSelector((state) => state.user.feedback.status);
//   const [isModalOpen, setIsModalOpen] = React.useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
//   const [selectedFeedbackId, setSelectedFeedbackId] = React.useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
//   const [editFeedback, setEditFeedback] = React.useState(null);
//   const CATEGORY_COLORS = {
//     "Website UI/UX": "bg-blue-100 text-blue-800",
//     "Trading Features": "bg-green-100 text-green-800",
//     "Data Accuracy": "bg-purple-100 text-purple-800",
//     "Performance & Speed": "bg-yellow-100 text-yellow-800",
//     "Customer Support": "bg-orange-100 text-orange-800",
//     "Other": "bg-gray-100 text-gray-800"
//   };
//   useEffect(() => {
//     // Dispatch the fetchFeedback action to load feedback data
//     dispatch(fetchFeedback());
//   }, [dispatch]);

//   const handleFeedbackUpdate = () => {
//     dispatch(fetchFeedback()); // Fetch latest feedback after submitting
//   };

//   const handleEditFeedback = (feedbackId) => {
//     const feedbackToEdit = feedbackData.find((feedback) => feedback._id === feedbackId);
//     setEditFeedback(feedbackToEdit);
//     dispatch(fetchFeedback());
//     setIsEditModalOpen(true);
//   };

//   const openDeleteModal = (feedbackId) => {
//     setSelectedFeedbackId(feedbackId);
//     setIsDeleteModalOpen(true);
//   };

//   const closeDeleteModal = () => {
//     setIsDeleteModalOpen(false);
//     setSelectedFeedbackId(null);
//   };

//   const handleDeleteFeedback = (feedbackId) => {
//     if (!feedbackId) return;
//     dispatch(deleteFeedback(feedbackId));
//     closeDeleteModal();
//     dispatch(fetchFeedback());
//   };


//   if (feedbackStatus === "loading") {
//     return <div>Loading...</div>;
//   }

//   return (
//     <>

//         <StatsSection isDashboard={false} pageType="feedbacks" />
//       {/* </div> */}

//       <div className="px-8 mx-8 -mt-12 bg-gray-50 rounded-lg h-19 p-4 mb-8.5 flex justify-between items-center">   
//           <h2 className="text-xl font-bold text-gray-800 flex items-center">
//           <MessageSquare className="mr-2 text-lightBlue-600" size={24} />
//             My Feedbacks
//             </h2>

//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="flex items-center bg-lightBlue-600 text-white px-4 py-2 rounded-lg hover:bg-lightBlue-700 transition-colors"
//         >
//            <PlusCircle size={18} className="mr-2" />
//                         Add Feedback
//         </button>
//       </div>

//       <div className="flex flex-wrap mx-4 -mt-0">
//         <div className="w-full mb-12 px-4 -mt-8">
//           <div className="bg-white rounded-lg shadow-lg">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     {["Name", "Email","Category", "Feedback", "Rating", "Recommendation", "Date", "Status", "Actions"].map((header) => (
//                       <th
//                         key={header}
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//   {feedbackData.length > 0 ? (
//     feedbackData.map((feedback) => (

//       <tr key={feedback._id} className="hover:bg-gray-50">
//         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//           {feedback.userId?.name || "N/A"}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           {feedback.userId?.email || "N/A"}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap">
//         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[feedback.feedbackCategory]}`}>
//           {feedback.feedbackCategory}
//         </span>
//       </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           {feedback.feedbackMessage}
//         </td>
//         <td className="px-6 py-4 text-sm">
//           {[...Array(feedback.rating)].map((_, index) => (
//             <Star key={`${feedback._id}-star-${index}`} size={20} fill="#FFD700" stroke="#FFD700" className="inline-block" />
//           ))}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
//           {feedback.recommend ? (
//             <ThumbsUp size={20} className="text-green-500" />
//           ) : (
//             <ThumbsDown size={20} className="text-red-500" />
//           )}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//           {new Date(feedback.createdDate).toLocaleDateString()}
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-sm">
//           <span
//             className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//             ${feedback.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
//           >
//             {feedback.status || "Approved"}
//           </span>
//         </td>
//         <td className="px-6 py-4 whitespace-nowrap text-center flex gap-x-3">
//           <button className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors duration-200" onClick={() => handleEditFeedback(feedback._id)}>
//             <Edit size={18} />
//           </button>
//           <button className="text-red-600 mx-2 hover:text-red-900 transition-colors duration-200" onClick={() => openDeleteModal(feedback._id)}>
//             <Trash2 size={18} />
//           </button>
//         </td>
//       </tr>
//     ))
//   ) : (
//     <tr>
//       <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No feedbacks found</td>
//     </tr>
//   )}
// </tbody>

//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       {isModalOpen && <FeedbackModal onFeedbackSubmit={handleFeedbackUpdate} onClose={() => setIsModalOpen(false)} />}
//       {isEditModalOpen && <FeedbackModal onFeedbackSubmit={handleEditFeedback} onClose={() => setIsEditModalOpen(false)} feedbackData={editFeedback} />}
//       {isDeleteModalOpen && selectedFeedbackId && (
//   <ConfirmationModal 
//     isOpen={isDeleteModalOpen} 
//     onClose={closeDeleteModal} 
//     onConfirm={() => handleDeleteFeedback(selectedFeedbackId)} 
//     message="Are you sure you want to delete this feedback?"
//   />
// )}
//     </>
//   );
// }

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Building2,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';
import axios from "axios";
import CardStats from "../../components/User/Cards/CardStats";
import { Edit, Trash2, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { BASE_API_URL } from "../../utils/BaseUrl";
import FeedbackModal from "../../components/User/Modals/FeedbackModal";
import ConfirmationModal from "../../components/User/Cards/ConfirmationModal";
import { fetchFeedback, deleteFeedback } from "../../redux/User/feedbackSlice";
import StatsSection from "../../components/User/Cards/StatsSection";
import { useUserStats } from "../../hooks/userUserStats";
import { fetchUserStats } from "../../redux/User/userDashboardSlice"; // Add this import

export default function FeedbackTable() {
  const { refetch } = useUserStats(); // Get the refetch function from the hook
  const dispatch = useDispatch();
  const feedbackData = useSelector((state) => state.user.feedback.feedbackList);
  const feedbackStatus = useSelector((state) => state.user.feedback.status);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = React.useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editFeedback, setEditFeedback] = React.useState(null);

  const CATEGORY_COLORS = {
    "Website UI/UX": "bg-blue-100 text-blue-800",
    "Trading Features": "bg-green-100 text-green-800",
    "Data Accuracy": "bg-purple-100 text-purple-800",
    "Performance & Speed": "bg-yellow-100 text-yellow-800",
    "Customer Support": "bg-orange-100 text-orange-800",
    "Other": "bg-gray-100 text-gray-800"
  };

  useEffect(() => {
    dispatch(fetchFeedback());
  }, [dispatch]);

  const handleFeedbackUpdate = async () => {
    await dispatch(fetchFeedback()); // Fetch latest feedback
    refetch(); // Refresh the stats data
  };

  const handleEditFeedback = (feedbackId) => {
    const feedbackToEdit = feedbackData.find((feedback) => feedback._id === feedbackId);
    setEditFeedback(feedbackToEdit);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (feedbackId) => {
    setSelectedFeedbackId(feedbackId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFeedbackId(null);
  };

  const handleDeleteFeedback = async (feedbackId) => {
    if (!feedbackId) return;
    await dispatch(deleteFeedback(feedbackId));
    await dispatch(fetchFeedback()); // Refresh feedback list
    refetch(); // Refresh stats data
    closeDeleteModal();
  };

  // if (feedbackStatus === "loading") {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <StatsSection isDashboard={false} pageType="feedbacks" />

      <div className="px-8 mx-8 -mt-12 bg-gray-50 rounded-lg h-19 p-4 mb-8.5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <MessageSquare className="mr-2 text-lightBlue-600" size={24} />
          My Feedbacks
        </h2>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-lightBlue-600 text-white px-4 py-2 rounded-lg hover:bg-lightBlue-700 transition-colors"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Feedback
        </button>
      </div>

      <div className="flex flex-wrap mx-4 -mt-0">
        <div className="w-full mb-12 px-4 -mt-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {["Name", "Email", "Category", "Feedback", "Rating", "Recommendation", "Date", "Status", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedbackData.length > 0 ? (
                    feedbackData.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {feedback.userId?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {feedback.userId?.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[feedback.feedbackCategory]}`}>
                            {feedback.feedbackCategory}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate whitespace-nowrap overflow-hidden">
                          {feedback.feedbackMessage}
                        </td>
                        <td className=" px-6 py-4 text-sm ">
                          <span className="flex items-center">
                            {[...Array(feedback.rating)].map((_, index) => (
                              <Star key={`${feedback._id}-star-${index}`} size={20} fill="#FFD700" stroke="#FFD700" className="inline-block" />
                            ))}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 ">
                          {feedback.recommend ? (
                            <ThumbsUp size={20} className="text-green-500" />
                          ) : (
                            <ThumbsDown size={20} className="text-red-500" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(feedback.createdDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${feedback.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {feedback.status || "Approved"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap flex items-center text-center gap-x-3">
                          <button className="text-yellow-600 hover:text-yellow-900" onClick={() => handleEditFeedback(feedback._id)}>
                            <Edit size={18} />
                          </button>
                          <button className="text-red-600 hover:text-red-900" onClick={() => openDeleteModal(feedback._id)}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No feedbacks found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <FeedbackModal
          onFeedbackSubmit={handleFeedbackUpdate}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {isEditModalOpen && (
        <FeedbackModal
          onFeedbackSubmit={handleFeedbackUpdate}
          onClose={() => setIsEditModalOpen(false)}
          feedbackData={editFeedback}
        />
      )}

      {isDeleteModalOpen && selectedFeedbackId && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteFeedback(selectedFeedbackId)}
          message="Are you sure you want to delete this feedback?"
        />
      )}
    </>
  );
}