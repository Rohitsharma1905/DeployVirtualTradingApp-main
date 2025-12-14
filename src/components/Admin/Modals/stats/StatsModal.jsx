// // components/Modal.js
// import React from 'react';

// const StatsModal = ({ isOpen, onClose, children, title }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">{title}</h3>
//           <button 
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <i className="fas fa-times"></i>
//           </button>
//         </div>
//         <div className="modal-content">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StatsModal;



import React from 'react';

const StatsModal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Background overlay - matches ConfirmationModal */}
      <div className="fixed inset-0 bg-gray-900 opacity-50 z-50"></div>
      
      {/* Modal container - matches ConfirmationModal style but with graph content */}
      <div style={{ width: '100%', maxWidth: '90%' }} className="relative w-full h-full max-h-[86vh]  mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
        <div className="p-6 z-50">
          {/* Header section */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          
          {/* Content area with scrolling for large graphs */}
          <div className="mt-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
          
          {/* Footer with close button - similar to ConfirmationModal */}
          <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
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
  );
};

export default StatsModal;