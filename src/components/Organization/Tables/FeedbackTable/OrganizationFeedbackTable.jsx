import React from "react";
import { Star, ThumbsUp, ThumbsDown, Trash2, Edit } from "lucide-react";
import { useSelector } from "react-redux";


const CATEGORY_COLORS = {
  "Website UI/UX": "bg-blue-100 text-blue-800",
  "Trading Features": "bg-green-100 text-green-800",
  "Data Accuracy": "bg-purple-100 text-purple-800",
  "Performance & Speed": "bg-yellow-100 text-yellow-800",
  "Customer Support": "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-800",
};


// const orgObject = JSON.parse(localStorage.getItem("org"));
// // const orgObject = JSON.parse(org);
// // console.log(org);
// console.log(orgObject);

const OrganizationFeedbackTable = ({ feedbacks, onDelete, onEdit }) => {
  // console.log(org);
  // console.log(orgObject);
  const { loading, orgId, currentOrg } = useSelector((state) => state.organization.auth);
  console.log(currentOrg);
  console.log(orgId);
  console.log(loading);
  
  
  
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Name","Mobile","Category", "Feedback Message", "Rating", "Recommend", "Status", "Suggestions", "Date", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map((feedback) => (
              <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                {/* {console.log(feedback.organizationId)} */}
                {/* {console.log(feedback)} */}
                {/* {console.log(feedback.organizationId?.name)} */}

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {currentOrg.name}
                 </td>

                 {/* Mobile Number */}
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                   {currentOrg.mobile}
                   {console.log(feedback.organizationId?.name)}                
                 </td>

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
                    
                  {[...Array(feedback.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill="#FFD700" 
                          stroke="#FFD700" 
                          className="inline-block"
                        />
                      ))}
                      </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {feedback.recommend ? (
                    <ThumbsUp className="text-green-500 " size={20} />
                  ) : (
                    <ThumbsDown className="text-red-500" size={20} />
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                <span
            className={`
              px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
           ${feedback.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
        `}
         >
            {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
           </span>

                </td>

                <td className="px-6 py-4 text-sm text-gray-500">
                  {feedback.suggestions}
                </td>

              

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(feedback.createdDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center flex gap-x-3">
                  <button
                    onClick={() => onEdit(feedback)}
                    className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors duration-200"
                        aria-label="Edit user"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(feedback._id)}
                    className="text-red-600 mx-2 hover:text-red-900 transition-colors duration-200"
                  >
                    <Trash2 size={18} />
                  </button>
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




// organization feedabck table by orgid 


// import React from "react";
// import { Star, ThumbsUp, ThumbsDown, Trash2, Edit } from "lucide-react";

// const CATEGORY_COLORS = {
//   "Website UI/UX": "bg-blue-100 text-blue-800",
//   "Trading Features": "bg-green-100 text-green-800",
//   "Data Accuracy": "bg-purple-100 text-purple-800",
//   "Performance & Speed": "bg-yellow-100 text-yellow-800",
//   "Customer Support": "bg-orange-100 text-orange-800",
//   Other: "bg-gray-100 text-gray-800",
// };

// const OrganizationFeedbackTable = ({ feedbacks, onDelete, onEdit }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               {[
//                 "Category",
//                 "Feedback Message",
//                 "Rating",
//                 "Recommend",
//                 "Status",
//                 "Suggestions",
//                 "Date",
//                 "Organization Name",
//                 "Mobile Number",
//                 "Actions",
//               ].map((header) => (
//                 <th
//                   key={header}
//                   className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   {header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {feedbacks.map((feedback) => (
//               <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
//                 {/* Category */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                       CATEGORY_COLORS[feedback.feedbackCategory]
//                     }`}
//                   >
//                     {feedback.feedbackCategory}
//                   </span>
//                 </td>

//                 {/* Feedback Message */}
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {feedback.feedbackMessage}
//                 </td>

//                 {/* Rating */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <div className="flex">
//                     {[...Array(feedback.rating)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={16}
//                         fill="yellow"
//                         stroke="yellow"
//                         className="inline-block"
//                       />
//                     ))}
//                   </div>
//                 </td>

//                 {/* Recommend */}
//                 <td className="px-6 py-4 whitespace-nowrap text-center">
//                   {feedback.recommend ? (
//                     <ThumbsUp className="text-green-500 " size={20} />
//                   ) : (
//                     <ThumbsDown className="text-red-500" size={20} />
//                   )}
//                 </td>

//                 {/* Status */}
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
//                       ${feedback.status.toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                     `}
//                   >
//                     {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
//                   </span>
//                 </td>

//                 {/* Suggestions */}
//                 <td className="px-6 py-4 text-sm text-gray-500">
//                   {feedback.suggestions}
//                 </td>

//                 {/* Date */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {new Date(feedback.createdDate).toLocaleDateString()}
//                 </td>

//                 {/* Organization Name */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {feedback.organizationId?.name || "N/A"}
//                 </td>

//                 {/* Mobile Number */}
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {feedback.organizationId?.mobile || "N/A"}
//                   {console.log(feedback)}
                  
//                 </td>

//                 {/* Actions */}
//                 <td className="px-6 py-4 whitespace-nowrap text-center flex gap-x-3">
//                   <button
//                     onClick={() => onEdit(feedback)}
//                     className="text-yellow-600 mx-2 hover:text-yellow-900 transition-colors duration-200"
//                   >
//                     <Edit size={18} />
//                   </button>
//                   <button
//                     onClick={() => onDelete(feedback._id)}
//                     className="text-red-600 mx-2 hover:text-red-900 transition-colors duration-200"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrganizationFeedbackTable;