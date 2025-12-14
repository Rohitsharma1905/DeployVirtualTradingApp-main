
// import React from 'react';
// import { 
//   User, Calendar, Award, X, 
//   Trophy, Medal, Gift, Star, 
//   Zap, Coins, ChevronRight
// } from 'lucide-react';

// const UserEventsModal = ({ isOpen, onClose, user, events }) => {
//   if (!isOpen || !user) return null;

//   const getEventIcon = (iconName) => {
//     switch(iconName) {
//       case 'Trophy': return <Trophy className="text-lightBlue-600" size={18} />;
//       case 'Medal': return <Medal className="text-yellow-500" size={18} />;
//       case 'Gift': return <Gift className="text-purple-500" size={18} />;
//       case 'Award': return <Award className="text-green-500" size={18} />;
//       case 'Star': return <Star className="text-orange-500" size={18} />;
//       case 'Zap': return <Zap className="text-red-500" size={18} />;
//       case 'Coins': return <Coins className="text-amber-500" size={18} />;
//       default: return <Award className="text-lightBlue-600" size={18} />;
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       Registered: "bg-green-100 text-green-800",
//       Pending: "bg-yellow-100 text-yellow-800",
//       Cancelled: "bg-red-100 text-red-800",
//       Completed: "bg-blue-100 text-blue-800"
//     };
//     return statusColors[status] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//         <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
//         <div style={{ width: '100%', maxWidth: '60%' }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//           <div className="flex justify-between items-center p-6 border-b border-gray-100">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <User className="text-white" size={20} />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                   {user.name}'s Registered Events
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {Array.isArray(events) ? events.length : 0} events found
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//               aria-label="Close modal"
//             >
//               <X className="text-gray-400 hover:text-gray-600" size={20} />
//             </button>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[70vh]">
//             <div className="space-y-4">
//               {!Array.isArray(events) || events.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   No events found for this user.
//                 </div>
//               ) : (
//                 events.map((event) => (
//                   <div
//                     key={event._id || event.id}
//                     className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
//                   >
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white shadow-xs flex items-center justify-center mr-4 border border-gray-100">
//                         {getEventIcon(event.icon || "Award")}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-start">
//                           <h4 className="text-md font-medium text-gray-900 truncate pr-2">
//                             {event.title || "Untitled Event"}
//                           </h4>
//                           <span
//                             className={`ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(
//                               event.status
//                             )}`}
//                           >
//                             {event.status || "Unknown"}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//                           {event.description || "No description available."}
//                         </p>
//                         <div className="mt-3 flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
//                           <span className="flex items-center">
//                             <Calendar className="mr-1 flex-shrink-0" size={14} />
//                             {event.startDate
//                               ? new Date(event.startDate).toLocaleDateString()
//                               : "Date TBD"}
//                           </span>
//                           <span className="flex items-center">
//                             <Coins className="mr-1 flex-shrink-0" size={14} />
//                             ${typeof event.entryFee === "number"
//                               ? event.entryFee.toFixed(2)
//                               : "Free"} entry
//                           </span>
//                           <span className="flex items-center">
//                             <User className="mr-1 flex-shrink-0" size={14} />
//                             {event.participants || 0} participants
//                           </span>
//                         </div>
//                       </div>
//                       <ChevronRight
//                         className="text-gray-400 ml-2 flex-shrink-0 self-center"
//                         size={20}
//                       />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserEventsModal;




// import React from 'react';
// import { 
//   User, Calendar, Award, X, 
//   Trophy, Medal, Gift, Star, 
//   Zap, Coins, ChevronRight
// } from 'lucide-react';

// const UserEventsModal = ({ isOpen, onClose, user, events }) => {
//   if (!isOpen || !user) return null;

//   const getEventIcon = (iconName) => {
//     switch(iconName) {
//       case 'Trophy': return <Trophy className="text-lightBlue-600" size={18} />;
//       case 'Medal': return <Medal className="text-yellow-500" size={18} />;
//       case 'Gift': return <Gift className="text-purple-500" size={18} />;
//       case 'Award': return <Award className="text-green-500" size={18} />;
//       case 'Star': return <Star className="text-orange-500" size={18} />;
//       case 'Zap': return <Zap className="text-red-500" size={18} />;
//       case 'Coins': return <Coins className="text-amber-500" size={18} />;
//       default: return <Award className="text-lightBlue-600" size={18} />;
//     }
//   };

//   const getStatusColor = (status) => {
//     const statusColors = {
//       Registered: "bg-green-100 text-green-800",
//       Pending: "bg-yellow-100 text-yellow-800",
//       Cancelled: "bg-red-100 text-red-800",
//       Completed: "bg-blue-100 text-blue-800"
//     };
//     return statusColors[status] || "bg-gray-100 text-gray-800";
//   };

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//         <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
//         <div style={{ width: '100%', maxWidth: '60%' }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//           <div className="flex justify-between items-center p-6 border-b border-gray-100">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//                 <User className="text-white" size={20} />
//               </div>
//               <div>
//                 <h2 className="text-2xl font-semibold text-gray-800">
//                   {user.name}'s Registered Events
//                 </h2>
//                 <p className="text-sm text-gray-500 mt-1">
//                   {Array.isArray(events) ? events.length : 0} events found
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//               aria-label="Close modal"
//             >
//               <X className="text-gray-400 hover:text-gray-600" size={20} />
//             </button>
//           </div>

//           <div className="p-6 overflow-y-auto max-h-[70vh]">
//             <div className="space-y-4">
//               {!Array.isArray(events) || events.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   No events found for this user.
//                 </div>
//               ) : (
//                 events.map((event) => (
//                   <div
//                     key={event._id || event.id}
//                     className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
//                   >
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white shadow-xs flex items-center justify-center mr-4 border border-gray-100">
//                         {getEventIcon(event.icon || "Award")}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex justify-between items-start">
//                           <h4 className="text-md font-medium text-gray-900 truncate pr-2">
//                             {event.title || "Untitled Event"}
//                           </h4>
//                           <span
//                             className={`ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(
//                               event.status
//                             )}`}
//                           >
//                             {event.status || "Unknown"}
//                           </span>
//                         </div>
//                         <p className="text-sm text-gray-500 mt-1 line-clamp-2">
//                           {event.description || "No description available."}
//                         </p>
//                         <div className="mt-3 flex flex-wrap items-center text-xs text-gray-500 gap-x-4 gap-y-1">
//                           <span className="flex items-center">
//                             <Calendar className="mr-1 flex-shrink-0" size={14} />
//                             {event.startDate
//                               ? new Date(event.startDate).toLocaleDateString()
//                               : "Date TBD"}
//                           </span>
//                           <span className="flex items-center">
//                             <Coins className="mr-1 flex-shrink-0" size={14} />
//                             ${typeof event.entryFee === "number"
//                               ? event.entryFee.toFixed(2)
//                               : "Free"} entry
//                           </span>
//                           <span className="flex items-center">
//                             <User className="mr-1 flex-shrink-0" size={14} />
//                             {event.participants || 0} participants
//                           </span>
//                         </div>
//                       </div>
//                       <ChevronRight
//                         className="text-gray-400 ml-2 flex-shrink-0 self-center"
//                         size={20}
//                       />
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//             <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
//               <button
//                 onClick={onClose}
//                 className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UserEventsModal;



import React from 'react';
import { 
  User, Calendar, Award, X, 
  Trophy, Medal, Gift, Star, 
  Zap, Coins, ChevronRight, CreditCard,
  Shield, Check, Clock, DollarSign
} from 'lucide-react';

const UserEventsModal = ({ isOpen, onClose, user, events }) => {
  if (!isOpen || !user) return null;

  const getEventIcon = (iconName) => {
    switch(iconName) {
      case 'Trophy': return <Trophy className="text-lightBlue-600" size={18} />;
      case 'Medal': return <Medal className="text-yellow-500" size={18} />;
      case 'Gift': return <Gift className="text-purple-500" size={18} />;
      case 'Award': return <Award className="text-green-500" size={18} />;
      case 'Star': return <Star className="text-orange-500" size={18} />;
      case 'Zap': return <Zap className="text-red-500" size={18} />;
      case 'Coins': return <Coins className="text-amber-500" size={18} />;
      default: return <Award className="text-lightBlue-600" size={18} />;
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Registered: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Completed: "bg-blue-100 text-blue-800",
      Paid: "bg-purple-100 text-purple-800",
      Unpaid: "bg-gray-100 text-gray-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose}></div>
        <div style={{ width: '100%', maxWidth: '60%' }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {user.name}'s Registered Events
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {Array.isArray(events) ? events.length : 0} events found
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="text-gray-400 hover:text-gray-600" size={20} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-4">
              {!Array.isArray(events) || events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No events found for this user.
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event._id || event.id}
                    className="border border-gray-200 rounded-xl p-5 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-white shadow-xs flex items-center justify-center mr-4 border border-gray-100">
                        {getEventIcon(event.icon || "Award")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-md font-medium text-gray-900 truncate pr-2">
                            {event.title || "Untitled Event"}
                          </h4>
                          <span
                            className={`ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap ${getStatusColor(
                              event.status
                            )}`}
                          >
                            {event.status || "Unknown"}
                          </span>
                        </div>
                        
                        {/* Event Details Grid */}
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="mr-2 flex-shrink-0" size={14} />
                              <span>
                                <span className="font-medium">From:</span> {formatDate(event.startDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="mr-2 flex-shrink-0" size={14} />
                              <span>
                                <span className="font-medium">To:</span> {formatDate(event.endDate)}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <DollarSign className="mr-2 flex-shrink-0" size={14} />
                              <span>
                                <span className="font-medium">Entry Fee:</span> ₹{event.entryFee || 'Free'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="mr-2 flex-shrink-0" size={14} />
                              <span>
                                <span className="font-medium">Registered On:</span> {formatDateTime(event.registrationDate)}
                              </span>
                            </div>
                            {/* <div className="flex items-center text-sm text-gray-600">
                              <CreditCard className="mr-2 flex-shrink-0" size={14} />
                              <span>
                                <span className="font-medium">Payment:</span> 
                                <span className={`ml-1 px-2 py-0.5 text-xs rounded-full ${getStatusColor(event.paymentStatus || 'Unpaid')}`}>
                                  {event.paymentStatus || 'Unpaid'}
                                </span>
                              </span>
                            </div> */}
                            {event.paymentId && (
                              <div className="flex items-start text-sm text-gray-600">
                                <Shield className="mr-2 flex-shrink-0 mt-0.5" size={14} />
                                <span>
                                  <span className="font-medium">Payment ID:</span> {event.paymentId}
                                </span>
                              </div>
                            )}
                            {event.certificateId && (
                              <div className="flex items-start text-sm text-gray-600">
                                <Award className="mr-2 flex-shrink-0 mt-0.5" size={14} />
                                <span>
                                  <span className="font-medium">Certificate ID:</span> {event.certificateId}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-gray-400 ml-2 flex-shrink-0 self-center"
                        size={20}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEventsModal;