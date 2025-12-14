// import React, { useState, useEffect } from "react";
// import { Link, useHistory } from "react-router-dom"; // Using useHistory for navigation
// import IndexDropdown from "../Dropdowns/IndexDropdown.jsx";

// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const history = useHistory(); // Replace useNavigate with useHistory

//   useEffect(() => {
//     // Check if user is logged in
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token); // Convert token existence to boolean
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // Remove token
//     setIsAuthenticated(false);
//     history.push("/auth/login"); // Redirect to login page
//   };

//   return (
//     <>
    
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <Link
//               to="/"
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </Link>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={
//               "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
//               (navbarOpen ? " block" : " hidden")
//             }
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               {/* Navigation Links */}
//               <li className="flex items-center">
//                 <Link
//                   to="/"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/about"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   About
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/contact"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Contact
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/services"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Services
//                 </Link>
//               </li>

//               {/* Conditional Rendering for Login, Register, and Logout */}
//               {isAuthenticated ? (
//                 <li className="flex items-center">
//                   {/* Profile Icon */}
//                   <Link to="/profile" className="text-gray-700 hover:text-blueGray-600 text-2xl mr-4">
//                     <i className="fas fa-user-circle"></i>
//                   </Link>

//                   {/* Added ml-4 for spacing between Profile Icon and Logout Button */}
//                   <button
//                     className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={handleLogout}
//                   >
//                     <i className="fas fa-sign-out-alt"></i> Logout
//                   </button>
//                 </li>
//               ) : (
//                 <>
//                   <li className="flex items-center">
//                     <Link
//                       to="/auth/login"
//                       className="bg-lightBlue-500 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow 
//                        hover:bg-blueGray-800 active:bg-blue-900 focus:bg-blue-900 
//                        hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     >
//                       <i className="fas fa-sign-in-alt"></i> Login
//                     </Link>
//                   </li>

//                   <li className="flex items-center">
//                     <Link
//                       to="/auth/register"
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Register
//                     </Link>
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>
//       </nav>
//     </>
//   );
// }


// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import Register from "../../../views/auth/Register"; // Import Register component
// import LoginModal from "../../../views/auth/Login"; // Import LoginModal component

// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isRegisterOpen, setIsRegisterOpen] = useState(false);
//   const [isLoginOpen, setIsLoginOpen] = useState(false); // Modal state for Login

//   return (
//     <>
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <Link
//               to="/"
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </Link>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//              <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none ${
//               navbarOpen ? "block" : "hidden"
//             }`}
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               <li className="flex items-center">
//                 <Link
//                   to="/"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/about"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   About
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/contact"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Contact
//                 </Link>
//               </li>
//               <li className="flex items-center">
//                 <Link
//                   to="/services"
//                   className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
//                 >
//                   Services
//                 </Link>
//               </li>

//               <li className="flex items-center">
//                 <button
//                   className="bg-lightBlue-500 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg"
//                   onClick={() => setIsLoginOpen(true)} // Open Login modal
//                 >
//                   <i className="fas fa-sign-in-alt"></i> Login
//                 </button>
//               </li>
//               <li className="flex items-center">
//                 <button
//                   className="bg-red-500 text-white text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg"
//                   onClick={() => setIsRegisterOpen(true)} // Open Register modal
//                 >
//                   <i className="fas fa-user-plus mr-1"></i> Register
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>

//       {/* Register Modal */}
//       {isRegisterOpen && (
//         <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
//       )}

//       {/* Login Modal */}
//       {isLoginOpen && (
//         <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
//       )}
//     </>
//   );
// }



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import IndexDropdown from "../Dropdowns/IndexDropdown.jsx";
// import OrganizationRegistration from "../../../views/Organization/auth/OrganizationRegistration.jsx";
// import OrganizationLogin from "../../../views/Organization/auth/OrganizationLogin.jsx";
// import LoginModal from "../../../views/auth/Login.jsx"; // Ensure this path is correct

// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);

//   const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false); // State for user login modal

//   const navigate = useNavigate();
//   const registerDropdownRef = useRef(null);
//   const loginDropdownRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         registerDropdownRef.current &&
//         !registerDropdownRef.current.contains(event.target)
//       ) {
//         setRegisterDropdownOpen(false);
//       }
//       if (
//         loginDropdownRef.current &&
//         !loginDropdownRef.current.contains(event.target)
//       ) {
//         setLoginDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/auth/login");
//   };

//   const handleNavigation = (path) => {
//     setNavbarOpen(false);
//     navigate(path);
//   };

//   const toggleRegisterDropdown = () => {
//     setRegisterDropdownOpen(!registerDropdownOpen);
//   };

//   const toggleLoginDropdown = () => {
//     setLoginDropdownOpen(!loginDropdownOpen);
//   };

//   return (
//     <>
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <div
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase cursor-pointer"
//               onClick={() => handleNavigation("/")}
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </div>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={
//               "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
//               (navbarOpen ? " block" : " hidden")
//             }
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/")}
//               >
//                 Home
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/about")}
//               >
//                 About
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/contact")}
//               >
//                 Contact
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/services")}
//               >
//                 Services
//               </li>
//               {isAuthenticated ? (
//                 <li className="flex items-center">
//                   <div
//                     className="text-gray-700 hover:text-blueGray-600 text-2xl mr-4 cursor-pointer"
//                     onClick={() => handleNavigation("/profile")}
//                   >
//                     <i className="fas fa-user-circle"></i>
//                   </div>
//                   <button
//                     className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={handleLogout}
//                   >
//                     <i className="fas fa-sign-out-alt"></i> Logout
//                   </button>
//                 </li>
//               ) : (
//                 <>
//                   <li className="relative flex items-center" ref={loginDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleLoginDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Login
//                     </button>
//                     {loginDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserLoginModalOpen(true)} // Open user login modal
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/login/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setIsModalLoginOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                   <li className="relative flex items-center" ref={registerDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleRegisterDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Register
//                     </button>
//                     {registerDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/user")}
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setModalOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>

//         <OrganizationRegistration
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />

//         <OrganizationLogin
//           isOpen={isModalLoginOpen}
//           onClose={() => setIsModalLoginOpen(false)}
//         />

//         <LoginModal
//           isOpen={isUserLoginModalOpen}
//           onClose={() => setUserLoginModalOpen(false)}
//         />
//       </nav>
//     </>
//   );
// }




// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import Register from "../../../views/auth/Register"; // Import Register component
// import LoginModal from "../../../views/auth/Login"; // Import LoginModal component

// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
//   const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false);

//   const navigate = useNavigate();
//   const registerDropdownRef = useRef(null);
//   const loginDropdownRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         registerDropdownRef.current &&
//         !registerDropdownRef.current.contains(event.target)
//       ) {
//         setRegisterDropdownOpen(false);
//       }
//       if (
//         loginDropdownRef.current &&
//         !loginDropdownRef.current.contains(event.target)
//       ) {
//         setLoginDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/auth/login");
//   };

//   const handleNavigation = (path) => {
//     setNavbarOpen(false);
//     navigate(path);
//   };

//   const toggleRegisterDropdown = () => {
//     setRegisterDropdownOpen(!registerDropdownOpen);
//   };

//   const toggleLoginDropdown = () => {
//     setLoginDropdownOpen(!loginDropdownOpen);
//   };

//   return (
//     <>
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <div
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase cursor-pointer"
//               onClick={() => handleNavigation("/")}
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </div>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none ${
//               navbarOpen ? "block" : "hidden"
//             }`}
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/")}
//               >
//                 Home
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/about")}
//               >
//                 About
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/contact")}
//               >
//                 Contact
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/services")}
//               >
//                 Services
//               </li>
//               {isAuthenticated ? (
//                 <li className="flex items-center">
//                   <div
//                     className="text-gray-700 hover:text-blueGray-600 text-2xl mr-4 cursor-pointer"
//                     onClick={() => handleNavigation("/profile")}
//                   >
//                     <i className="fas fa-user-circle"></i>
//                   </div>
//                   <button
//                     className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={handleLogout}
//                   >
//                     <i className="fas fa-sign-out-alt"></i> Logout
//                   </button>
//                 </li>
//               ) : (
//                 <>
//                   <li className="relative flex items-center" ref={loginDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleLoginDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Login
//                     </button>
//                     {loginDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserLoginModalOpen(true)}
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/login/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setIsModalLoginOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                   <li className="relative flex items-center" ref={registerDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleRegisterDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Register
//                     </button>
//                     {registerDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/user")}
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setModalOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>

//         <Register
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />

//         <LoginModal
//           isOpen={isModalLoginOpen}
//           onClose={() => setIsModalLoginOpen(false)}
//         />

//         <LoginModal
//           isOpen={isUserLoginModalOpen}
//           onClose={() => setUserLoginModalOpen(false)}
//         />
//       </nav>
//     </>
//   );
// }





// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import RegisterModal from "../../../views/auth/Register"; // Import Register component
// import LoginModal from "../../../views/auth/Login"; // Import LoginModal component
// import OrganizationRegistration from "../../../views/Organization/auth/OrganizationRegistration.jsx";
// import OrganizationLogin from "../../../views/Organization/auth/OrganizationLogin.jsx";
// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
//   const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false);
//   const [isUserRegisterModalOpen, setUserRegisterModalOpen] = useState(false); // State for user register modal

//   const navigate = useNavigate();
//   const registerDropdownRef = useRef(null);
//   const loginDropdownRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         registerDropdownRef.current &&
//         !registerDropdownRef.current.contains(event.target)
//       ) {
//         setRegisterDropdownOpen(false);
//       }
//       if (
//         loginDropdownRef.current &&
//         !loginDropdownRef.current.contains(event.target)
//       ) {
//         setLoginDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/auth/login");
//   };

//   const handleNavigation = (path) => {
//     setNavbarOpen(false);
//     navigate(path);
//   };

//   const toggleRegisterDropdown = () => {
//     setRegisterDropdownOpen(!registerDropdownOpen);
//   };

//   const toggleLoginDropdown = () => {
//     setLoginDropdownOpen(!loginDropdownOpen);
//   };

//   return (
//     <>
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <div
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase cursor-pointer"
//               onClick={() => handleNavigation("/")}
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </div>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none ${
//               navbarOpen ? "block" : "hidden"
//             }`}
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/")}
//               >
//                 Home
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/about")}
//               >
//                 About
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/contact")}
//               >
//                 Contact
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/services")}
//               >
//                 Services
//               </li>
//               {isAuthenticated ? (
//                 <li className="flex items-center">
//                   <div
//                     className="text-gray-700 hover:text-blueGray-600 text-2xl mr-4 cursor-pointer"
//                     onClick={() => handleNavigation("/profile")}
//                   >
//                     <i className="fas fa-user-circle"></i>
//                   </div>
//                   <button
//                     className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                     type="button"
//                     onClick={handleLogout}
//                   >
//                     <i className="fas fa-sign-out-alt"></i> Logout
//                   </button>
//                 </li>
//               ) : (
//                 <>
//                   <li className="relative flex items-center" ref={loginDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleLoginDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Login
//                     </button>
//                     {loginDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserLoginModalOpen(true)}
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/login/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setIsModalLoginOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                   <li className="relative flex items-center" ref={registerDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleRegisterDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Register
//                     </button>
//                     {registerDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserRegisterModalOpen(true)}
//                         >
//                           User
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/admin")}
//                         >
//                           Admin
//                         </li>
//                         <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setModalOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                 </>
//               )}
//             </ul>
//           </div>
//         </div>

//         <RegisterModal
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />

//         <LoginModal
//           isOpen={isModalLoginOpen}
//           onClose={() => setIsModalLoginOpen(false)}
//         />

//         {/* <LoginModal
//           isOpen={isUserLoginModalOpen}
//           onClose={() => setUserLoginModalOpen(false)}
//         />

//         <RegisterModal
//           isOpen={isUserRegisterModalOpen}
//           onClose={() => setUserRegisterModalOpen(false)}
//         /> */}

// <OrganizationRegistration
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />

//         <OrganizationLogin
//           isOpen={isModalLoginOpen}
//           onClose={() => setIsModalLoginOpen(false)}
//         />
//       </nav>
//     </>
//   );
// }




// current version
// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import RegisterModal from "../../../views/auth/Register"; // Import Register component
// import LoginModal from "../../../views/auth/Login"; // Import LoginModal component
// import OrganizationRegistration from "../../../views/Organization/auth/OrganizationRegistration.jsx";
// import OrganizationLogin from "../../../views/Organization/auth/OrganizationLogin.jsx";

// export default function Navbar() {
//   const [navbarOpen, setNavbarOpen] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
//   const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
//   const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false);
//   const [isUserRegisterModalOpen, setUserRegisterModalOpen] = useState(false); // State for user register modal

//   const navigate = useNavigate();
//   const registerDropdownRef = useRef(null);
//   const loginDropdownRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         registerDropdownRef.current &&
//         !registerDropdownRef.current.contains(event.target)
//       ) {
//         setRegisterDropdownOpen(false);
//       }
//       if (
//         loginDropdownRef.current &&
//         !loginDropdownRef.current.contains(event.target)
//       ) {
//         setLoginDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     navigate("/auth/login");
//   };

//   const handleNavigation = (path) => {
//     setNavbarOpen(false);
//     navigate(path);
//   };

//   const toggleRegisterDropdown = () => {
//     setRegisterDropdownOpen(!registerDropdownOpen);
//   };

//   const toggleLoginDropdown = () => {
//     setLoginDropdownOpen(!loginDropdownOpen);
//   };

//   return (
//     <>
//       <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
//         <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
//           <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
//             <div
//               className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase cursor-pointer"
//               onClick={() => handleNavigation("/")}
//             >
//               <i className="fas fa-briefcase mr-2 text-xl"></i>
//               StockSphere
//             </div>
//             <button
//               className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
//               type="button"
//               onClick={() => setNavbarOpen(!navbarOpen)}
//             >
//               <i className="fas fa-bars"></i>
//             </button>
//           </div>
//           <div
//             className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none ${
//               navbarOpen ? "block" : "hidden"
//             }`}
//             id="navbar-links"
//           >
//             <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/")}
//               >
//                 Home
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/about")}
//               >
//                 About
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/contact")}
//               >
//                 Contact
//               </li>
//               <li
//                 className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
//                 onClick={() => handleNavigation("/services")}
//               >
//                 Services
//               </li>
              
//                 <>
//                   <li className="relative flex items-center" ref={loginDropdownRef}>
//                     <button
//                       className="bg-lightBlue-500 text-white active:bg-blue-950 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-blue-950 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleLoginDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Login
//                     </button>
//                     {loginDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserLoginModalOpen(true)}
//                         >
//                           User
//                         </li>
//                         {/* <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/login/admin")}
//                         >
//                           Admin
//                         </li> */}
//                         <li
//                           className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setIsModalLoginOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                   <li className="relative flex items-center" ref={registerDropdownRef}>
//                     <button
//                       className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
//                       type="button"
//                       onClick={toggleRegisterDropdown}
//                     >
//                       <i className="fas fa-user-plus mr-1"></i> Register
//                     </button>
//                     {registerDropdownOpen && (
//                       <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
//                         <li
//                           className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setUserRegisterModalOpen(true)}
//                         >
//                           User
//                         </li>
//                         {/* <li
//                           className="block px-4 py-2 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => handleNavigation("/auth/register/admin")}
//                         >
//                           Admin
//                         </li> */}
//                         <li
//                           className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => setModalOpen(true)}
//                         >
//                           Organization
//                         </li>
//                       </div>
//                     )}
//                   </li>
//                 </>
             
//             </ul>
//           </div>
//         </div>

//         <OrganizationRegistration
//           isOpen={isModalOpen}
//           onClose={() => setModalOpen(false)}
//         />

//         <OrganizationLogin
//           isOpen={isModalLoginOpen}
//           onClose={() => setIsModalLoginOpen(false)}
//         />

//         <LoginModal
//           isOpen={isUserLoginModalOpen}
//           onClose={() => setUserLoginModalOpen(false)}
//         />

//         <RegisterModal
//           isOpen={isUserRegisterModalOpen}
//           onClose={() => setUserRegisterModalOpen(false)}
//         />
//       </nav>
//     </>
//   );
// }











// redux toolkit version:

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import RegisterModal from "../../../views/auth/Register"; // Import Register component
import LoginModal from "../../../views/auth/Login"; // Import LoginModal component
import OrganizationRegistration from "../../../views/Organization/OrganizationDetails/Models/OrganizationRegistration";
import OrganizationLogin from "../../../views/Organization/OrganizationDetails/Models/OrganizationLogin";
import toast from "react-hot-toast";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false);
  const [isUserRegisterModalOpen, setUserRegisterModalOpen] = useState(false); // State for user register modal

  const navigate = useNavigate();
  const registerDropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  // Check if organization is logged in
  const orgName = localStorage.getItem("orgName");
  const isOrgLoggedIn = !!orgName;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        registerDropdownRef.current &&
        !registerDropdownRef.current.contains(event.target)
      ) {
        setRegisterDropdownOpen(false);
      }
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      ) {
        setLoginDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("orgName"); // Clear orgName on logout
    setIsAuthenticated(false);
    toast.success("logout successful");
    navigate("/");
  };

  const handleNavigation = (path) => {
    setNavbarOpen(false);
    navigate(path);
  };

  const toggleRegisterDropdown = () => {
    setRegisterDropdownOpen(!registerDropdownOpen);
  };

  const toggleLoginDropdown = () => {
    setLoginDropdownOpen(!loginDropdownOpen);
  };

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-4 py-3 navbar-expand-lg shadow-lg bg-white">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <div
              className="text-black text-lg font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              <i className="fas fa-briefcase mr-2 text-xl"></i>
              {/* StockSphere */}
              PGR VIRTUAL TRADING APP
            </div>
            <button
              className="cursor-pointer text-white text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={`lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none ${
              navbarOpen ? "block" : "hidden"
            }`}
            id="navbar-links"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto space-x-6">
              <li
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
                onClick={() => handleNavigation("/")}
              >
                Home
              </li>
              <li
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
                onClick={() => handleNavigation("/about")}
              >
                About
              </li>
              <li
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
                onClick={() => handleNavigation("/contact")}
              >
                Contact
              </li>
              <li
                className="hover:text-blueGray-500 text-blueGray-700 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold cursor-pointer"
                onClick={() => handleNavigation("/services")}
              >
                Services
              </li>

              {/* Conditional Rendering Based on Organization Login State */}
              {isOrgLoggedIn ? (
                // Show Logout Button if Organization is Logged In
                // <li className="flex items-center">
                //   <button
                //     className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-red-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                //     type="button"
                //     onClick={handleLogout}
                //   >
                //     <i className="fas fa-sign-out-alt mr-1"></i> Logout
                //   </button>
                // </li>

                <li className="flex items-center">
                <button
                  className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-red-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => navigate( isOrgLoggedIn ? "/organization" : "/")}
                
                >
                  <i className="fas fa-sign-out-alt mr-1"></i> {orgName}
                </button>
              </li>

                
              ) : (
                // Show Login and Register Dropdowns if Organization is Not Logged In
                <>
                  <li className="relative flex items-center" ref={loginDropdownRef}>
                    <button
                      className="bg-lightBlue-500 text-white active:bg-blue-950 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-blue-950 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                      onClick={toggleLoginDropdown}
                    >
                      <i className="fas fa-user-plus mr-1"></i> Login
                    </button>
                    {loginDropdownOpen && (
                      <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
                        <li
                          className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setUserLoginModalOpen(true)}
                        >
                          User
                        </li>
                        <li
                          className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setIsModalLoginOpen(true)}
                        >
                          Organization
                        </li>
                      </div>
                    )}
                  </li>
                  <li className="relative flex items-center" ref={registerDropdownRef}>
                    <button
                      className="bg-red-500 text-white active:bg-green-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:bg-green-700 hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
                      type="button"
                      onClick={toggleRegisterDropdown}
                    >
                      <i className="fas fa-user-plus mr-1"></i> Register
                    </button>
                    {registerDropdownOpen && (
                      <div className="absolute right-0 mt-16 w-48 bg-white border rounded shadow-lg z-50">
                        <li
                          className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setUserRegisterModalOpen(true)}
                        >
                          User
                        </li>
                        <li
                          className="block px-4 py-4 text-gray-800 hover:bg-gray-200 cursor-pointer"
                          onClick={() => setModalOpen(true)}
                        >
                          Organization
                        </li>
                      </div>
                    )}
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Modals */}
        <OrganizationRegistration
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
        />

        <OrganizationLogin
          isOpen={isModalLoginOpen}
          onClose={() => setIsModalLoginOpen(false)}
        />

        <LoginModal
          isOpen={isUserLoginModalOpen}
          onClose={() => setUserLoginModalOpen(false)}
        />

        <RegisterModal
          isOpen={isUserRegisterModalOpen}
          onClose={() => setUserRegisterModalOpen(false)}
        />
      </nav>
    </>
  );
}


