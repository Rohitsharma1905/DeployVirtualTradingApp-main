// // import React from 'react';
// // import { Link } from 'react-router';

// // const SessionExpiredModal = ({ show, onHide }) => {
// //   if (!show) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
// //       <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
// //         <div className="flex justify-between items-center mb-4">
// //           <h2 className="text-xl font-semibold">Session Expired</h2>
// //           <button onClick={onHide} className="text-gray-500 hover:text-gray-700">
// //             &times;
// //           </button>
// //         </div>
// //         <p className="mb-4">Your session has expired. Please log in again to continue.</p>
// //         <div className="flex justify-end">
// //           <Link to="/"
// //             onClick={onHide}
// //             className="bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600"
// //           >
// //             Log In Again
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default SessionExpiredModal;

// import React from 'react';
// import { Link } from 'react-router-dom';

// const SessionExpiredModal = ({ show, onHide }) => {
//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
//       {/* Overlay */}
//       <div className="fixed inset-0 bg-gray-900 opacity-50"></div>

//       {/* Modal Container */}
//       <div
//         style={{ width: '100%', maxWidth: '40%' }}
//         className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
//       >
//         {/* Modal Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-100">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-exclamation text-white"></i>
//             </div>
//             <h2 className="text-2xl font-semibold text-gray-800">Session Expired</h2>
//           </div>
//           <button
//             onClick={onHide}
//             className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
//           >
//             <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6">
//           <p className="text-gray-700 mb-6">
//             Your session has expired. Please log in again to continue.
//           </p>

//           {/* Modal Footer */}
//           <div className="flex justify-end items-center space-x-4 pt-4 border-t border-gray-100">
//             <button
//               onClick={onHide}
//               className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
//             >
//               Close
//             </button>
//             <Link
//               to="/" // Adjust the login route as needed
//               onClick={onHide}
//               className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
//             >
//               Log In Again
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SessionExpiredModal;