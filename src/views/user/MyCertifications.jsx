// // real one working

// // src/pages/User/MyCertifications.jsx
// import React, { useEffect, useState, useRef } from 'react'; // Removed useRef
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// // Removed html2canvas, jsPDF imports here, they are now in the modal
// import {
//   fetchUserCertificates,
//   selectAllCertificates,
//   selectCertificatesStatus,
//   selectCertificatesError,
// } from '../../redux/User/events/eventsSlice'; // Adjust path if needed
// import {
//   Award,
//   Calendar,
//   Download, // Still used for button icon
//   FileText,
//   Trophy,
// } from 'lucide-react';

// // Import the NEW preview modal component
// import CertificatePreviewModal from '../../components/User/Modals/CertificatePreviewModal'; // Adjust path if needed
// // Removed CertificateTemplate import, it's only used inside the Preview Modal now
// // const user = JSON.parse(localStorage.getItem('user'));
// // const userId = user?._id;
// // console.log(userId);

// const MyCertifications = () => {
//   const dispatch = useDispatch();
//   const certificates = useSelector(selectAllCertificates);
//   const status = useSelector(selectCertificatesStatus);
//   const error = useSelector(selectCertificatesError);
//   const { user: loggedInUser, auth: { isAuthenticated } } = useSelector((state) => state.user);

//   // --- State for the NEW Preview Modal ---
//   const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
//   const [selectedCertificateData, setSelectedCertificateData] = useState(null);
//   // --- Removed state/ref for off-screen rendering ---
//   // const [isGeneratingPdf, setIsGeneratingPdf] = useState(null);
//   // const [certificateToRender, setCertificateToRender] = useState(null);
//   // const certificateRenderRef = useRef(null);

//   // --- Format Date (Unchanged) ---
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-US', {
//         year: 'numeric', month: 'short', day: 'numeric'
//       });
//     } catch (e) { return 'Invalid Date'; }
//   };

//   // --- *** UPDATED handleDownload to OPEN THE MODAL *** ---
//   const handlePreviewAndDownload = (certificateId) => {
//     const certData = certificates.find(c => c.certificateId === certificateId);
//     if (!certData) {
//       toast.error('Certificate data not found.');
//       return;
//     }

//     // Prepare data for the modal (ensure structure is correct)
//     const dataForModal = {
//         certificateId: certData.certificateId,
//         // *** VERIFY this userName source is correct for your Redux state ***
//         userName: certData.userName || certData.user?.name || loggedInUser?.name,
//         event: certData.event // Pass the whole event object
//     };

//     // Set state to open the modal with the selected certificate's data
//     setSelectedCertificateData(dataForModal);
//     setIsPreviewModalOpen(true);
//   };
//   // --- END Updated handleDownload ---

//   // --- Removed the useEffect for PDF generation - it's now inside the modal ---

//   // --- Fetch Certificates Effect (Unchanged) ---
//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(fetchUserCertificates());
//     }
//   }, [dispatch, isAuthenticated]);

//   // --- Loading, Error, Auth Check, Empty States (Unchanged) ---
//   if (status === 'loading') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightBlue-600"></div>
//       </div>
//     );
//   }
//   // ... (rest of the loading/error/auth/empty checks are the same) ...
//    if (status === 'failed') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Error Loading Certificates</h2>
//           <p className="mb-6 text-red-500">{error || 'Failed to fetch certificates'}</p>
//           <button
//             onClick={() => dispatch(fetchUserCertificates())}
//             className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
//           <h2 className="text-2xl font-bold mb-4 text-gray-800">Please Log In</h2>
//           <p className="mb-6 text-gray-600">You need to be logged in to view your certificates</p>
//           <Link
//             to="/login" // Adjust login path if needed
//             className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
//           >
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     );
//   }

//    if (certificates.length === 0 && status === 'succeeded') {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-extrabold text-gray-900">My Certificates</h1>
//             <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
//               View and download your trading competition certificates
//             </p>
//           </div>

//           <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
//             <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
//               <Award className="text-gray-400" size={36} />
//             </div>
//             <h3 className="text-2xl font-semibold text-gray-600 mb-4">
//               No certificates yet
//             </h3>
//             <p className="text-gray-500 max-w-md mx-auto mb-6">
//               Complete an event to earn your first certificate!
//             </p>
//             <Link
//               to="/user/eventspage" // Adjust path if needed
//               className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
//             >
//               Browse Events
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }


//   // --- Main Content ---
//   return (
//     // Removed relative positioning if not needed
//     <div className="min-h-screen bg-gray-50">

//       {/* --- Removed Hidden Container --- */}

//       {/* Render the Preview Modal Conditionally */}
//       <CertificatePreviewModal
//         isOpen={isPreviewModalOpen}
//         onClose={() => {
//             setIsPreviewModalOpen(false);
//             setSelectedCertificateData(null); // Clear data on close
//         }}
//         certificateData={selectedCertificateData}
//       />

//       {/* Main Page Content */}
//       <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-extrabold text-gray-900">My Certificates</h1>
//           <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
//             View and download your trading competition certificates
//           </p>
//         </div>

//         {/* Certificates Grid */}
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {certificates.map((certificate) => (
//             <div
//               key={certificate.certificateId}
//               className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 flex flex-col"
//             >
//               {/* Card Content */}
//               <div className="p-5 flex-grow">
//                  {/* ... Card content unchanged ... */}
//                  <div className="flex justify-between items-start mb-4">
//                    <div className="flex items-center overflow-hidden">
//                      <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xs mr-3 flex-shrink-0">
//                        <Award className="text-lightBlue-600" size={20} />
//                      </div>
//                      <div className="flex-grow min-w-0">
//                        <h3 className="text-lg font-bold text-gray-800 truncate">
//                          {certificate.event?.title || 'Untitled Event'}
//                        </h3>
//                        <div className="flex items-center mt-1">
//                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">
//                            completed
//                          </span>
//                        </div>
//                      </div>
//                    </div>
//                 </div>
//                  <div className="space-y-3">
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center text-gray-600">
//                       <Calendar className="mr-1.5 text-gray-500" size={14} />
//                       <span>
//                         {formatDate(certificate.event?.startDate)} - {formatDate(certificate.event?.endDate)}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="border-t border-b border-gray-100 py-3 grid grid-cols-2 gap-3">
//                     <div className="flex items-start text-sm">
//                       <FileText className="mr-1.5 text-gray-500 mt-0.5 flex-shrink-0" size={14} />
//                       <div>
//                         <span className="text-gray-500 block text-xs">Certificate ID</span>
//                         <p className="font-mono text-xs break-all">{certificate.certificateId || 'N/A'}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start text-sm">
//                        <Calendar className="mr-1.5 text-gray-500 mt-0.5 flex-shrink-0" size={14} />
//                       <div>
//                         <span className="text-gray-500 block text-xs">Issued On</span>
//                         <p className="font-medium">{formatDate(certificate.event?.endDate)}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-3">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Trophy className="mr-1.5 text-yellow-500" size={14} />
//                         <span>Certificate Status</span>
//                       </div>
//                       <span className="text-sm font-semibold text-green-600">Verified</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Actions Button - Now opens the modal */}
//               <div className="p-4 border-t border-gray-100 bg-gray-50/50">
//                   <button
//                       // Updated onClick handler
//                       onClick={() => handlePreviewAndDownload(certificate.certificateId)}
//                       // Removed disabled state related to direct generation
//                       className="w-full py-2.5 px-4 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
//                   >
//                       <Download className="mr-2" size={16} />
//                       Preview & Download
//                   </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MyCertifications;


import React, { useEffect, useState } from 'react'; // Removed useRef
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// Removed html2canvas, jsPDF imports

import {
  fetchUserCertificates, // Keep this
  selectAllCertificates,
  selectCertificatesStatus,
  selectCertificatesError,
} from '../../redux/User/events/eventsSlice'; // Adjust path if needed
import {
  Award,
  Calendar,
  Download, // Keep for icon
  FileText,
  Trophy,
} from 'lucide-react';

// Import the UPDATED preview modal component
import CertificatePreviewModal from '../../components/User/Modals/CertificatePreviewModal'; // Adjust path if needed

// --- MyCertifications Component ---
const MyCertifications = () => {
  const user = JSON.parse(localStorage.getItem('user'));
const userId = user?._id;
  console.log(userId);
  const dispatch = useDispatch();
  const certificates = useSelector(selectAllCertificates);
  console.log(certificates.length);
  
  const status = useSelector(selectCertificatesStatus);
  const error = useSelector(selectCertificatesError);
  // Get logged-in user info directly from Redux state
  const { user: loggedInUser, auth: { isAuthenticated } } = useSelector((state) => state.user);

  // State for the Preview Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedCertificateData, setSelectedCertificateData] = useState(null);

  // --- Format Date (Unchanged) ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
      });
    } catch (e) { return 'Invalid Date'; }
  };

  // --- *** UPDATED handlePreviewAndDownload to prepare data for MODAL *** ---
  const handlePreviewAndDownload = (certificateId) => {
    // Find the full certificate object from the Redux store
    const certData = certificates.find(c => c.certificateId === certificateId);
    if (!certData) {
      toast.error('Certificate data not found.');
      console.error("Could not find certificate with ID:", certificateId, "in", certificates);
      return;
    }

    // Prepare data object required by the modal
    // Ensure all necessary fields are included
    const dataForModal = {
        certificateId: certData.certificateId,
        // Get user name from logged-in user state as primary source
        userName: user?.name || 'User Name', // Provide fallback
        // Pass the event object nested inside, as the modal expects
        event: {
            title: certData.event?.title || 'Untitled Event', // Use optional chaining and fallback
            startDate: certData.event?.startDate,
            endDate: certData.event?.endDate,
            description: certData.event?.description || 'Successfully completed the event.' // Provide fallback
        }
        // Add any other fields the template inside the modal might need
    };

    console.log("Data being sent to modal:", dataForModal); // Debugging

    // Set state to open the modal with the prepared data
    setSelectedCertificateData(dataForModal);
    setIsPreviewModalOpen(true);
  };
  // --- END Updated handlePreviewAndDownload ---

  // --- Fetch Certificates Effect (Unchanged) ---
  useEffect(() => {
    if (isAuthenticated) { // Only fetch if authenticated
      dispatch(fetchUserCertificates(userId));
    }
  }, [dispatch, isAuthenticated, userId]);

  // --- Loading, Error, Auth Check, Empty States (Unchanged) ---
  if (!isAuthenticated) { // Check auth status first
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Please Log In</h2>
          <p className="mb-6 text-gray-600">You need to be logged in to view your certificates</p>
          <Link
            to="/login" // Adjust login path if needed
            className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightBlue-600"></div>
      </div>
    );
  }

   if (status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Error Loading Certificates</h2>
          <p className="mb-6 text-red-500">{error || 'Failed to fetch certificates'}</p>
          <button
            onClick={() => dispatch(fetchUserCertificates())} // Retry fetching certificates
            className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

   if (certificates.length === 0 && status === 'succeeded') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900">My Certificates</h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              View and download your trading competition certificates
            </p>
          </div>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Award className="text-gray-400" size={36} />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">
              No certificates yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Complete an event to earn your first certificate!
            </p>
            <Link
              to="/user/eventspage" // Adjust path if needed
              className="px-6 py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }


  // --- Main Content ---
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Render the Preview Modal Conditionally */}
      <CertificatePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedCertificateData(null); // Clear data on close
        }}
        // Pass the prepared data object
        certificateData={selectedCertificateData}
      />

      {/* Main Page Content */}
      <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl mt-4 sm:text-3xl md:text-4xl font-extrabold text-gray-900">My Certificates</h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            View and download your trading competition certificates
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((certificate) => (
            <div
              // Use certificateId for the key as it's unique
              key={certificate.certificateId}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 flex flex-col"
            >
              {/* Card Content */}
              <div className="p-5 flex-grow">
                 {/* Card content structure remains the same */}
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center overflow-hidden">
                     <div className="p-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-xs mr-3 flex-shrink-0">
                       <Award className="text-lightBlue-600" size={20} />
                     </div>
                     <div className="flex-grow min-w-0">
                       <h3 className="text-lg font-bold text-gray-800 truncate">
                         {/* Use optional chaining for safety */}
                         {certificate.event?.title || 'Untitled Event'}
                       </h3>
                       <div className="flex items-center mt-1">
                         <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                           completed
                         </span>
                       </div>
                     </div>
                   </div>
                </div>
                 <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-1.5 text-gray-500" size={14} />
                      <span>
                        {/* Use optional chaining */}
                        {formatDate(certificate.event?.startDate)} - {formatDate(certificate.event?.endDate)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-b border-gray-100 py-3 grid grid-cols-2 gap-3">
                    <div className="flex items-start text-sm">
                      <FileText className="mr-1.5 text-gray-500 mt-0.5 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-gray-500 block text-xs">Certificate ID</span>
                        {/* Display the certificateId directly */}
                        <p className="font-mono text-xs break-all">{certificate.certificateId || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-start text-sm">
                       <Calendar className="mr-1.5 text-gray-500 mt-0.5 flex-shrink-0" size={14} />
                      <div>
                        <span className="text-gray-500 block text-xs">Issued On</span>
                        {/* Use optional chaining */}
                        <p className="font-medium">{formatDate(certificate.event?.endDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Trophy className="mr-1.5 text-yellow-500" size={14} />
                        <span>Certificate Status</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Button - Now opens the modal */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                      // Updated onClick to call the revised handler
                      onClick={() => handlePreviewAndDownload(certificate.certificateId)}
                      className="w-full py-2.5 px-4 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center text-sm font-medium"
                  >
                      <Download className="mr-2" size={16} />
                      Preview & Download
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCertifications;