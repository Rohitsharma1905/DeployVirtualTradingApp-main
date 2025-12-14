// import React from 'react';
// import { 
//   User, Calendar, Clock, Award, 
//   Check, X, ChevronRight, Info, 
//   Mail, CreditCard, BadgeCheck, Shield
// } from 'lucide-react';
// // import { formatDate } from '../../../utils/formatDate';

// const ParticipantDetailsModal = ({ 
//   isOpen, 
//   onClose, 
//   participant,
//   onViewUserEvents,
//   onUpdateStatus
// }) => {
//   if (!isOpen || !participant) return null;

//   const statusColors = {
//     Registered: 'bg-green-100 text-green-800',
//     Pending: 'bg-yellow-100 text-yellow-800',
//     Cancelled: 'bg-red-100 text-red-800',
//     Completed: 'bg-blue-100 text-blue-800'
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
//         <div className="p-6">
//           <div className="flex justify-between items-start">
//             <h3 className="text-xl font-semibold text-gray-900">
//               Registration Details
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-500"
//             >
//               <X size={24} />
//             </button>
//           </div>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* User Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                 <User className="mr-2" size={18} />
//                 User Information
//               </h4>
//               <div className="space-y-2">
//                 <p className="text-sm">
//                   <span className="font-medium">Name:</span> {participant?.userId?.name}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Email:</span> {participant?.userId?.email}
//                 </p>
//                 <button
//                   onClick={() => onViewUserEvents(participant.userId._id, participant.userId.name)}
//                   className="text-lightBlue-600 hover:text-blue-800 text-sm flex items-center mt-2"
//                 >
//                   View all events for this user <ChevronRight size={16} className="ml-1" />
//                 </button>
//               </div>
//             </div>

//             {/* Event Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                 <Award className="mr-2" size={18} />
//                 Event Information
//               </h4>
//               <div className="space-y-2">
//                 <p className="text-sm">
//                   <span className="font-medium">Event:</span> {participant.eventId.title}
//                 </p>
//                 <p className="text-sm">
//                   {/* <span className="font-medium">Dates:</span> {formatDate(participant.event.startDate)} - {formatDate(participant.event.endDate)} */}
//                 </p>
//                 <p className="text-sm">
//                   <span className="font-medium">Entry Fee:</span> ${participant?.eventId?.entryFee || 'Free'}
//                 </p>
//               </div>
//             </div>

//             {/* Registration Details */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                 <Info className="mr-2" size={18} />
//                 Registration Details
//               </h4>
//               <div className="space-y-2">
//                 <p className="text-sm">
//                   <span className="font-medium">Status:</span>
//                   <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusColors[participant.status] || 'bg-gray-100 text-gray-800'}`}>
//                     {participant.status}
//                   </span>
//                 </p>
//                 <p className="text-sm">
//                   {/* <span className="font-medium">Registered On:</span> {formatDate(participant.createdAt)} */}
//                 </p>
//                 {participant.certificateId && (
//                   <p className="text-sm">
//                     <span className="font-medium">Certificate ID:</span> {participant.certificateId}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Payment Information */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//                 <CreditCard className="mr-2" size={18} />
//                 Payment Information
//               </h4>
//               <div className="space-y-2">
//                 {participant.paymentStatus ? (
//                   <>
//                     <p className="text-sm">
//                       <span className="font-medium">Payment Status:</span> {participant.paymentStatus}
//                     </p>
//                     {participant.paymentId && (
//                       <p className="text-sm">
//                         <span className="font-medium">Payment ID:</span> {participant.paymentId}
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <p className="text-sm text-gray-500">No payment information available</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Status Update Section */}
//           <div className="mt-6 bg-gray-50 p-4 rounded-lg">
//             <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//               <Shield className="mr-2" size={18} />
//               Update Registration Status
//             </h4>
//             <div className="flex flex-wrap gap-2">
//               {['Registered', 'Pending', 'Cancelled', 'Completed'].map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => onUpdateStatus(participant._id, status)}
//                   disabled={participant.status === status}
//                   className={`px-3 py-1 text-sm rounded-full flex items-center ${
//                     participant.status === status 
//                       ? 'bg-indigo-600 text-white cursor-default'
//                       : `${statusColors[status]} hover:opacity-80`
//                   }`}
//                 >
//                   {status}
//                   {participant.status === status && <Check className="ml-1" size={16} />}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ParticipantDetailsModal;

import React from 'react';
import { 
  User, Calendar, Award, Check, 
  X, ChevronRight, Info, CreditCard, 
  Shield, Mail
} from 'lucide-react';

const ParticipantDetailsModal = ({ 
  isOpen, 
  onClose, 
  participant,
  onViewUserEvents,
  onUpdateStatus
}) => {
  if (!isOpen || !participant) return null;

  const statusColors = {
    Registered: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Cancelled: 'bg-red-100 text-red-800',
    Completed: 'bg-blue-100 text-blue-800'
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
        <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
        <div style={{ width: '100%', maxWidth: '60%' }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Participant Details</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            >
              <X className="text-gray-400 hover:text-gray-600" size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <User className="mr-2" size={18} />
                  User Information
                </h4>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span> {participant?.userId?.name}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {participant?.userId?.email}
                  </p>
                  <button
                    onClick={() => onViewUserEvents(participant.userId._id, participant.userId.name)}
                    className="text-lightBlue-600 hover:text-blue-800 text-sm flex items-center mt-3"
                  >
                    View all events for this user <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              {/* Event Information */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Award className="mr-2" size={18} />
                  Event Information
                </h4>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Event:</span> {participant.eventId.title}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Entry Fee:</span> ${participant?.eventId?.entryFee || 'Free'}
                  </p>
                </div>
              </div>

              {/* Registration Details */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <Info className="mr-2" size={18} />
                  Registration Details
                </h4>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${statusColors[participant.status] || 'bg-gray-100 text-gray-800'}`}>
                      {participant.status}
                    </span>
                  </p>
                  {participant.certificateId && (
                    <p className="text-sm">
                      <span className="font-medium">Certificate ID:</span> {participant.certificateId}
                    </p>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard className="mr-2" size={18} />
                  Payment Information
                </h4>
                <div className="space-y-3">
                  {participant.paymentStatus ? (
                    <>
                      <p className="text-sm">
                        <span className="font-medium">Payment Status:</span> {participant.paymentStatus}
                      </p>
                      {participant.paymentId && (
                        <p className="text-sm">
                          <span className="font-medium">Payment ID:</span> {participant.paymentId}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No payment information available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Shield className="mr-2" size={18} />
                Update Registration Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {['Registered', 'Pending', 'Cancelled', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(participant._id, status)}
                    disabled={participant.status === status}
                    className={`px-4 py-2 text-sm rounded-xl flex items-center transition-all duration-200 ${
                      participant.status === status 
                        ? 'bg-lightBlue-600 text-white cursor-default'
                        : `${statusColors[status]} hover:opacity-80`
                    }`}
                  >
                    {status}
                    {participant.status === status && <Check className="ml-1" size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
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

export default ParticipantDetailsModal;