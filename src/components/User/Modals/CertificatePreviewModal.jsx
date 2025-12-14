// // src/components/User/Modals/CertificatePreviewModal.jsx
// // real one working 
// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const user = JSON.parse(localStorage.getItem('user'));
// const usersName = user?.name;
// console.log(usersName);

// // --- SVG Checkmark Icon --- (Copied for self-containment)
// const CheckmarkIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 52 52"
//       xmlSpace="preserve"
//       style={{ width: "28px", height: "28px", display: 'inline-block', verticalAlign: 'middle' }}
//       fill="#2563EB"
//     >
//       <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
//     </svg>
// );
// // --- End SVG ---

// // --- Helper Functions --- (Copied for self-containment)
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   } catch (e) { return 'Invalid Date'; }
// };
// const formatDateRange = (startDateString, endDateString) => {
//     const start = formatDate(startDateString);
//     const end = formatDate(endDateString);
//     if (start.includes('N/A') || start.includes('Invalid')) return end;
//     if (end.includes('N/A') || end.includes('Invalid')) return start;
//     if (start === end) return start;
//     return `${start} - ${end}`;
// };
// // --- End Helpers ---

// // --- Define Styles (Copied EXACTLY from the working CertificateValidationModal) ---
// const styles = {
//      outerBorder: {
//       border: "15px solid #c0a062",
//       backgroundColor: "#ffffff",
//       fontFamily: '"Times New Roman", Times, serif',
//       overflow: "hidden",
//     },
//     header: {
//       backgroundColor: "#1E40AF", // rgb(30, 64, 175)
//       color: "white",
//       padding: "10px 40px 5px 40px",
//       textAlign: "center",
//     },
//     headerContentContainer: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         marginBottom: '4px',
//     },
//     logoImage: {
//       height: '45px',
//       width: '45px',
//       borderRadius: '50%',
//       backgroundColor: 'white',
//       padding: '2px',
//       boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
//       border: '1px solid #E5E7EB',
//       marginBottom: '4px',
//     },
//     headerTextGroup: {
//        display: 'flex',
//        flexDirection: 'column',
//        alignItems: 'center',
//        gap: '0px',
//        lineHeight: '1.1',
//     },
//     companyNameText: {
//         fontSize: '20px',
//         fontWeight: 'bold',
//         color: 'white',
//         margin: '0',
//         lineHeight: '1.2',
//     },
//     platformNameText: {
//         fontSize: '14px',
//         color: 'white',
//         fontWeight: '600',
//         margin: '0',
//         opacity: 0.9,
//         lineHeight: '1.2',
//     },
//     mainTitle: {
//         fontSize: "26px",
//         fontWeight: "bold",
//         margin: "5px 0 2px 0",
//         color: "white",
//         lineHeight: '1.2',
//     },
//     subTitle: {
//         fontSize: "13px",
//         opacity: 0.9,
//         margin: "0 0 4px 0",
//         color: "white",
//         lineHeight: '1.2',
//     },
//     bodyContainer: {
//       padding: "35px 50px",
//       display: "flex",
//       flexDirection: "row",
//       gap: "40px",
//       backgroundColor: '#ffffff',
//     },
//     leftColumn: { flexGrow: 1, display: "flex", flexDirection: "column" },
//     recipientName: {
//       fontSize: "36px",
//       fontWeight: "bold",
//       color: "#1F2937",
//       marginBottom: "15px",
//       textAlign: "left",
//     },
//     completionText: {
//       fontSize: "15px",
//       color: "#374151",
//       marginBottom: "10px",
//       lineHeight: "1.5",
//       textAlign: "left",
//     },
//     eventDescription: {
//       fontSize: "13px",
//       fontStyle: "italic",
//       color: "#4B5563",
//       marginBottom: "25px",
//       textAlign: "left",
//     },
//     detailsSection: {
//       borderTop: "1px solid #E5E7EB",
//       paddingTop: "15px",
//       marginTop: "auto",
//       display: "flex",
//       justifyContent: "space-between",
//       fontSize: "11px",
//     },
//     detailItem: { textAlign: "left" },
//     detailLabel: {
//       color: "#6B7280",
//       display: "block",
//       marginBottom: "2px",
//       fontFamily: "Arial, sans-serif",
//       fontSize: "10px",
//       textTransform: "uppercase",
//     },
//     detailValue: { fontWeight: "500", color: "#1F2937" },
//     detailValueMono: {
//       fontWeight: "500",
//       color: "#1F2937",
//       fontFamily: '"Courier New", Courier, monospace',
//       wordBreak: "break-all",
//       fontSize: "11px",
//     },
//     rightColumn: {
//       width: "200px",
//       flexShrink: 0,
//       textAlign: "center",
//       paddingLeft: "35px",
//       borderLeft: "1px solid #E5E7EB",
//       display: "flex",
//       flexDirection: "column",
//       justifyContent: "center",
//       gap: "20px",
//     },
//     verificationItem: {
//         lineHeight: '1.3',
//     },
//     verificationCheckmarkWrapper: {
//       width: "56px",
//       height: "56px",
//       backgroundColor: "#DBEAFE",
//       borderRadius: "50%",
//       margin: "8px auto",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     verifiedText: {
//         fontSize: "11px",
//         color: "#6B7280",
//         marginTop: "4px"
//     },
//     footer: {
//       borderTop: "1px solid #E5E7EB",
//       marginTop: "40px",
//       padding: "20px 50px 30px 50px",
//       backgroundColor: '#ffffff',
//     },
//     signaturesContainer: {
//       display: "flex",
//       justifyContent: "flex-start",
//       textAlign: "center",
//       fontSize: "11px",
//       color: "#4B5563",
//     },
//      signatureBlock: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     signatureText: {
//         fontFamily: '"Brush Script MT", "Brush Script Std", cursive, sans-serif',
//         fontSize: "24px",
//         color: "#374151",
//         margin: "0 0 5px 0",
//         lineHeight: '1',
//         minHeight: '30px'
//     },
//     signatureLine: {
//       height: "1px",
//       width: "200px",
//       backgroundColor: "#9CA3AF",
//       margin: "0 auto 6px auto",
//     },
//     signatureLabel: {
//        fontSize: "10px",
//        color: "#6B7280",
//     },
// };
// // --- End Styles ---

// const CertificatePreviewModal = ({ isOpen, onClose, certificateData }) => {
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Use the same download logic as CertificateValidationModal
//   const handleDownloadCertificate = async () => {
//     // Target the preview element *within this modal*
//     const certificateElement = document.getElementById("modal-certificate-preview");
//     if (!certificateElement || !certificateData) {
//         toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
//         console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "modal-certificate-preview"' : 'certificateData');
//         return;
//     }

//     setIsGenerating(true);
//     toast.loading("Generating PDF...", { id: "pdf-generating-modal" });

//     try {
//       // Use a delay *before* capture
//       await new Promise((resolve) => setTimeout(resolve, 350));

//       // Use the exact same html2canvas options that worked before
//       const canvas = await html2canvas(certificateElement, {
//         scale: 2.5,
//         useCORS: true,
//         scrollX: 0, // Use 0 for non-scrolling elements
//         scrollY: 0,
//         backgroundColor: '#ffffff',
//         logging: false,
//         width: certificateElement.offsetWidth,
//         height: certificateElement.offsetHeight,
//         windowWidth: document.documentElement.scrollWidth,
//         windowHeight: document.documentElement.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;

//       const pdf = new jsPDF({
//         orientation: imgWidth > imgHeight ? "landscape" : "portrait",
//         unit: "pt",
//         format: [imgWidth, imgHeight],
//       });

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//       const userNameSafe = usersName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
//       // Include event title in filename if available
//       const eventTitleSafe = certificateData.event?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'event';
//       const filename = `${userNameSafe}_${eventTitleSafe}_certificate.pdf`;
//       pdf.save(filename);

//       toast.dismiss("pdf-generating-modal");
//       toast.success("Certificate downloaded successfully!");
//       onClose(); // Close modal after successful download

//     } catch (error) {
//       toast.dismiss("pdf-generating-modal");
//       toast.error("Failed to generate certificate PDF.");
//       console.error("Certificate generation error:", error);
//       // Add specific error checks if needed
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   if (!isOpen || !certificateData) return null;

//   // Prepare data for the template (copied from CertificateTemplate itself for consistency)
//   const recipientName = usersName || 'Recipient Name';
//   const eventName = certificateData.event?.title || 'Event Name';
//   const eventStartDate = certificateData.event?.startDate;
//   const eventEndDate = certificateData.event?.endDate;
//   const eventDescription = certificateData.event?.description || 'Successfully completed the event requirements.';
//   const verificationCode = certificateData.certificateId?.split('-').pop()?.slice(-6) || 'N/A';
//   const certificateId = certificateData.certificateId; // For the details section

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
//       {/* Background overlay */}
//       <div
//         className="fixed inset-0 bg-gray-900 opacity-60" // Slightly darker overlay
//         onClick={onClose}
//       ></div>

//       {/* Modal container */}
//       <div className="relative w-full max-w-4xl sm:mx-auto my-6 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">
//         {/* Modal header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//            <h3 className="text-lg font-semibold text-gray-700">
//             Certificate Preview
//            </h3>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//             aria-label="Close modal"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
//           </button>
//         </div>

//         {/* Modal body - Contains the preview */}
//         {/* Added max-h and overflow-y */}
//         <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-210px)]">
//             <div className="flex justify-center"> {/* Center the preview */}
//                  {/* --- The VISIBLE Certificate Preview Element --- */}
//                  {/* Use a unique ID for targeting */}
//                  <div id="modal-certificate-preview" style={styles.outerBorder}>
//                     {/* Header */}
//                     <div style={styles.header}>
//                         <div style={styles.headerContentContainer}>
//                              <img
//                                 src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
//                                 alt="Company Logo"
//                                 style={styles.logoImage}
//                              />
//                              <div style={styles.headerTextGroup}>
//                                  <p style={styles.companyNameText}>
//                                      Praedico Global Research
//                                  </p>
//                                  <p style={styles.platformNameText}>
//                                      Virtual Trading Platform
//                                  </p>
//                              </div>
//                          </div>
//                         <p style={styles.mainTitle}>
//                             Certificate of Completion
//                         </p>
//                         <p style={styles.subTitle}>
//                             This certificate is proudly presented to
//                         </p>
//                     </div>
//                     {/* Body */}
//                     <div style={styles.bodyContainer}>
//                       {/* Left Column */}
//                       <div style={styles.leftColumn}>
//                         <p style={styles.recipientName}>
//                           {recipientName}
//                         </p>
//                         <p style={styles.completionText}>
//                           has successfully completed the{" "}
//                           <span style={{ fontWeight: "600", color: '#1E40AF' }}>
//                             {eventName}
//                           </span>{" "}
//                           on {formatDate(eventEndDate)}.
//                         </p>
//                         <p style={styles.eventDescription}>
//                           {eventDescription}
//                         </p>
//                         <div style={styles.detailsSection}>
//                           <div style={styles.detailItem}>
//                             <span style={styles.detailLabel}>
//                               Certificate ID
//                             </span>
//                             <p style={styles.detailValueMono}>
//                               {certificateId || "N/A"} {/* Use certificateId variable */}
//                             </p>
//                           </div>
//                           <div
//                             style={{ ...styles.detailItem, textAlign: "right" }}
//                           >
//                             <span style={styles.detailLabel}>Event Dates</span>
//                             <p style={styles.detailValue}>
//                               {formatDateRange(
//                                 eventStartDate,
//                                 eventEndDate
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       {/* Right Column */}
//                       <div style={styles.rightColumn}>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>Issued On</span>
//                           <p style={styles.detailValue}>
//                             {formatDate(eventEndDate)}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>
//                             Verification Code
//                           </span>
//                           <p style={styles.detailValueMono}>
//                             {verificationCode}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <div style={styles.verificationCheckmarkWrapper}>
//                             <CheckmarkIcon />
//                           </div>
//                           <p style={styles.verifiedText}>
//                             Verified Certificate
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Footer */}
//                     <div style={styles.footer}>
//                       <div style={styles.signaturesContainer}>
//                         <div style={styles.signatureBlock}>
//                           <p style={styles.signatureText}>
//                              Authorized Signatory
//                           </p>
//                           <div style={styles.signatureLine}></div>
//                           <p style={styles.signatureLabel}>
//                             Authorized Signature
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                  </div>
//                  {/* --- END VISIBLE PREVIEW --- */}
//             </div>
//         </div>

//         {/* Modal Footer - Download Button */}
//         <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
//             <button
//               onClick={onClose}
//               type="button"
//               className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 mr-3 transition-colors"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleDownloadCertificate}
//               disabled={isGenerating}
//               type="button"
//               className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                 isGenerating
//                   ? "bg-green-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
//               }`}
//             >
//               {isGenerating ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   Download PDF
//                 </>
//               )}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePreviewModal;


// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// const user = JSON.parse(localStorage.getItem('user'));
// const usersName = user?.name;
// console.log(usersName);

// // --- SVG Checkmark Icon --- (Keep as is)
// const CheckmarkIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 52 52"
//       xmlSpace="preserve"
//       style={{ width: "28px", height: "28px", display: 'inline-block', verticalAlign: 'middle' }}
//       fill="#2563EB"
//     >
//       <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
//     </svg>
// );
// // --- End SVG ---

// // --- Helper Functions --- (Keep as is)
// const formatDate = (dateString) => {
//   if (!dateString) return 'N/A';
//   try {
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return 'Invalid Date';
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
//   } catch (e) { return 'Invalid Date'; }
// };
// const formatDateRange = (startDateString, endDateString) => {
//     const start = formatDate(startDateString);
//     const end = formatDate(endDateString);
//     if (start.includes('N/A') || start.includes('Invalid')) return end;
//     if (end.includes('N/A') || end.includes('Invalid')) return start;
//     if (start === end) return start;
//     return `${start} - ${end}`;
// };
// // --- End Helpers ---


// // ==============================================================
// //       Certificate Preview Modal Component
// // ==============================================================
// const CertificatePreviewModal = ({ isOpen, onClose, certificateData }) => {
//   // State to control styles for PDF generation
//   const [isGenerating, setIsGenerating] = useState(false);

//   // --- Define Styles INSIDE the component to access isGenerating ---
//   // *** Use the EXACT styles from the working CertificateValidationModal ***
//   const styles = {
//      outerBorder: { border: "15px solid #c0a062", backgroundColor: "#ffffff", fontFamily: '"Times New Roman", Times, serif', overflow: "hidden" },
//     // --- Table Layout Method for Header ---
//     header: {
//         backgroundColor: "#1E40AF",
//         color: "white",
//         padding: "15px 40px 10px 40px",
//         textAlign: "center"
//     },
//     headerContentContainer: {
//         display: 'table',
//         width: 'auto',
//         margin: '0 auto',
//         borderCollapse: 'collapse',
//         marginBottom: '5px',
//     },
//     logoCell: {
//         display: 'table-cell',
//         verticalAlign: 'middle',
//         paddingRight: '15px',
//         // *** Conditional Padding for PDF vs Preview ***
//         paddingTop: isGenerating ? '10px' : '0px', // Use 0px for preview, 10px for PDF
//     },
//     logoImage: {
//         height: '45px',
//         width: 'auto',
//         borderRadius: '50%',
//         backgroundColor: 'white',
//         padding: '2px',
//         boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
//         border: '1px solid #E5E7EB',
//         display: 'block', // Important for table cell content
//     },
//     textCell: {
//          display: 'table-cell',
//          verticalAlign: 'middle',
//     },
//     headerTextGroup: {
//         textAlign: 'left',
//         lineHeight: '1.2',
//     },
//     companyNameText: {
//         fontSize: '20px',
//         fontWeight: 'bold',
//         color: 'white',
//         margin: '0',
//     },
//     platformNameText: {
//         fontSize: '14px',
//         color: 'white',
//         fontWeight: '600',
//         margin: '0',
//         opacity: 0.9,
//     },
//     // --- Rest of the styles (mainTitle, subTitle, body, etc.) ---
//      mainTitle: { fontSize: "26px", fontWeight: "bold", margin: "5px 0 2px 0", color: "white", lineHeight: '1.2' },
//     subTitle: { fontSize: "13px", opacity: 0.9, margin: "0 0 4px 0", color: "white", lineHeight: '1.2' },
//     bodyContainer: { padding: "35px 50px", display: "flex", flexDirection: "row", gap: "40px", backgroundColor: '#ffffff' },
//     leftColumn: { flexGrow: 1, display: "flex", flexDirection: "column" },
//     recipientName: { fontSize: "36px", fontWeight: "bold", color: "#1F2937", marginBottom: "15px", textAlign: "left" },
//     completionText: { fontSize: "15px", color: "#374151", marginBottom: "10px", lineHeight: "1.5", textAlign: "left" },
//     eventDescription: { fontSize: "13px", fontStyle: "italic", color: "#4B5563", marginBottom: "25px", textAlign: "left" },
//     detailsSection: { borderTop: "1px solid #E5E7EB", paddingTop: "15px", marginTop: "auto", display: "flex", justifyContent: "space-between", fontSize: "11px" },
//     detailItem: { textAlign: "left" },
//     detailLabel: { color: "#6B7280", display: "block", marginBottom: "2px", fontFamily: "Arial, sans-serif", fontSize: "10px", textTransform: "uppercase" },
//     detailValue: { fontWeight: "500", color: "#1F2937" },
//     detailValueMono: { fontWeight: "500", color: "#1F2937", fontFamily: '"Courier New", Courier, monospace', wordBreak: "break-all", fontSize: "11px" },
//     rightColumn: { width: "200px", flexShrink: 0, textAlign: "center", paddingLeft: "35px", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" },
//     verificationItem: { lineHeight: '1.3' },
//     verificationCheckmarkWrapper: { width: "56px", height: "56px", backgroundColor: "#DBEAFE", borderRadius: "50%", margin: "8px auto", display: "flex", alignItems: "center", justifyContent: "center" },
//     verifiedText: { fontSize: "11px", color: "#6B7280", marginTop: "4px" },
//     footer: { borderTop: "1px solid #E5E7EB", marginTop: "40px", padding: "20px 50px 30px 50px", backgroundColor: '#ffffff' },
//     signaturesContainer: { display: "flex", justifyContent: "flex-start", textAlign: "center", fontSize: "11px", color: "#4B5563" },
//     signatureBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
//     signatureText: { fontFamily: '"Brush Script MT", "Brush Script Std", cursive, sans-serif', fontSize: "24px", color: "#374151", margin: "0 0 5px 0", lineHeight: '1', minHeight: '30px' }, // Added sans-serif fallback
//     signatureLine: { height: "1px", width: "200px", backgroundColor: "#9CA3AF", margin: "0 auto 6px auto" },
//     signatureLabel: { fontSize: "10px", color: "#6B7280" },
// };
// // --- End Styles Definition ---


//   // --- Use the EXACT handleDownloadCertificate from CertificateValidationModal ---
//   const handleDownloadCertificate = async () => {
//     // Target the preview element *within this modal*
//     const certificateElement = document.getElementById("modal-certificate-preview"); // Use unique ID
//     if (!certificateElement || !certificateData) {
//         toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
//         console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "modal-certificate-preview"' : 'certificateData');
//         return;
//     }

//     // 1. Set state to indicate PDF generation is starting (triggers style change)
//     setIsGenerating(true);
//     toast.loading("Generating PDF...", { id: "pdf-generating-modal" }); // Use unique toast ID

//     try {
//       // 2. Wait briefly for React to re-render with the new state/style
//       await new Promise(resolve => setTimeout(resolve, 50)); // Short delay

//       // 3. Capture the canvas using the proven html2canvas options
//       const canvas = await html2canvas(certificateElement, {
//         scale: 2.5,
//         useCORS: true,
//         scrollX: 0, // Use 0 for non-scrolling modal content
//         scrollY: 0,
//         backgroundColor: '#ffffff',
//         logging: false,
//         width: certificateElement.offsetWidth,
//         height: certificateElement.offsetHeight,
//         windowWidth: document.documentElement.scrollWidth,
//         windowHeight: document.documentElement.scrollHeight,
//       });

//       const imgData = canvas.toDataURL("image/png", 1.0);
//       const imgWidth = canvas.width;
//       const imgHeight = canvas.height;

//       const pdf = new jsPDF({
//         orientation: imgWidth > imgHeight ? "landscape" : "portrait",
//         unit: "pt",
//         format: [imgWidth, imgHeight],
//       });

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

//       // Construct filename using data passed in props
//       const userNameSafe = usersName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
//       const eventTitleSafe = certificateData.event?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'event';
//       // Use certificateId for uniqueness if available
//       const certIdSuffix = certificateData?.certificateId ? `_${certificateData.certificateId}` : '';
//       const filename = `${userNameSafe}_${eventTitleSafe}${certIdSuffix}_certificate.pdf`;
//       pdf.save(filename);

//       toast.dismiss("pdf-generating-modal");
//       toast.success("Certificate downloaded successfully!");
//       onClose(); // Close modal after successful download

//     } catch (error) {
//       toast.dismiss("pdf-generating-modal");
//       toast.error("Failed to generate certificate PDF.");
//       console.error("Certificate generation error:", error);
//       // Add specific error checks if needed
//     } finally {
//        // 4. IMPORTANT: Reset state AFTER PDF generation (or error)
//       setIsGenerating(false);
//     }
//   };
//   // --- End Download Logic ---

//   // Render checks
//   if (!isOpen || !certificateData) return null;

//   // Prepare data for the template from props
//   // Ensure defaults are handled robustly
//   const recipientName = usersName || 'Recipient Name';
//   const eventName = certificateData?.event?.title || 'Event Name';
//   const eventStartDate = certificateData?.event?.startDate;
//   const eventEndDate = certificateData?.event?.endDate;
//   const eventDescription = certificateData?.event?.description || 'Successfully completed the event requirements.';
//   // Derive verification code from certificateId if possible
//   const verificationCode = certificateData?.certificateId?.toString().slice(-6) || 'N/A';
//   const certificateIdForDisplay = certificateData?.certificateId ? `CERT-${certificateData.certificateId}` : "N/A"; // Add CERT- prefix


//   // --- Modal Structure ---
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
//       {/* Background overlay */}
//       <div
//         className="fixed inset-0 bg-gray-900 opacity-60"
//         onClick={onClose}
//       ></div>

//       {/* Modal container */}
//       <div className="relative w-full max-w-4xl sm:mx-auto my-6 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">
//         {/* Modal header */}
//         <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
//            <h3 className="text-lg font-semibold text-gray-700">
//             Certificate Preview
//            </h3>
//           <button
//             onClick={onClose}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
//             aria-label="Close modal"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
//           </button>
//         </div>

//         {/* Modal body - Contains the preview */}
//         <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-210px)]">
//             <div className="flex justify-center">
//                  {/* --- The VISIBLE Certificate Preview Element --- */}
//                  {/* Use unique ID and apply dynamic styles */}
//                  <div id="modal-certificate-preview" style={styles.outerBorder}>
//                     {/* === USE THE EXACT WORKING TEMPLATE STRUCTURE === */}
//                     <div style={styles.header}>
//                         {/* Container styled as display: table */}
//                         <div style={styles.headerContentContainer}>
//                             {/* Logo Cell with conditional paddingTop */}
//                             <div style={styles.logoCell}>
//                                 <img
//                                     // Ensure this URL is correct and accessible via CORS if needed
//                                     src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
//                                     alt="PGR Logo"
//                                     style={styles.logoImage}
//                                 />
//                             </div>
//                             {/* Text Cell */}
//                             <div style={styles.textCell}>
//                                 <div style={styles.headerTextGroup}>
//                                     <p style={styles.companyNameText}>
//                                         Praedico Global Research
//                                     </p>
//                                     <p style={styles.platformNameText}>
//                                         Virtual Trading Platform
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                          {/* Titles remain below */}
//                         <p style={styles.mainTitle}>
//                             Certificate of Completion
//                         </p>
//                         <p style={styles.subTitle}>
//                             This certificate is proudly presented to
//                         </p>
//                     </div>
//                     {/* Body */}
//                     <div style={styles.bodyContainer}>
//                       {/* Left Column */}
//                       <div style={styles.leftColumn}>
//                         <p style={styles.recipientName}>
//                           {recipientName} {/* Use derived variable */}
//                         </p>
//                         <p style={styles.completionText}>
//                           has successfully completed the{" "}
//                           <span style={{ fontWeight: "600", color: '#1E40AF' }}>
//                             {eventName} {/* Use derived variable */}
//                           </span>{" "}
//                           on {formatDate(eventEndDate)}.
//                         </p>
//                         <p style={styles.eventDescription}>
//                           {eventDescription} {/* Use derived variable */}
//                         </p>
//                         <div style={styles.detailsSection}>
//                           <div style={styles.detailItem}>
//                             <span style={styles.detailLabel}>
//                               Certificate ID
//                             </span>
//                             {/* Display with CERT- prefix */}
//                             <p style={styles.detailValueMono}>
//                               {certificateIdForDisplay}
//                             </p>
//                           </div>
//                           <div
//                             style={{ ...styles.detailItem, textAlign: "right" }}
//                           >
//                             <span style={styles.detailLabel}>Event Dates</span>
//                             <p style={styles.detailValue}>
//                               {formatDateRange(
//                                 eventStartDate,
//                                 eventEndDate
//                               )}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                       {/* Right Column */}
//                       <div style={styles.rightColumn}>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>Issued On</span>
//                           <p style={styles.detailValue}>
//                             {formatDate(eventEndDate)}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>
//                             Verification Code
//                           </span>
//                            {/* Use derived variable */}
//                           <p style={styles.detailValueMono}>
//                             {verificationCode}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <div style={styles.verificationCheckmarkWrapper}>
//                             <CheckmarkIcon />
//                           </div>
//                           <p style={styles.verifiedText}>
//                             Verified Certificate
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* Footer */}
//                     <div style={styles.footer}>
//                       <div style={styles.signaturesContainer}>
//                         <div style={styles.signatureBlock}>
//                           <p style={styles.signatureText}>
//                              {/* Placeholder */}
//                              Authorized Signatory
//                           </p>
//                           <div style={styles.signatureLine}></div>
//                           <p style={styles.signatureLabel}>
//                             Authorized Signature
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     {/* === END OF WORKING TEMPLATE STRUCTURE === */}
//                  </div>
//                  {/* --- END VISIBLE PREVIEW --- */}
//             </div>
//         </div>

//         {/* Modal Footer - Download Button */}
//         <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
//             <button
//               onClick={onClose}
//               type="button"
//               className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 mr-3 transition-colors"
//             >
//               Close
//             </button>
//             <button
//               onClick={handleDownloadCertificate}
//               disabled={isGenerating}
//               type="button"
//               className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                 isGenerating
//                   ? "bg-green-400 cursor-not-allowed"
//                   : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
//               }`}
//             >
//               {isGenerating ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
//                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                   </svg>
//                   Download PDF
//                 </>
//               )}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePreviewModal;




import React, { useState } from 'react'; // Removed useEffect as state handles styles
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const user = JSON.parse(localStorage.getItem('user'));
const usersName = user?.name;
console.log(usersName);


// --- SVG Checkmark Icon --- (Keep as is)
const CheckmarkIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
      xmlSpace="preserve"
      style={{ width: "28px", height: "28px", display: 'inline-block', verticalAlign: 'middle' }}
      fill="#2563EB"
    >
      <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
    </svg>
);
// --- End SVG ---

// --- Helper Functions --- (Keep as is)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) { return 'Invalid Date'; }
};
const formatDateRange = (startDateString, endDateString) => {
    const start = formatDate(startDateString);
    const end = formatDate(endDateString);
    // Use includes for robustness as format might vary slightly
    if (start.includes('N/A') || start.includes('Invalid')) return end;
    if (end.includes('N/A') || end.includes('Invalid')) return start;
    if (start === end) return start;
    return `${start} - ${end}`;
};
// --- End Helpers ---


// ==============================================================
//       Certificate Preview Modal Component
// ==============================================================
const CertificatePreviewModal = ({ isOpen, onClose, certificateData }) => {
  // State to control styles for PDF generation
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Define Styles INSIDE the component to access isGenerating ---
  // *** CRITICAL: Use the EXACT styles from the final working CertificateValidationModal ***
  const styles = {
     outerBorder: { border: "15px solid #c0a062", backgroundColor: "#ffffff", fontFamily: '"Times New Roman", Times, serif', overflow: "hidden" },
    // --- Table Layout Method for Header ---
    header: {
        backgroundColor: "#1E40AF",
        color: "white",
        padding: "15px 40px 10px 40px",
        textAlign: "center"
    },
    headerContentContainer: {
        display: 'table',
        width: 'auto',
        margin: '0 auto',
        borderCollapse: 'collapse',
        marginBottom: '5px',
    },
    logoCell: {
        display: 'table-cell',
        verticalAlign: 'middle',
        paddingRight: '15px',
        // *** Conditional Padding for PDF vs Preview ***
        paddingTop: isGenerating ? '13px' : '0px', // Using 0px for preview (adjust if needed for preview)
    },
    logoImage: {
        height: '45px',
        width: 'auto',
        borderRadius: '50%',
        backgroundColor: 'white',
        padding: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        display: 'block', // Important for table cell content
    },
    textCell: {
         display: 'table-cell',
         verticalAlign: 'middle',
    },
    headerTextGroup: {
        textAlign: 'left',
        lineHeight: '1.2',
    },
    companyNameText: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'white',
        margin: '0',
    },
    platformNameText: {
        fontSize: '14px',
        color: 'white',
        fontWeight: '600',
        margin: '0',
        opacity: 0.9,
    },
    // --- Rest of the styles (mainTitle, subTitle, body, etc.) ---
     mainTitle: { fontSize: "26px", fontWeight: "bold", margin: "5px 0 2px 0", color: "white", lineHeight: '1.2' },
    subTitle: { fontSize: "13px", opacity: 0.9, margin: "0 0 4px 0", color: "white", lineHeight: '1.2' },
    bodyContainer: { padding: "35px 50px", display: "flex", flexDirection: "row", gap: "40px", backgroundColor: '#ffffff' },
    leftColumn: { flexGrow: 1, display: "flex", flexDirection: "column" },
    recipientName: { fontSize: "36px", fontWeight: "bold", color: "#1F2937", marginBottom: "15px", textAlign: "left" },
    completionText: { fontSize: "15px", color: "#374151", marginBottom: "10px", lineHeight: "1.5", textAlign: "left" },
    eventDescription: { fontSize: "13px", fontStyle: "italic", color: "#4B5563", marginBottom: "25px", textAlign: "left" },
    detailsSection: { borderTop: "1px solid #E5E7EB", paddingTop: "15px", marginTop: "auto", display: "flex", justifyContent: "space-between", fontSize: "11px" },
    detailItem: { textAlign: "left" },
    detailLabel: { color: "#6B7280", display: "block", marginBottom: "2px", fontFamily: "Arial, sans-serif", fontSize: "10px", textTransform: "uppercase" },
    detailValue: { fontWeight: "500", color: "#1F2937" },
    detailValueMono: { fontWeight: "500", color: "#1F2937", fontFamily: '"Courier New", Courier, monospace', wordBreak: "break-all", fontSize: "11px" },
    rightColumn: { width: "200px", flexShrink: 0, textAlign: "center", paddingLeft: "35px", borderLeft: "1px solid #E5E7EB", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" },
    verificationItem: { lineHeight: '1.3' },
    verificationCheckmarkWrapper: { width: "56px", height: "56px", backgroundColor: "#DBEAFE", borderRadius: "50%", margin: "8px auto", display: "flex", alignItems: "center", justifyContent: "center" },
    verifiedText: { fontSize: "11px", color: "#6B7280", marginTop: "4px" },
    footer: { borderTop: "1px solid #E5E7EB", marginTop: "40px", padding: "20px 50px 30px 50px", backgroundColor: '#ffffff' },
    signaturesContainer: { display: "flex", justifyContent: "flex-start", textAlign: "center", fontSize: "11px", color: "#4B5563" },
    signatureBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
    signatureText: { fontFamily: '"Brush Script MT", "Brush Script Std", cursive, sans-serif', fontSize: "24px", color: "#374151", margin: "0 0 5px 0", lineHeight: '1', minHeight: '30px' }, // Added sans-serif fallback
    signatureLine: { height: "1px", width: "200px", backgroundColor: "#9CA3AF", margin: "0 auto 6px auto" },
    signatureLabel: { fontSize: "10px", color: "#6B7280" },
};
// --- End Styles Definition ---


  // --- Use the EXACT handleDownloadCertificate from CertificateValidationModal ---
  const handleDownloadCertificate = async () => {
    const certificateElement = document.getElementById("modal-certificate-preview");
    if (!certificateElement || !certificateData) {
        toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
        console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "modal-certificate-preview"' : 'certificateData');
        return;
    }

    setIsGenerating(true);
    toast.loading("Generating PDF...", { id: "pdf-generating-modal" });

    try {
      await new Promise(resolve => setTimeout(resolve, 50)); // Short delay for style application

      // *** CRITICAL: Ensure html2canvas options are identical to validation modal ***
      const canvas = await html2canvas(certificateElement, {
        scale: 2.5,
        useCORS: true,
        scrollX: 0, // Use 0 because modal content shouldn't scroll independently
        scrollY: 0,
        backgroundColor: '#ffffff', // Match background
        logging: false,
        // Capture the actual rendered size, don't force width/height unless necessary
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight,
        // These might be less critical if element size is calculated correctly, but keep for consistency
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // *** CRITICAL: Ensure jsPDF options are identical ***
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "pt",
        // The format IS the size, derived directly from the canvas capture
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const userNameSafe = usersName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
      const eventTitleSafe = certificateData.event?.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'event';
      const certIdSuffix = certificateData?.certificateId ? `_CERT-${certificateData.certificateId}` : ''; // Use full ID in filename
      const filename = `${userNameSafe}_${eventTitleSafe}${certIdSuffix}_certificate.pdf`;
      pdf.save(filename);

      toast.dismiss("pdf-generating-modal");
      toast.success("Certificate downloaded successfully!");
      onClose();

    } catch (error) {
      toast.dismiss("pdf-generating-modal");
      toast.error("Failed to generate certificate PDF.");
      console.error("Certificate generation error:", error);
    } finally {
      setIsGenerating(false); // Reset state
    }
  };
  // --- End Download Logic ---

  // Render checks
  if (!isOpen || !certificateData) return null;

  // Prepare data for the template (ensure consistency)
  const recipientName = usersName || 'Recipient Name';
  const eventName = certificateData?.event?.title || 'Event Name';
  const eventStartDate = certificateData?.event?.startDate;
  const eventEndDate = certificateData?.event?.endDate;
  const eventDescription = certificateData?.event?.description || 'Successfully completed the event requirements.';
  // Use the raw certificate ID for verification code derivation if needed, or display full
  const rawCertificateId = certificateData?.certificateId?.toString() || '';
  const verificationCode = rawCertificateId.slice(-6) || 'N/A'; // Last 6 digits
  const certificateIdForDisplay = certificateData?.certificateId ? `CERT-${rawCertificateId}` : "N/A"; // Display with prefix


  // --- Modal Structure ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="fixed inset-0 bg-gray-900 opacity-60" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl sm:mx-auto my-6 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col">
        {/* Modal header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl">
           <h3 className="text-lg font-semibold text-gray-700">Certificate Preview</h3>
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
           </button>
        </div>

        {/* Modal body - Contains the preview */}
        {/* CRITICAL: Ensure this container imposes the same constraints as the validation modal's container */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-210px)]">
            {/* Standardize the immediate wrapper for consistent sizing */}
            <div className="flex justify-center items-start"> {/* Use items-start if content might push down */}
                <div className="w-full max-w-3xl"> {/* Apply similar max-width if used in validation modal */}
                     {/* --- The VISIBLE Certificate Preview Element --- */}
                     <div id="modal-certificate-preview" style={styles.outerBorder}>
                        {/* === USE THE EXACT WORKING TEMPLATE STRUCTURE === */}
                        <div style={styles.header}>
                            <div style={styles.headerContentContainer}>
                                <div style={styles.logoCell}>
                                    <img
                                        src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
                                        alt="PGR Logo"
                                        style={styles.logoImage}
                                    />
                                </div>
                                <div style={styles.textCell}>
                                    <div style={styles.headerTextGroup}>
                                        <p style={styles.companyNameText}>Praedico Global Research</p>
                                        <p style={styles.platformNameText}>Virtual Trading Platform</p>
                                    </div>
                                </div>
                            </div>
                            <p style={styles.mainTitle}>Certificate of Completion</p>
                            <p style={styles.subTitle}>This certificate is proudly presented to</p>
                        </div>
                        {/* Body */}
                        <div style={styles.bodyContainer}>
                          <div style={styles.leftColumn}>
                            <p style={styles.recipientName}>{recipientName}</p>
                            <p style={styles.completionText}>
                              has successfully completed the{" "}
                              <span style={{ fontWeight: "600", color: '#1E40AF' }}>{eventName}</span>{" "}
                              on {formatDate(eventEndDate)}.
                            </p>
                            <p style={styles.eventDescription}>{eventDescription}</p>
                            <div style={styles.detailsSection}>
                              <div style={styles.detailItem}>
                                <span style={styles.detailLabel}>Certificate ID</span>
                                <p style={styles.detailValueMono}>{certificateIdForDisplay}</p>
                              </div>
                              <div style={{ ...styles.detailItem, textAlign: "right" }}>
                                <span style={styles.detailLabel}>Event Dates</span>
                                <p style={styles.detailValue}>{formatDateRange(eventStartDate, eventEndDate)}</p>
                              </div>
                            </div>
                          </div>
                          <div style={styles.rightColumn}>
                            <div style={styles.verificationItem}>
                              <span style={styles.detailLabel}>Issued On</span>
                              <p style={styles.detailValue}>{formatDate(eventEndDate)}</p>
                            </div>
                            <div style={styles.verificationItem}>
                              <span style={styles.detailLabel}>Verification Code</span>
                              <p style={styles.detailValueMono}>{verificationCode}</p>
                            </div>
                            <div style={styles.verificationItem}>
                              <div style={styles.verificationCheckmarkWrapper}><CheckmarkIcon /></div>
                              <p style={styles.verifiedText}>Verified Certificate</p>
                            </div>
                          </div>
                        </div>
                        {/* Footer */}
                        <div style={styles.footer}>
                          <div style={styles.signaturesContainer}>
                            <div style={styles.signatureBlock}>
                              <p style={styles.signatureText}>Authorized Signatory</p>
                              <div style={styles.signatureLine}></div>
                              <p style={styles.signatureLabel}>Authorized Signature</p>
                            </div>
                          </div>
                        </div>
                        {/* === END OF WORKING TEMPLATE STRUCTURE === */}
                     </div>
                     {/* --- END VISIBLE PREVIEW --- */}
                </div>
            </div>
        </div>

        {/* Modal Footer - Download Button */}
        <div className="flex justify-end items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
             <button onClick={onClose} type="button" className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 mr-3 transition-colors">
               Close
             </button>
             <button onClick={handleDownloadCertificate} disabled={isGenerating} type="button" className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${ isGenerating ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:ring-green-500" }`}>
               {isGenerating ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   Generating...
                 </>
               ) : (
                 <>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                   Download PDF
                 </>
               )}
             </button>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreviewModal;