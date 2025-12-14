
// // real one working 
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl"; // Assuming this path is correct

// // --- SVG Checkmark Icon ---
// const CheckmarkIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 52 52" // Standard checkmark viewbox
//       xmlSpace="preserve"
//       style={{ // Apply size directly here for simplicity
//         width: "28px",
//         height: "28px",
//         display: 'inline-block', // Important for positioning
//         verticalAlign: 'middle' // Helps align within flex container
//       }}
//       fill="#2563EB" // Blue color from previous styles: rgb(37, 99, 235)
//     >
//       <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
//     </svg>
// );
// // --- End SVG ---


// const CertificateValidationModal = ({ isOpen, onClose }) => {
//   const [certificateData, setCertificateData] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // --- Formik and Validation Schema (Unchanged) ---
//   const validationSchema = Yup.object({
//     certificateCode: Yup.string().required("Certificate code is required"),
//     userName: Yup.string()
//       .required("User name is required")
//       .min(3, "User name must be at least 3 characters"),
//   });

//   const formik = useFormik({
//     initialValues: { certificateCode: "", userName: "" },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//       setSubmitting(true);
//       setCertificateData(null);
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/admin/events/certificates/validate`,
//           {
//             params: {
//               certificateId: values.certificateCode,
//               userName: values.userName,
//             },
//           }
//         );
//         if (response.data.success && response.data.certificate) {
//           const cert = response.data.certificate;
//           const displayData = {
//             id: cert.id || values.certificateCode,
//             userName: cert.userName || values.userName,
//             eventName: cert.eventName || "Sample Event Name",
//             registrationDate: cert.registrationDate || new Date().toISOString(),
//             eventDates: {
//               start: cert.eventStartDate || cert.eventDates?.start || new Date().toISOString(),
//               end: cert.eventEndDate || cert.eventDates?.end || new Date().toISOString(),
//             },
//             eventDescription: cert.eventDescription || "Successfully completed the required event participation.",
//           };
//           setCertificateData(displayData);
//           toast.success("Certificate validated successfully!");
//         } else {
//           toast.error(
//             response.data.message || "Certificate validation failed."
//           );
//           setCertificateData(null);
//         }
//       } catch (error) {
//         const errorMsg = error.response?.data?.message || "Error validating certificate. Please check details or try again.";
//         toast.error(errorMsg);
//         console.error("Certificate validation error:", error.response?.data || error.message);
//         setCertificateData(null);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });
//   // --- End Formik and Validation ---

//   // --- Function to handle certificate download ---
//   const handleDownloadCertificate = async () => {
//     const certificateElement = document.getElementById("certificate-preview");
//     if (!certificateElement || !certificateData) {
//         toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
//         console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "certificate-preview"' : 'certificateData');
//         return;
//     }

//     setIsGenerating(true);
//     toast.loading("Generating PDF...", { id: "pdf-generating" });

//     try {
//       // Increased delay slightly to help ensure rendering completes
//       await new Promise((resolve) => setTimeout(resolve, 350));

//       const canvas = await html2canvas(certificateElement, {
//         scale: 2.5, // Keep scale high
//         useCORS: true,
//         scrollX: -window.scrollX,
//         scrollY: -window.scrollY,
//         backgroundColor: '#ffffff', // *** Still very important ***
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

//       const userNameSafe =
//         certificateData.userName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
//       const filename = `${userNameSafe}_certificate_${certificateData.id || 'validated'}.pdf`;
//       pdf.save(filename);

//       toast.dismiss("pdf-generating");
//       toast.success("Certificate downloaded successfully!");
//     } catch (error) {
//       toast.dismiss("pdf-generating");
//       toast.error("Failed to generate certificate PDF.");
//       console.error("Certificate generation error:", error);
//       if (error.message && error.message.toLowerCase().includes("color function")) {
//         toast.error("Error: Problem rendering CSS colors. Ensure only standard colors (#hex, rgb) are used.", { duration: 8000 });
//       } else if (error.message && error.message.toLowerCase().includes("tainted")) {
//          toast.error("Error: Image loading issue (CORS or Taint). Check image source and server headers.", { duration: 8000 });
//       }
//     } finally {
//       setIsGenerating(false);
//     }
//   };
//   // --- End Download Function ---

//   // --- Helper Functions (Unchanged) ---
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch (e) {
//       console.error("Error formatting date:", dateString, e);
//       return "Invalid Date";
//     }
//   };
//   const formatDateRange = (startDateString, endDateString) => {
//     const start = formatDate(startDateString);
//     const end = formatDate(endDateString);
//     if (
//       (start === "N/A" || start === "Invalid Date") &&
//       (end === "N/A" || end === "Invalid Date")
//     )
//       return "N/A";
//     if (start === "N/A" || start === "Invalid Date") return end;
//     if (end === "N/A" || end === "Invalid Date") return start;
//     if (start === end) return start;
//     return `${start} - ${end}`;
//   };
//   // --- End Helper Functions ---

//   // --- Render Logic ---
//   if (!isOpen) return null;

//   // --- Define Styles (Updated Footer styles) ---
//   const styles = {
//     // ... (Outer Border, Header, Body styles remain unchanged from previous version) ...
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

//     // --- Footer Styles Updated ---
//     footer: {
//       borderTop: "1px solid #E5E7EB",
//       marginTop: "40px",
//       padding: "20px 50px 30px 50px", // Adjust top padding if needed
//       backgroundColor: '#ffffff',
//     },
//     signaturesContainer: {
//       display: "flex",
//       justifyContent: "flex-start", // Align single block to the left
//       textAlign: "center",
//       fontSize: "11px",
//       color: "#4B5563",
//     },
//      signatureBlock: {
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//     },
//     // --- NEW: Style for the signature text ---
//     signatureText: {
//         fontFamily: '"Brush Script MT", "Brush Script Std", cursive', // Cursive font stack
//         fontSize: "24px", // Adjust size as needed
//         color: "#374151", // Dark gray color
//         margin: "0 0 5px 0", // Space below signature text, above the line
//         lineHeight: '1', // Prevent extra line height
//         minHeight: '30px' // Ensure space even if text is short
//     },
//     // --- End NEW ---
//     signatureLine: {
//       height: "1px",
//       width: "200px",
//       backgroundColor: "#9CA3AF",
//       // Removed top margin from here, controlled by signatureText marginBottom now
//       margin: "0 auto 6px auto",
//     },
//     signatureLabel: {
//        fontSize: "10px",
//        color: "#6B7280",
//     },
//     // --- End Footer Styles ---
//   };
//   // --- End Styles Definition ---

//   return (
//     // Modal Wrapper
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
//       {/* Background overlay */}
//       <div
//         className="fixed inset-0 bg-gray-900 opacity-50"
//         onClick={onClose}
//       ></div>

//       {/* Modal container */}
//       <div className="relative w-full max-w-4xl sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//         {/* Modal header (Unchanged) */}
//         <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
//            <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-certificate text-white text-xl"></i>
//             </div>
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//               Validate Certificate
//             </h2>
//           </div>
//           <button
//             onClick={() => {
//               onClose();
//               formik.resetForm();
//               setCertificateData(null);
//             }}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             aria-label="Close modal"
//           >
//             <i className="fas fa-times text-lg"></i>
//           </button>
//         </div>

//         {/* Modal body */}
//         <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
//           {!certificateData ? (
//             // Validation Form (Unchanged)
//             <form onSubmit={formik.handleSubmit} className="space-y-5">
//                <div className="space-y-4">
//                 <div>
//                   <label
//                     htmlFor="certificateCode"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Certificate Code
//                   </label>
//                   <input
//                     id="certificateCode"
//                     type="text"
//                     name="certificateCode"
//                     value={formik.values.certificateCode}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-4 py-2.5 !rounded-lg border ${
//                       formik.touched.certificateCode &&
//                       formik.errors.certificateCode
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200`}
//                     placeholder="Enter certificate code"
//                     aria-describedby="certificateCode-error"
//                   />
//                   {formik.touched.certificateCode &&
//                   formik.errors.certificateCode ? (
//                     <div
//                       id="certificateCode-error"
//                       className="text-red-600 text-xs mt-1"
//                     >
//                       {formik.errors.certificateCode}
//                     </div>
//                   ) : null}
//                 </div>
//                 <div>
//                   <label
//                     htmlFor="userName"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     User Name
//                   </label>
//                   <input
//                     id="userName"
//                     type="text"
//                     name="userName"
//                     value={formik.values.userName}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-4 py-2.5 !rounded-lg border ${
//                       formik.touched.userName && formik.errors.userName
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200`}
//                     placeholder="Enter user name as registered"
//                     aria-describedby="userName-error"
//                   />
//                   {formik.touched.userName && formik.errors.userName ? (
//                     <div
//                       id="userName-error"
//                       className="text-red-600 text-xs mt-1"
//                     >
//                       {formik.errors.userName}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//               <div className="flex justify-end items-center space-x-3 pt-5 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onClose();
//                     formik.resetForm();
//                     setCertificateData(null);
//                   }}
//                   className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={formik.isSubmitting}
//                   className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
//                     formik.isSubmitting
//                       ? "bg-blue-400 cursor-not-allowed"
//                       : "bg-lightBlue-600 hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/30"
//                   }`}
//                 >
//                   {formik.isSubmitting ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin mr-2"></i>
//                       Validating...
//                     </>
//                   ) : (
//                     "Validate Certificate"
//                   )}
//                 </button>
//               </div>
//             </form>
//           ) : (
//             // Certificate Display and Download
//             <div className="space-y-6">
//               {/* Certificate Preview Wrapper */}
//               <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gray-50">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                   Certificate Preview
//                 </h3>
//                 <div className="w-full max-w-3xl overflow-hidden shadow-md">
//                   {/* This is the element that will be captured */}
//                   <div id="certificate-preview" style={styles.outerBorder}>
//                     {/* Header (Unchanged) */}
//                     <div style={styles.header}>
//                         <div style={styles.headerContentContainer}>
//                              <img
//                                 src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
//                                 alt="PGR Logo"
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
//                     {/* Body (Unchanged) */}
//                     <div style={styles.bodyContainer}>
//                       {/* Left Column */}
//                       <div style={styles.leftColumn}>
//                         <p style={styles.recipientName}>
//                           {certificateData.userName || "Recipient Name"}
//                         </p>
//                         <p style={styles.completionText}>
//                           has successfully completed the{" "}
//                           <span style={{ fontWeight: "600", color: '#1E40AF' }}>
//                             {certificateData.eventName || "Event Name"}
//                           </span>{" "}
//                           on {formatDate(certificateData.eventDates?.end)}.
//                         </p>
//                         <p style={styles.eventDescription}>
//                           {certificateData.eventDescription || "Default description of event completion."}
//                         </p>
//                         <div style={styles.detailsSection}>
//                           <div style={styles.detailItem}>
//                             <span style={styles.detailLabel}>
//                               Certificate ID
//                             </span>
//                             <p style={styles.detailValueMono}>
//                               {certificateData.id || "N/A"}
//                             </p>
//                           </div>
//                           <div
//                             style={{ ...styles.detailItem, textAlign: "right" }}
//                           >
//                             <span style={styles.detailLabel}>Event Dates</span>
//                             <p style={styles.detailValue}>
//                               {formatDateRange(
//                                 certificateData.eventDates?.start,
//                                 certificateData.eventDates?.end
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
//                             {formatDate(certificateData.eventDates?.end)}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>
//                             Verification Code
//                           </span>
//                           <p style={styles.detailValueMono}>
//                             {certificateData.id?.split("-").pop()?.slice(-6) || "N/A"}
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
//                     {/* Footer --- UPDATED --- */}
//                     <div style={styles.footer}>
//                       <div style={styles.signaturesContainer}>
//                         <div style={styles.signatureBlock}>
//                           {/* ADDED: Signature Text Placeholder */}
//                           <p style={styles.signatureText}>
//                             {/* You can put placeholder text or leave it empty */}
//                             {/* Example: J. Doe */}
//                             {/* Or use a more generic placeholder */}
//                             Authorized Signatory
//                           </p>
//                           {/* END ADDED */}
//                           <div style={styles.signatureLine}></div>
//                           <p style={styles.signatureLabel}>
//                             Authorized Signature
//                           </p>
//                         </div>
//                          {/* Removed the Event Coordinator block */}
//                       </div>
//                     </div>
//                     {/* --- End Footer Update --- */}
//                   </div>
//                 </div>
//                 {/* --- END: VISIBLE Certificate Preview Element --- */}
//               </div>

//               {/* Actions (Unchanged) */}
//               <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-5 border-t border-gray-200">
//                  <button
//                   onClick={() => {
//                     setCertificateData(null);
//                     formik.resetForm();
//                   }}
//                   className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Validate Another
//                 </button>
//                 <button
//                   onClick={handleDownloadCertificate}
//                   disabled={isGenerating}
//                   className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
//                     isGenerating
//                       ? "bg-green-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500/30"
//                   }`}
//                 >
//                   {isGenerating ? (
//                     <>
//                       <svg
//                         className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-download mr-2"></i>Download
//                       Certificate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificateValidationModal;



// certificate id udapte
// import React, { useState } from "react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import axios from "axios";
// import { BASE_API_URL } from "../../../utils/BaseUrl"; // Assuming this path is correct

// // --- SVG Checkmark Icon (Unchanged) ---
// const CheckmarkIcon = () => (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 52 52"
//       xmlSpace="preserve"
//       style={{
//         width: "28px",
//         height: "28px",
//         display: 'inline-block',
//         verticalAlign: 'middle'
//       }}
//       fill="#2563EB"
//     >
//       <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
//     </svg>
// );
// // --- End SVG ---


// const CertificateValidationModal = ({ isOpen, onClose }) => {
//   const [certificateData, setCertificateData] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // --- Formik and Validation Schema ---
//   const validationSchema = Yup.object({
//     // Changed from certificateCode to certificateNumber
//     certificateNumber: Yup.string()
//       .matches(/^[0-9]+$/, "Certificate code must contain only numbers")
//       .required("Certificate code is required"),
//     userName: Yup.string()
//       .required("User name is required")
//       .min(3, "User name must be at least 3 characters"),
//   });

//   const formik = useFormik({
//     // Changed initial value key
//     initialValues: { certificateNumber: "", userName: "" },
//     validationSchema,
//     onSubmit: async (values, { setSubmitting }) => {
//       setSubmitting(true);
//       setCertificateData(null);
//       try {
//         const response = await axios.get(
//           `${BASE_API_URL}/admin/events/certificates/validate`, // Adjust endpoint if needed
//           {
//             params: {
//               // Send the numeric part as certificateId
//               certificateId: values.certificateNumber,
//               userName: values.userName,
//             },
//           }
//         );
//         if (response.data.success && response.data.certificate) {
//           const cert = response.data.certificate;
//           // Prepare data for display (id is numeric here)
//           const displayData = {
//             id: cert.id, // Store the numeric ID
//             userName: cert.userName || values.userName,
//             eventName: cert.eventName || "Sample Event Name",
//             registrationDate: cert.registrationDate || new Date().toISOString(),
//             eventDates: {
//               start: cert.eventStartDate || cert.eventDates?.start || new Date().toISOString(),
//               end: cert.eventEndDate || cert.eventDates?.end || new Date().toISOString(),
//             },
//             eventDescription: cert.eventDescription || "Successfully completed the required event participation.",
//           };
//           setCertificateData(displayData);
//           toast.success("Certificate validated successfully!");
//         } else {
//           toast.error(
//             response.data.message || "Certificate validation failed."
//           );
//           setCertificateData(null);
//         }
//       } catch (error) {
//         const errorMsg = error.response?.data?.message || "Error validating certificate. Please check details or try again.";
//         toast.error(errorMsg);
//         console.error("Certificate validation error:", error.response?.data || error.message);
//         setCertificateData(null);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });
//   // --- End Formik and Validation ---

//   // --- Function to handle certificate download (Unchanged logic, uses certificateData.id which is now numeric) ---
//   const handleDownloadCertificate = async () => {
//     const certificateElement = document.getElementById("certificate-preview");
//     if (!certificateElement || !certificateData) {
//         toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
//         console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "certificate-preview"' : 'certificateData');
//         return;
//     }

//     setIsGenerating(true);
//     toast.loading("Generating PDF...", { id: "pdf-generating" });

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 350)); // Ensure rendering

//       const canvas = await html2canvas(certificateElement, {
//         scale: 2.5,
//         useCORS: true,
//         scrollX: -window.scrollX,
//         scrollY: -window.scrollY,
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

//       const userNameSafe = certificateData.userName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
//       // Filename uses the numeric ID
//       const filename = `${userNameSafe}_certificate_CERT-${certificateData.id || 'validated'}.pdf`;
//       pdf.save(filename);

//       toast.dismiss("pdf-generating");
//       toast.success("Certificate downloaded successfully!");
//     } catch (error) {
//       toast.dismiss("pdf-generating");
//       toast.error("Failed to generate certificate PDF.");
//       console.error("Certificate generation error:", error);
//        if (error.message && error.message.toLowerCase().includes("color function")) {
//         toast.error("Error: Problem rendering CSS colors. Ensure only standard colors (#hex, rgb) are used.", { duration: 8000 });
//       } else if (error.message && error.message.toLowerCase().includes("tainted")) {
//          toast.error("Error: Image loading issue (CORS or Taint). Check image source and server headers.", { duration: 8000 });
//       }
//     } finally {
//       setIsGenerating(false);
//     }
//   };
//   // --- End Download Function ---

//   // --- Helper Functions (Unchanged) ---
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return "Invalid Date";
//       return date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//     } catch (e) {
//       console.error("Error formatting date:", dateString, e);
//       return "Invalid Date";
//     }
//   };
//   const formatDateRange = (startDateString, endDateString) => {
//     const start = formatDate(startDateString);
//     const end = formatDate(endDateString);
//     if ((start === "N/A" || start === "Invalid Date") && (end === "N/A" || end === "Invalid Date")) return "N/A";
//     if (start === "N/A" || start === "Invalid Date") return end;
//     if (end === "N/A" || end === "Invalid Date") return start;
//     if (start === end) return start;
//     return `${start} - ${end}`;
//   };
//   // --- End Helper Functions ---

//   // --- Render Logic ---
//   if (!isOpen) return null;

//   // --- Define Styles (Unchanged) ---
//   const styles = {
//     // ... (All previous style definitions remain the same) ...
//      outerBorder: { border: "15px solid #c0a062", backgroundColor: "#ffffff", fontFamily: '"Times New Roman", Times, serif', overflow: "hidden" },
//     header: { backgroundColor: "#1E40AF", color: "white", padding: "10px 40px 5px 40px", textAlign: "center" },
//     headerContentContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4px' },
//     logoImage: { height: '45px', width: '45px', borderRadius: '50%', backgroundColor: 'white', padding: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', marginBottom: '4px' },
//     headerTextGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', lineHeight: '1.1' },
//     companyNameText: { fontSize: '20px', fontWeight: 'bold', color: 'white', margin: '0', lineHeight: '1.2' },
//     platformNameText: { fontSize: '14px', color: 'white', fontWeight: '600', margin: '0', opacity: 0.9, lineHeight: '1.2' },
//     mainTitle: { fontSize: "26px", fontWeight: "bold", margin: "5px 0 2px 0", color: "white", lineHeight: '1.2' },
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
//     signatureText: { fontFamily: '"Brush Script MT", "Brush Script Std", cursive', fontSize: "24px", color: "#374151", margin: "0 0 5px 0", lineHeight: '1', minHeight: '30px' },
//     signatureLine: { height: "1px", width: "200px", backgroundColor: "#9CA3AF", margin: "0 auto 6px auto" },
//     signatureLabel: { fontSize: "10px", color: "#6B7280" },
//   };
//   // --- End Styles Definition ---

//   return (
//     // Modal Wrapper
//     <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
//       {/* Background overlay */}
//       <div
//         className="fixed inset-0 bg-gray-900 opacity-50"
//         onClick={onClose}
//       ></div>

//       {/* Modal container */}
//       <div className="relative w-full max-w-4xl sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
//         {/* Modal header (Unchanged) */}
//         <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
//            <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <i className="fas fa-certificate text-white text-xl"></i>
//             </div>
//             <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
//               Validate Certificate
//             </h2>
//           </div>
//           <button
//             onClick={() => {
//               onClose();
//               formik.resetForm();
//               setCertificateData(null);
//             }}
//             className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             aria-label="Close modal"
//           >
//             <i className="fas fa-times text-lg"></i>
//           </button>
//         </div>

//         {/* Modal body */}
//         <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
//           {!certificateData ? (
//             // --- UPDATED Validation Form ---
//             <form onSubmit={formik.handleSubmit} className="space-y-5">
//                <div className="space-y-4">
//                 {/* --- Certificate ID Input with Prefix --- */}
//                 <div>
//                   <label
//                     htmlFor="certificateNumber" // Label points to the input
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     Certificate Code
//                   </label>
//                   <div className={`flex items-center border rounded-lg overflow-hidden transition-all duration-200 ${
//                       formik.touched.certificateNumber && formik.errors.certificateNumber
//                         ? "border-red-500"
//                         : "border-gray-300 focus-within:border-lightBlue-600 focus-within:ring-2 focus-within:ring-lightBlue-600/20"
//                     } `}>
//                     {/* Fixed Prefix */}
//                     <span className="px-3 py-2.5 text-gray-500 bg-gray-100 border-r border-gray-300 font-medium">
//                       CERT-
//                     </span>
//                     {/* Input for Numeric Part */}
//                     <input
//                       id="certificateNumber" // ID for label
//                       type="text" // Use text for easier input, validation handles numeric
//                       inputMode="numeric" // Hint for mobile numeric keyboard
//                       pattern="[0-9]*" // Basic HTML5 pattern check
//                       name="certificateNumber" // Formik field name
//                       value={formik.values.certificateNumber}
//                       onChange={formik.handleChange}
//                       onBlur={formik.handleBlur}
//                       className={`w-full px-4 py-2.5 border-0 bg-white text-gray-900 focus:outline-none focus:ring-0`} // Remove internal borders/rings
//                       placeholder="Enter numeric code"
//                       aria-describedby="certificateNumber-error"
//                     />
//                   </div>
//                   {/* Error Message */}
//                   {formik.touched.certificateNumber && formik.errors.certificateNumber ? (
//                     <div
//                       id="certificateNumber-error"
//                       className="text-red-600 text-xs mt-1"
//                     >
//                       {formik.errors.certificateNumber}
//                     </div>
//                   ) : null}
//                 </div>
//                 {/* --- End Certificate ID Input --- */}

//                 {/* --- User Name Input (Unchanged) --- */}
//                 <div>
//                   <label
//                     htmlFor="userName"
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     User Name
//                   </label>
//                   <input
//                     id="userName"
//                     type="text"
//                     name="userName"
//                     value={formik.values.userName}
//                     onChange={formik.handleChange}
//                     onBlur={formik.handleBlur}
//                     className={`w-full px-4 py-2.5 !rounded-lg border ${
//                       formik.touched.userName && formik.errors.userName
//                         ? "border-red-500"
//                         : "border-gray-300"
//                     } bg-white text-gray-900 focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 focus:outline-none transition-all duration-200`}
//                     placeholder="Enter user name as registered"
//                     aria-describedby="userName-error"
//                   />
//                   {formik.touched.userName && formik.errors.userName ? (
//                     <div
//                       id="userName-error"
//                       className="text-red-600 text-xs mt-1"
//                     >
//                       {formik.errors.userName}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//               {/* --- Form Actions (Unchanged) --- */}
//               <div className="flex justify-end items-center space-x-3 pt-5 border-t border-gray-200">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     onClose();
//                     formik.resetForm();
//                     setCertificateData(null);
//                   }}
//                   className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={formik.isSubmitting}
//                   className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
//                     formik.isSubmitting
//                       ? "bg-blue-400 cursor-not-allowed"
//                       : "bg-lightBlue-600 hover:bg-blue-700 focus:ring-2 focus:ring-lightBlue-600/30"
//                   }`}
//                 >
//                   {formik.isSubmitting ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin mr-2"></i>
//                       Validating...
//                     </>
//                   ) : (
//                     "Validate Certificate"
//                   )}
//                 </button>
//               </div>
//             </form>
//           ) : (
//             // --- Certificate Display and Download ---
//             <div className="space-y-6">
//               {/* Certificate Preview Wrapper */}
//               <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gray-50">
//                 <h3 className="text-lg font-semibold mb-4 text-gray-700">
//                   Certificate Preview
//                 </h3>
//                 <div className="w-full max-w-3xl overflow-hidden shadow-md">
//                   {/* This is the element that will be captured */}
//                   <div id="certificate-preview" style={styles.outerBorder}>
//                     {/* Header (Unchanged) */}
//                      <div style={styles.header}>
//                         <div style={styles.headerContentContainer}>
//                              <img
//                                 src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ" // Replace with your actual logo URL or import
//                                 alt="PGR Logo"
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
//                           {certificateData.userName || "Recipient Name"}
//                         </p>
//                         <p style={styles.completionText}>
//                           has successfully completed the{" "}
//                           <span style={{ fontWeight: "600", color: '#1E40AF' }}>
//                             {certificateData.eventName || "Event Name"}
//                           </span>{" "}
//                           on {formatDate(certificateData.eventDates?.end)}.
//                         </p>
//                         <p style={styles.eventDescription}>
//                           {certificateData.eventDescription || "Default description of event completion."}
//                         </p>
//                         <div style={styles.detailsSection}>
//                           <div style={styles.detailItem}>
//                             <span style={styles.detailLabel}>
//                               Certificate ID
//                             </span>
//                             {/* --- UPDATED: Prepend CERT- for display --- */}
//                             <p style={styles.detailValueMono}>
//                               {certificateData.id || "N/A"}
//                             </p>
//                           </div>
//                           <div
//                             style={{ ...styles.detailItem, textAlign: "right" }}
//                           >
//                             <span style={styles.detailLabel}>Event Dates</span>
//                             <p style={styles.detailValue}>
//                               {formatDateRange(
//                                 certificateData.eventDates?.start,
//                                 certificateData.eventDates?.end
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
//                             {formatDate(certificateData.eventDates?.end)}
//                           </p>
//                         </div>
//                         <div style={styles.verificationItem}>
//                           <span style={styles.detailLabel}>
//                             Verification Code
//                           </span>
//                           {/* Use slice on the numeric ID */}
//                           <p style={styles.detailValueMono}>
//                             {certificateData.id?.slice(-6) || "N/A"}
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
//                     {/* Footer (Unchanged) */}
//                      <div style={styles.footer}>
//                       <div style={styles.signaturesContainer}>
//                         <div style={styles.signatureBlock}>
//                           <p style={styles.signatureText}>
//                             {/* Authorized Signatory Placeholder */}
//                             Authorized Signatory
//                           </p>
//                           <div style={styles.signatureLine}></div>
//                           <p style={styles.signatureLabel}>
//                             Authorized Signature
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* --- Actions (Unchanged logic) --- */}
//               <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-5 border-t border-gray-200">
//                  <button
//                   onClick={() => {
//                     setCertificateData(null);
//                     formik.resetForm(); // Resets certificateNumber and userName
//                   }}
//                   className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
//                 >
//                   Validate Another
//                 </button>
//                 <button
//                   onClick={handleDownloadCertificate}
//                   disabled={isGenerating}
//                   className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
//                     isGenerating
//                       ? "bg-green-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500/30"
//                   }`}
//                 >
//                   {isGenerating ? (
//                     <>
//                       {/* Spinner SVG */}
//                       <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
//                       Generating...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-download mr-2"></i>Download Certificate
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificateValidationModal;


import React, { useState, useEffect } from "react"; // Import useEffect if not already there
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl"; // Assuming this path is correct

// --- SVG Checkmark Icon (Unchanged) ---
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
      fill="#2563EB"
    >
      <path d="M43.5 7.5c-.4 0-.8.2-1.1.5L17.9 32.5l-8.6-8.5c-.3-.3-.7-.5-1.1-.5s-.8.2-1.1.5l-3.6 3.6c-.3.3-.5.7-.5 1.1s.2.8.5 1.1l13.3 13.3c.3.3.7.5 1.1.5s.8-.2 1.1-.5l27.4-27.4c.3-.3.5-.7.5-1.1s-.2-.8-.5-1.1l-3.7-3.6c-.3-.2-.7-.4-1-.4z"/>
    </svg>
);
// --- End SVG ---


const CertificateValidationModal = ({ isOpen, onClose }) => {
  const [certificateData, setCertificateData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false); // State to control styles

  // --- Formik and Validation Schema (Unchanged) ---
  const validationSchema = Yup.object({
    certificateNumber: Yup.string()
      .matches(/^[0-9]+$/, "Certificate code must contain only numbers")
      .required("Certificate code is required"),
    userName: Yup.string()
      .required("User name is required")
      .min(3, "User name must be at least 3 characters"),
  });

  const formik = useFormik({
    initialValues: { certificateNumber: "", userName: "" },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      setCertificateData(null);
      try {
        const response = await axios.get(
          `${BASE_API_URL}/admin/events/certificates/validate`,
          {
            params: {
              certificateId: values.certificateNumber,
              userName: values.userName,
            },
          }
        );
        if (response.data.success && response.data.certificate) {
          const cert = response.data.certificate;
          const displayData = {
            id: cert.id,
            userName: cert.userName || values.userName,
            eventName: cert.eventName || "Sample Event Name",
            registrationDate: cert.registrationDate || new Date().toISOString(),
            eventDates: {
              start: cert.eventStartDate || cert.eventDates?.start || new Date().toISOString(),
              end: cert.eventEndDate || cert.eventDates?.end || new Date().toISOString(),
            },
            eventDescription: cert.eventDescription || "Successfully completed the required event participation.",
          };
          setCertificateData(displayData);
          toast.success("Certificate validated successfully!");
        } else {
          toast.error(
            response.data.message || "Certificate validation failed."
          );
          setCertificateData(null);
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Error validating certificate. Please check details or try again.";
        toast.error(errorMsg);
        console.error("Certificate validation error:", error.response?.data || error.message);
        setCertificateData(null);
      } finally {
        setSubmitting(false);
      }
    },
  });
  // --- End Formik and Validation ---

  // --- Function to handle certificate download (UPDATED with delay) ---
  const handleDownloadCertificate = async () => {
    const certificateElement = document.getElementById("certificate-preview");
    if (!certificateElement || !certificateData) {
        toast.error(!certificateElement ? "Preview element not found." : "No certificate data.");
        console.error('PDF generation prerequisite missing:', !certificateElement ? 'Element ID "certificate-preview"' : 'certificateData');
        return;
    }

    // 1. Set state to indicate PDF generation is starting (triggers style change)
    setIsGenerating(true);
    toast.loading("Generating PDF...", { id: "pdf-generating" });

    try {
      // 2. Wait briefly for React to re-render with the new state/style
      //    50ms is usually enough, adjust if needed.
      await new Promise(resolve => setTimeout(resolve, 50));

      // 3. Now capture the canvas, it should have the PDF-specific style
      const canvas = await html2canvas(certificateElement, {
        scale: 2.5,
        useCORS: true,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        backgroundColor: '#ffffff',
        logging: false,
        width: certificateElement.offsetWidth,
        height: certificateElement.offsetHeight,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "pt",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      const userNameSafe = certificateData.userName?.replace(/[^a-zA-Z0-9]/g, "_") || "user";
      const filename = `${userNameSafe}_certificate_CERT-${certificateData.id || 'validated'}.pdf`;
      pdf.save(filename);

      toast.dismiss("pdf-generating");
      toast.success("Certificate downloaded successfully!");

    } catch (error) {
      toast.dismiss("pdf-generating");
      toast.error("Failed to generate certificate PDF.");
      console.error("Certificate generation error:", error);
       if (error.message && error.message.toLowerCase().includes("color function")) {
        toast.error("Error: Problem rendering CSS colors. Ensure only standard colors (#hex, rgb) are used.", { duration: 8000 });
      } else if (error.message && error.message.toLowerCase().includes("tainted")) {
         toast.error("Error: Image loading issue (CORS or Taint). Check image source and server headers.", { duration: 8000 });
      }
    } finally {
       // 4. IMPORTANT: Reset state AFTER PDF generation (or error)
       //    This reverts the style back to the preview mode.
      setIsGenerating(false);
    }
  };
  // --- End Download Function ---

  // --- Helper Functions (Unchanged) ---
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", dateString, e);
      return "Invalid Date";
    }
  };
  const formatDateRange = (startDateString, endDateString) => {
    const start = formatDate(startDateString);
    const end = formatDate(endDateString);
    if ((start === "N/A" || start === "Invalid Date") && (end === "N/A" || end === "Invalid Date")) return "N/A";
    if (start === "N/A" || start === "Invalid Date") return end;
    if (end === "N/A" || end === "Invalid Date") return start;
    if (start === end) return start;
    return `${start} - ${end}`;
  };
  // --- End Helper Functions ---

  // --- Render Logic ---
  if (!isOpen) return null;

  // --- Define Styles (UPDATED logoCell with conditional paddingTop) ---
  // Styles are now defined INSIDE the component render function
  // so they can access the `isGenerating` state.
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
    // *** Conditional Style Applied Here ***
    logoCell: {
        display: 'table-cell',
        verticalAlign: 'middle',
        paddingRight: '15px',
        // Apply 10px padding only when generating PDF, otherwise use 0px (or adjust preview value)
        paddingTop: isGenerating ? '13px' : '0px', // <--- CONDITIONAL VALUE
    },
    logoImage: {
        height: '45px',
        width: 'auto',
        borderRadius: '50%',
        backgroundColor: 'white',
        padding: '2px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        border: '1px solid #E5E7EB',
        display: 'block',
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
    // --- End of Header Specific Styles ---
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
    signatureText: { fontFamily: '"Brush Script MT", "Brush Script Std", cursive', fontSize: "24px", color: "#374151", margin: "0 0 5px 0", lineHeight: '1', minHeight: '30px' },
    signatureLine: { height: "1px", width: "200px", backgroundColor: "#9CA3AF", margin: "0 auto 6px auto" },
    signatureLabel: { fontSize: "10px", color: "#6B7280" },
  };
  // --- End Styles Definition ---

  return (
    // Modal Wrapper (Unchanged)
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Background overlay (Unchanged) */}
      <div
        className="fixed inset-0 bg-gray-900 opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal container (Unchanged) */}
      <div className="relative w-full max-w-4xl sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
        {/* Modal header (Unchanged structure) */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
           {/* ... header content unchanged ... */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-certificate text-white text-xl"></i>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                Validate Certificate
                </h2>
            </div>
            <button
                onClick={() => {
                onClose();
                formik.resetForm();
                setCertificateData(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                aria-label="Close modal"
            >
                <i className="fas fa-times text-lg"></i>
            </button>
        </div>

        {/* Modal body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {!certificateData ? (
            // --- Validation Form (Unchanged Structure) ---
            <form onSubmit={formik.handleSubmit} className="space-y-5">
               {/* ... form fields unchanged ... */}
                <div className="space-y-4">
                {/* --- Certificate ID Input with Prefix --- */}
                <div>
                    <label
                    htmlFor="certificateNumber"
                    className="block text-sm font-medium text-gray-700 mb-1"
                    >
                    Certificate Code
                    </label>
                    <div className={`flex items-center border rounded-lg overflow-hidden transition-all duration-200 ${
                        formik.touched.certificateNumber && formik.errors.certificateNumber
                        ? "border-red-500"
                        : "border-gray-300 focus-within:border-lightBlue-600 focus-within:ring-2 focus-within:ring-lightBlue-600/20"
                    } `}>
                    <span className="px-3 py-2.5 text-gray-500 bg-gray-100 border-r border-gray-300 font-medium">
                        CERT-
                    </span>
                    <input
                        id="certificateNumber"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        name="certificateNumber"
                        value={formik.values.certificateNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`w-full px-4 py-2.5 border-0 bg-white text-gray-900 focus:outline-none focus:ring-0`}
                        placeholder="Enter numeric code"
                        aria-describedby="certificateNumber-error"
                    />
                    </div>
                    {formik.touched.certificateNumber && formik.errors.certificateNumber ? (
                    <div
                        id="certificateNumber-error"
                        className="text-red-600 text-xs mt-1"
                    >
                        {formik.errors.certificateNumber}
                    </div>
                    ) : null}
                </div>
                {/* --- End Certificate ID Input --- */}

                {/* --- User Name Input (Unchanged) --- */}
                <div>
                    <label
                    htmlFor="userName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                    >
                    User Name
                    </label>
                    <input
                    id="userName"
                    type="text"
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-4 py-2.5 !rounded-lg border ${
                        formik.touched.userName && formik.errors.userName
                        ? "border-red-500"
                        : "border-gray-300"
                    } w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200`}
                    placeholder="Enter user name as registered"
                    aria-describedby="userName-error"
                    />
                    {formik.touched.userName && formik.errors.userName ? (
                    <div
                        id="userName-error"
                        className="text-red-600 text-xs mt-1"
                    >
                        {formik.errors.userName}
                    </div>
                    ) : null}
                </div>
                </div>
                {/* --- Form Actions (Unchanged) --- */}
                <div className="flex justify-end items-center space-x-3 pt-5 border-t border-gray-200">
                <button
                    type="button"
                    onClick={() => {
                    onClose();
                    formik.resetForm();
                    setCertificateData(null);
                    }}
                    className="px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={formik.isSubmitting}
                    className={`px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                    formik.isSubmitting
                        ? "bg-lightBlue-400 cursor-not-allowed"
                        : "bg-lightBlue-600 hover:bg-lightBlue-700 focus:ring-2 focus:ring-lightBlue-600/30"
                    }`}
                >
                    {formik.isSubmitting ? (
                    <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Validating...
                    </>
                    ) : (
                    "Validate Certificate"
                    )}
                </button>
                </div>
            </form>
          ) : (
            // --- Certificate Display and Download ---
            <div className="space-y-6">
              {/* Certificate Preview Wrapper */}
              <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center bg-gray-50">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">
                  Certificate Preview
                </h3>
                <div className="w-full max-w-3xl overflow-hidden shadow-md">
                  {/* This is the element that will be captured */}
                  {/* Styles object is now generated based on isGenerating state */}
                  <div id="certificate-preview" style={styles.outerBorder}>
                    {/* Header uses styles object */}
                    <div style={styles.header}>
                       {/* Table container */}
                        <div style={styles.headerContentContainer}>
                            {/* Logo cell uses conditional style */}
                            <div style={styles.logoCell}>
                                <img
                                    src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
                                    alt="PGR Logo"
                                    style={styles.logoImage}
                                />
                            </div>
                            {/* Text cell */}
                            <div style={styles.textCell}>
                                <div style={styles.headerTextGroup}>
                                    <p style={styles.companyNameText}>
                                        Praedico Global Research
                                    </p>
                                    <p style={styles.platformNameText}>
                                        Virtual Trading Platform
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Titles */}
                        <p style={styles.mainTitle}>
                            Certificate of Completion
                        </p>
                        <p style={styles.subTitle}>
                            This certificate is proudly presented to
                        </p>
                    </div>

                    {/* Body (Unchanged Structure, uses styles object) */}
                    <div style={styles.bodyContainer}>
                       {/* Left column */}
                       <div style={styles.leftColumn}>
                         {/* ... content ... */}
                         <p style={styles.recipientName}>
                          {certificateData.userName || "Recipient Name"}
                         </p>
                         <p style={styles.completionText}>
                           has successfully completed the{" "}
                           <span style={{ fontWeight: "600", color: '#1E40AF' }}>
                             {certificateData.eventName || "Event Name"}
                           </span>{" "}
                           on {formatDate(certificateData.eventDates?.end)}.
                         </p>
                         <p style={styles.eventDescription}>
                           {certificateData.eventDescription || "Default description of event completion."}
                         </p>
                         <div style={styles.detailsSection}>
                           <div style={styles.detailItem}>
                             <span style={styles.detailLabel}>
                               Certificate ID
                             </span>
                             <p style={styles.detailValueMono}>
                               CERT-{certificateData.id || "N/A"}
                             </p>
                           </div>
                           <div
                             style={{ ...styles.detailItem, textAlign: "right" }}
                           >
                             <span style={styles.detailLabel}>Event Dates</span>
                             <p style={styles.detailValue}>
                               {formatDateRange(
                                 certificateData.eventDates?.start,
                                 certificateData.eventDates?.end
                               )}
                             </p>
                           </div>
                         </div>
                       </div>
                       {/* Right column */}
                       <div style={styles.rightColumn}>
                         {/* ... content ... */}
                         <div style={styles.verificationItem}>
                           <span style={styles.detailLabel}>Issued On</span>
                           <p style={styles.detailValue}>
                             {formatDate(certificateData.eventDates?.end)}
                           </p>
                         </div>
                         <div style={styles.verificationItem}>
                           <span style={styles.detailLabel}>
                             Verification Code
                           </span>
                           <p style={styles.detailValueMono}>
                             {String(certificateData.id || '').slice(-6) || "N/A"}
                           </p>
                         </div>
                         <div style={styles.verificationItem}>
                           <div style={styles.verificationCheckmarkWrapper}>
                             <CheckmarkIcon />
                           </div>
                           <p style={styles.verifiedText}>
                             Verified Certificate
                           </p>
                         </div>
                       </div>
                    </div>
                    {/* Footer (Unchanged Structure, uses styles object) */}
                     <div style={styles.footer}>
                       {/* ... content ... */}
                       <div style={styles.signaturesContainer}>
                         <div style={styles.signatureBlock}>
                           <p style={styles.signatureText}>
                             Authorized Signatory
                           </p>
                           <div style={styles.signatureLine}></div>
                           <p style={styles.signatureLabel}>
                             Authorized Signature
                           </p>
                         </div>
                       </div>
                     </div>
                  </div> {/* End #certificate-preview */}
                </div>
              </div>

              {/* --- Actions (Unchanged logic) --- */}
              <div className="flex flex-col sm:flex-row justify-end items-center space-y-2 sm:space-y-0 sm:space-x-3 pt-5 border-t border-gray-200">
                 <button
                  onClick={() => {
                    setCertificateData(null);
                    formik.resetForm();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  Validate Another
                </button>
                <button
                  onClick={handleDownloadCertificate}
                  disabled={isGenerating} // Button disabled using the same state
                  className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center ${
                    isGenerating
                      ? "bg-green-400 cursor-not-allowed" // Style changes based on state
                      : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-green-500/30"
                  }`}
                >
                  {isGenerating ? (
                    <>
                      {/* Spinner SVG */}
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle> <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download mr-2"></i>Download Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateValidationModal;