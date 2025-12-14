// import React from 'react';
// import { Trophy, CheckCircle } from 'lucide-react';

// const CertificatePreview = ({ certificate }) => {
//   return (
//     <div 
//       id="certificate-preview"
//       className="w-full max-w-5xl bg-white shadow-lg overflow-hidden"
//       style={{
//         border: '15px solid #d4af37',
//         borderRadius: '5px',
//       }}
//     >
//       {/* Certificate Header */}
//       <div className="bg-lightBlue-600 py-6 px-8 text-center">
//         <div className="flex justify-center mb-4">
//           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
//             <Trophy className="text-lightBlue-600" size={36} />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-white">Certificate of Completion</h1>
//         <p className="text-white opacity-90 mt-2">This certificate is proudly presented to</p>
//       </div>

//       {/* Certificate Body */}
//       <div className="p-8">
//         {/* Main Content */}
//         <div className="flex flex-col md:flex-row">
//           {/* Left Side - Main Content */}
//           <div className="md:w-2/3 md:pr-8">
//             <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center md:text-left">
//               {localStorage.getItem('user')?.name}
//             </h2>
            
//             <div className="text-gray-700 mb-6 text-center md:text-left">
//               <p className="mb-4">
//                 has successfully completed the <span className="font-semibold">{certificate.eventName}</span> 
//                 on {new Date(certificate.eventDates.end).toLocaleDateString('en-US', { 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}.
//               </p>
//               <p>
//                 {certificate.eventDescription}
//               </p>
//             </div>

//             <div className="border-t border-gray-300 pt-4 mt-6">
//               <div className="flex justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600">Certificate ID</p>
//                   <p className="font-medium">{certificate.id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Event Dates</p>
//                   <p className="font-medium">
//                     {new Date(certificate.eventDates.start).toLocaleDateString()} - {' '}
//                     {new Date(certificate.eventDates.end).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Verification */}
//           <div className="md:w-1/3 md:border-l md:border-gray-300 md:pl-8 mt-6 md:mt-0">
//             <div className="text-center">
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600">Certificate ID</p>
//                 <p className="font-mono text-lg">{certificate.id}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600">Issued On</p>
//                 <p className="font-medium">
//                   {new Date(certificate.registrationDate).toLocaleDateString('en-US', { 
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric',
//                   })}
//                 </p>
//               </div>
//               <div className="mb-6">
//                 <p className="text-sm text-gray-600">Verification Code</p>
//                 <p className="font-mono">{certificate.id.split('-')[2]}</p>
//               </div>
//               <div className="flex justify-center">
//                 <div className="w-24 h-24 bg-lightBlue-100 rounded-full flex items-center justify-center">
//                   <CheckCircle className="text-lightBlue-600" size={48} />
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mt-2">Verified Certificate</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Signatures */}
//         <div className="border-t border-gray-300 mt-8 pt-8">
//           <div className="flex justify-between">
//             <div className="text-center">
//               <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
//               <p className="text-sm text-gray-600">Authorized Signature</p>
//             </div>
//             <div className="text-center">
//               <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
//               <p className="text-sm text-gray-600">Event Coordinator</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePreview;


// import React from 'react';
// import { Trophy, CheckCircle } from 'lucide-react';

// const CertificatePreview = ({ certificate }) => {
//   return (
//     <div 
//       id="certificate-preview"
//       className="w-full max-w-4xl bg-white shadow-lg overflow-hidden"
//       style={{
//         border: '15px solid #d4af37', // Gold border
//         borderRadius: '5px',
//       }}
//     >
//       {/* Certificate Header */}
//       <div className="bg-lightBlue-600 py-6 px-8 text-center" style={{ backgroundColor: '#1e40af' }}>
//         <div className="flex justify-center mb-4">
//           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
//             <Trophy className="text-lightBlue-600" size={36} style={{ color: '#1e40af' }} />
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold text-white">Certificate of Completion</h1>
//         <p className="text-white opacity-90 mt-2">This certificate is proudly presented to</p>
//       </div>

//       {/* Certificate Body */}
//       <div className="p-8">
//         {/* Main Content */}
//         <div className="flex flex-col md:flex-row">
//           {/* Left Side - Main Content */}
//           <div className="md:w-2/3 md:pr-8">
//             <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center md:text-left" style={{ color: '#1e293b' }}>
//               {certificate.userName}
//             </h2>
            
//             <div className="text-gray-700 mb-6 text-center md:text-left" style={{ color: '#4b5563' }}>
//               <p className="mb-4">
//                 has successfully completed the <span className="font-semibold">{certificate.eventName}</span> 
//                 on {new Date(certificate.eventDates.end).toLocaleDateString('en-US', { 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}.
//               </p>
//               <p>
//                 {certificate.eventDescription}
//               </p>
//             </div>

//             <div className="border-t border-gray-300 pt-4 mt-6" style={{ borderColor: '#d1d5db' }}>
//               <div className="flex justify-between">
//                 <div>
//                   <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Certificate ID</p>
//                   <p className="font-medium" style={{ color: '#1e293b' }}>{certificate.id}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Event Dates</p>
//                   <p className="font-medium" style={{ color: '#1e293b' }}>
//                     {new Date(certificate.eventDates.start).toLocaleDateString()} - {' '}
//                     {new Date(certificate.eventDates.end).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Verification */}
//           <div className="md:w-1/3 md:border-l md:border-gray-300 md:pl-8 mt-6 md:mt-0" style={{ borderColor: '#d1d5db' }}>
//             <div className="text-center">
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Certificate ID</p>
//                 <p className="font-mono text-lg" style={{ color: '#1e293b' }}>{certificate.id}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Issued On</p>
//                 <p className="font-medium" style={{ color: '#1e293b' }}>
//                   {new Date(certificate.registrationDate).toLocaleDateString('en-US', { 
//                     year: 'numeric', 
//                     month: 'long', 
//                     day: 'numeric',
//                   })}
//                 </p>
//               </div>
//               <div className="mb-6">
//                 <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Verification Code</p>
//                 <p className="font-mono" style={{ color: '#1e293b' }}>{certificate.id.split('-')[2]}</p>
//               </div>
//               <div className="flex justify-center">
//                 <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
//                   <CheckCircle className="text-lightBlue-600" size={48} style={{ color: '#1e40af' }} />
//                 </div>
//               </div>
//               <p className="text-sm text-gray-600 mt-2" style={{ color: '#4b5563' }}>Verified Certificate</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Signatures */}
//         <div className="border-t border-gray-300 mt-8 pt-8" style={{ borderColor: '#d1d5db' }}>
//           <div className="flex justify-between">
//             <div className="text-center">
//               <div className="h-1 w-32 bg-gray-400 mx-auto mb-2" style={{ backgroundColor: '#9ca3af' }}></div>
//               <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Authorized Signature</p>
//             </div>
//             <div className="text-center">
//               <div className="h-1 w-32 bg-gray-400 mx-auto mb-2" style={{ backgroundColor: '#9ca3af' }}></div>
//               <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Event Coordinator</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePreview;


import React from 'react';
import { Trophy, CheckCircle } from 'lucide-react';

const CertificatePreview = ({ certificate }) => {
  return (
    <div className="flex justify-center items-start p-4 overflow-y-auto max-h-[80vh]">
      <div 
        id="certificate-preview"
        className="w-full max-w-4xl bg-white shadow-lg overflow-hidden"
        style={{
          border: '15px solid #d4af37',
          borderRadius: '5px',
        }}
      >
        {/* Certificate Header */}
        <div className="bg-lightBlue-600 py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md">
              <Trophy className="text-lightBlue-600" size={36} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Certificate of Completion</h1>
          <p className="text-white opacity-90 mt-2">This certificate is proudly presented to</p>
        </div>

        {/* Certificate Body */}
        <div className="p-8">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Main Content */}
            <div className="md:w-2/3 md:pr-8">
              <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center md:text-left">
                {certificate.userName}
              </h2>
              
              <div className="text-gray-700 mb-6 text-center md:text-left">
                <p className="mb-4">
                  has successfully completed the <span className="font-semibold">{certificate.eventName}</span> 
                  on {new Date(certificate.eventDates.end).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}.
                </p>
                <p>
                  {certificate.eventDescription}
                </p>
              </div>

              <div className="border-t border-gray-300 pt-4 mt-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Certificate ID</p>
                    <p className="font-medium">{certificate.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Event Dates</p>
                    <p className="font-medium">
                      {new Date(certificate.eventDates.start).toLocaleDateString()} - {' '}
                      {new Date(certificate.eventDates.end).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Verification */}
            <div className="md:w-1/3 md:border-l md:border-gray-300 md:pl-8 mt-6 md:mt-0">
              <div className="text-center">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Certificate ID</p>
                  <p className="font-mono text-lg">{certificate.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Issued On</p>
                  <p className="font-medium">
                    {new Date(certificate.registrationDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">Verification Code</p>
                  <p className="font-mono">{certificate.id.split('-')[2]}</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-lightBlue-600" size={48} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Verified Certificate</p>
              </div>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="border-t border-gray-300 mt-8 pt-8">
            <div className="flex justify-between">
              <div className="text-center">
                <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Authorized Signature</p>
              </div>
              <div className="text-center">
                <div className="h-1 w-32 bg-gray-400 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Event Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview;
