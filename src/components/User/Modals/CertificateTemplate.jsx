// // CertificateTemplate.jsx
// import React from 'react';

// const user = JSON.parse(localStorage.getItem('user'));
// const name = user?.name;
// console.log(name);
// // Helper function to format date (can be moved to a utils file)
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric'
//     });
//   } catch (e) { return 'Invalid Date'; }
// };

// // Helper function to format date range (can be moved to a utils file)
// const formatDateRange = (startDateString, endDateString) => {
//     const start = formatDate(startDateString);
//     const end = formatDate(endDateString);
//     if (start === 'N/A' || start === 'Invalid Date' || end === 'N/A' || end === 'Invalid Date') {
//         if (start !== 'N/A' && start !== 'Invalid Date') return start;
//         if (end !== 'N/A' && end !== 'Invalid Date') return end;
//         return 'N/A';
//     }
//     if (start === end) return start;
//     return `${start} - ${end}`;
// };


// // Certificate Template Component receives data via props
// const CertificateTemplate = ({ certificateData }) => {
//   if (!certificateData) return null; // Don't render if no data

//   const {
//     certificateId,
//     registrationDate, // This is the Issue Date
//     user,             // Assuming user object has name: user.name
//     event             // Assuming event object has title, startDate, endDate, description
//   } = certificateData;

//   const userName = name || 'Recipient Name';
//   const eventName = event?.title || 'Event Name';
//   const eventStartDate = event?.startDate;
//   const eventEndDate = event?.endDate;
//   const eventDescription = event?.description || 'Description of the event or achievement goes here.';
//   const verificationCode = certificateId?.split('-').pop() || 'N/A'; // Example: Extract last part

//   return (
//     // This div is what html2canvas will capture. Style it precisely.
//     // Use a unique ID for targeting
//     <div
//       id={`certificate-render-${certificateId}`} // Unique ID per certificate instance
//       className="w-full bg-white shadow-lg" // Base styles, match modal's template
//       style={{
//         border: '10px solid #c0a062', // Example border color
//         fontFamily: 'serif', // Use web safe fonts or ensure fonts are loaded
//         padding: '0', // Reset padding, children handle it
//         width: '1024px', // Fixed width often helps html2canvas consistency
//         // aspectRatio: '297 / 210', // Optional: Maintain aspect ratio if design depends on it
//       }}
//     >
//       {/* Header */}
//       <div style={{ backgroundColor: '#1E40AF', padding: '20px 30px', textAlign: 'center', color: 'white' }}>
//         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
//           <div style={{ width: '70px', height: '70px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
//             <span style={{ fontSize: '30px', color: '#1E40AF' }}>🏆</span> {/* Placeholder icon */}
//           </div>
//         </div>
//         <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Certificate of Completion</h1>
//         <p style={{ opacity: 0.9, marginTop: '8px', fontSize: '14px' }}>This certificate is proudly presented to</p>
//       </div>

//       {/* Body */}
//       <div style={{ padding: '30px 40px' }}>
//         <div style={{ display: 'flex', flexDirection: 'row', gap: '30px' }}> {/* Changed to row */}
//           {/* Left Side */}
//           <div style={{ flexGrow: 1 }}>
//             <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1F2937', marginBottom: '20px', textAlign: 'left' }}> {/* Align left */}
//               {userName}
//             </h2>
//             <div style={{ color: '#374151', marginBottom: '25px', textAlign: 'left', fontSize: '15px', lineHeight: '1.6' }}> {/* Align left */}
//               <p style={{ marginBottom: '15px' }}>
//                 has successfully completed the <span style={{ fontWeight: '600' }}>{eventName}</span> on {formatDate(eventEndDate)}.
//               </p>
//               <p style={{ fontStyle: 'italic', color: '#4B5563' }}>
//                 {eventDescription}
//               </p>
//             </div>
//             <div style={{ borderTop: '1px solid #D1D5DB', paddingTop: '15px', marginTop: '25px', fontSize: '12px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
//                 <div>
//                   <p style={{ color: '#6B7280' }}>Certificate ID</p>
//                   <p style={{ fontWeight: '500', wordBreak: 'break-all' }}>{certificateId || 'N/A'}</p>
//                 </div>
//                 <div style={{ textAlign: 'right' }}> {/* Align right */}
//                   <p style={{ color: '#6B7280' }}>Event Dates</p>
//                   <p style={{ fontWeight: '500' }}>
//                     {formatDateRange(eventStartDate, eventEndDate)}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side */}
//           <div style={{ width: '200px', borderLeft: '1px solid #D1D5DB', paddingLeft: '30px', paddingTop: '10px', flexShrink: 0 }}> {/* Adjusted styles */}
//             <div style={{ textAlign: 'center' }}>
//               <div style={{ marginBottom: '15px' }}>
//                 <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase' }}>Issued On</p>
//                 <p style={{ fontWeight: '500', fontSize: '13px' }}>
//                   {formatDate(registrationDate)}
//                 </p>
//               </div>
//               <div style={{ marginBottom: '20px' }}>
//                 <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase' }}>Verification Code</p>
//                 <p style={{ fontFamily: 'monospace', fontSize: '14px', wordBreak: 'break-all' }}>{verificationCode}</p>
//               </div>
//               <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5px' }}>
//                 <div style={{ width: '50px', height: '50px', backgroundColor: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <span style={{ fontSize: '24px', color: '#2563EB' }}>✔️</span> {/* Checkmark */}
//                 </div>
//               </div>
//               <p style={{ fontSize: '11px', color: '#6B7280' }}>Verified Certificate</p>
//             </div>
//           </div>
//         </div>

//         {/* Footer Signatures */}
//         <div style={{ borderTop: '1px solid #D1D5DB', marginTop: '30px', paddingTop: '25px' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', fontSize: '12px', color: '#4B5563' }}>
//             <div>
//               <div style={{ height: '1px', width: '120px', backgroundColor: '#9CA3AF', margin: '0 auto 8px auto' }}></div>
//               <p>Authorized Signature</p>
//             </div>
//             <div>
//               <div style={{ height: '1px', width: '120px', backgroundColor: '#9CA3AF', margin: '0 auto 8px auto' }}></div>
//               <p>Event Coordinator</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificateTemplate;


// CertificateTemplate.jsx
import React from 'react';

// --- SVG Checkmark Icon ---
const CheckmarkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      xmlSpace="preserve"
      style={{
        width: "28px",
        height: "28px",
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      fill="#2563EB" // Blue
    >
      <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
    </svg>
);
// --- End SVG ---

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  } catch (e) { return 'Invalid Date'; }
};

// Helper function to format date range
const formatDateRange = (startDateString, endDateString) => {
    const start = formatDate(startDateString);
    const end = formatDate(endDateString);
    if (start.includes('N/A') || start.includes('Invalid')) return end;
    if (end.includes('N/A') || end.includes('Invalid')) return start;
    if (start === end) return start;
    return `${start} - ${end}`;
};

// --- No separate 'styles' object needed here ---

const CertificateTemplate = ({ certificateData }) => {
  if (!certificateData) {
      console.warn("CertificateTemplate received no certificateData");
      return null;
  }

  const {
    certificateId,
    userName,
    event
  } = certificateData;

  const recipientName = userName || 'Recipient Name';
  const eventName = event?.title || 'Event Name';
  const eventStartDate = event?.startDate;
  const eventEndDate = event?.endDate;
  const eventDescription = event?.description || 'Successfully completed the event requirements.';
  const verificationCode = certificateId?.split('-').pop()?.slice(-6) || 'N/A';

  return (
    // *** Apply ALL relevant styles directly inline ***
    <div
      id={`certificate-render-${certificateId}`}
      style={{
        border: "15px solid #c0a062",
        backgroundColor: "#ffffff",
        fontFamily: '"Times New Roman", Times, serif',
        overflow: "hidden",
        width: '1024px', // Explicit width
        boxSizing: 'border-box',
        margin: 0,
        padding: 0
      }}
    >
      {/* Header */}
      <div style={{
        backgroundColor: "#1E40AF",
        color: "white",
        padding: "10px 40px 5px 40px",
        textAlign: "center",
      }}>
         <div style={{
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           marginBottom: '4px',
         }}>
             <img
                src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
                alt="Company Logo"
                style={{
                  height: '45px',
                  width: '45px',
                  borderRadius: '50%',
                  backgroundColor: 'white',
                  padding: '2px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  border: '1px solid #E5E7EB',
                  marginBottom: '4px',
                }}
             />
             <div style={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               gap: '0px',
               lineHeight: '1.1',
             }}>
                 <p style={{
                   fontSize: '20px',
                   fontWeight: 'bold',
                   color: 'white',
                   margin: '0',
                   lineHeight: '1.2',
                 }}>
                     Praedico Global Research
                 </p>
                 <p style={{
                   fontSize: '14px',
                   color: 'white',
                   fontWeight: '600',
                   margin: '0',
                   opacity: 0.9,
                   lineHeight: '1.2',
                 }}>
                     Virtual Trading Platform
                 </p>
             </div>
         </div>
        <p style={{
          fontSize: "26px",
          fontWeight: "bold",
          margin: "5px 0 2px 0",
          color: "white",
          lineHeight: '1.2',
        }}>
            Certificate of Completion
        </p>
        <p style={{
          fontSize: "13px",
          opacity: 0.9,
          margin: "0 0 4px 0",
          color: "white",
          lineHeight: '1.2',
        }}>
            This certificate is proudly presented to
        </p>
      </div>

      {/* Body */}
      <div style={{
        padding: "35px 50px",
        display: "flex",
        flexDirection: "row",
        gap: "40px",
        backgroundColor: '#ffffff',
      }}>
        {/* Left Column */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <p style={{
            fontSize: "36px",
            fontWeight: "bold",
            color: "#1F2937",
            marginBottom: "15px",
            textAlign: "left",
          }}>
            {recipientName}
          </p>
          <p style={{
            fontSize: "15px",
            color: "#374151",
            marginBottom: "10px",
            lineHeight: "1.5",
            textAlign: "left",
          }}>
            has successfully completed the{" "}
            <span style={{ fontWeight: "600", color: '#1E40AF' }}>
              {eventName}
            </span>{" "}
            on {formatDate(eventEndDate)}.
          </p>
          <p style={{
            fontSize: "13px",
            fontStyle: "italic",
            color: "#4B5563",
            marginBottom: "25px",
            textAlign: "left",
          }}>
            {eventDescription}
          </p>
          <div style={{
            borderTop: "1px solid #E5E7EB",
            paddingTop: "15px",
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
          }}>
            <div style={{ textAlign: "left" }}>
              <span style={{
                color: "#6B7280",
                display: "block",
                marginBottom: "2px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                textTransform: "uppercase",
              }}>
                Certificate ID
              </span>
              <p style={{
                fontWeight: "500",
                color: "#1F2937",
                fontFamily: '"Courier New", Courier, monospace',
                wordBreak: "break-all",
                fontSize: "11px",
              }}>
                {certificateId || "N/A"}
              </p>
            </div>
            <div
              style={{ textAlign: "right" }}
            >
              <span style={{
                color: "#6B7280",
                display: "block",
                marginBottom: "2px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                textTransform: "uppercase",
               }}>Event Dates</span>
              <p style={{ fontWeight: "500", color: "#1F2937", fontSize: "11px" }}>
                {formatDateRange(eventStartDate, eventEndDate)}
              </p>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div style={{
           width: "200px",
           flexShrink: 0,
           textAlign: "center",
           paddingLeft: "35px",
           borderLeft: "1px solid #E5E7EB",
           display: "flex",
           flexDirection: "column",
           justifyContent: "center",
           gap: "20px",
        }}>
          <div style={{ lineHeight: '1.3' }}>
            <span style={{
                color: "#6B7280",
                display: "block",
                marginBottom: "2px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                textTransform: "uppercase",
            }}>Issued On</span>
            <p style={{ fontWeight: "500", color: "#1F2937", fontSize: "11px" }}>
              {formatDate(eventEndDate)}
            </p>
          </div>
          <div style={{ lineHeight: '1.3' }}>
            <span style={{
                color: "#6B7280",
                display: "block",
                marginBottom: "2px",
                fontFamily: "Arial, sans-serif",
                fontSize: "10px",
                textTransform: "uppercase",
            }}>
              Verification Code
            </span>
            <p style={{
                fontWeight: "500",
                color: "#1F2937",
                fontFamily: '"Courier New", Courier, monospace',
                wordBreak: "break-all",
                fontSize: "11px",
             }}>
              {verificationCode}
            </p>
          </div>
          <div style={{ lineHeight: '1.3' }}>
            <div style={{
                width: "56px",
                height: "56px",
                backgroundColor: "#DBEAFE",
                borderRadius: "50%",
                margin: "8px auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
              <CheckmarkIcon />
            </div>
            <p style={{
                fontSize: "11px",
                color: "#6B7280",
                marginTop: "4px"
            }}>
              Verified Certificate
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid #E5E7EB",
        marginTop: "40px",
        padding: "20px 50px 30px 50px",
        backgroundColor: '#ffffff',
      }}>
         <div style={{
             display: "flex",
             justifyContent: "flex-start",
             textAlign: "center",
             fontSize: "11px",
             color: "#4B5563",
          }}>
          <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <p style={{
                fontFamily: '"Brush Script MT", "Brush Script Std", cursive, sans-serif',
                fontSize: "24px",
                color: "#374151",
                margin: "0 0 5px 0",
                lineHeight: '1',
                minHeight: '30px'
            }}>
               Authorized Signatory
            </p>
            <div style={{
                height: "1px",
                width: "200px",
                backgroundColor: "#9CA3AF",
                margin: "0 auto 6px auto",
             }}></div>
            <p style={{
               fontSize: "10px",
               color: "#6B7280",
            }}>
              Authorized Signature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;