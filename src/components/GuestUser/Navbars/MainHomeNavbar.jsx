import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutOrganization } from "../../../redux/Organization/auth/organizationAuthSlice";
import { 
  LogIn, ChevronDown, Menu, X, Award, Home, Info, Phone, 
  DollarSign, Image, Calendar, BarChart2, Layers 
} from "lucide-react";
import BookDemoBGModal from "../BookDemo/BookDemoBGModal";
import UnifiedLoginModal from "../../../views/auth/UnifiedLoginModal";
import UnifiedRegisterModal from "../../../views/auth/UnifiedRegistrationModal";
import CertificateValidationModal from "../../User/Modals/CertificateValidationModal";
import { FaWhatsapp } from "react-icons/fa";
import { logout as logoutUser, selectCurrentUser } from "../../../redux/User/authSlice"
import toast from "react-hot-toast";

const MobileMenu = ({
  // isOpen,
  // isAuthenticated,
  // orgName,
  // handleNavigation,
  // handleOpenLogin,
  // handleOpenRegister,
  // openCertificateModal,
  // isActive,
  // isActivePrefix,
  // toggleMenu,
  // openBookDemoModal

  isOpen,
  // Receive both Org and User states
  isAuthenticated,
  orgName,
  isUserAuthenticated,
  userName,
  userRole,
  // Receive handlers
  handleNavigation,
  handleOpenLogin,
  handleOpenRegister,
  openCertificateModal,
  isActive,
  isActivePrefix,
  toggleMenu,
  openBookDemoModal,
  handleLogout 
}) => {
  const navItems = [
    { path: "/", name: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/about", name: "About", icon: <Info className="h-5 w-5" /> },
    { path: "/contact", name: "Contact", icon: <Phone className="h-5 w-5" /> },
    { path: "/services", name: "Services", icon: <Layers className="h-5 w-5" /> },
    { path: "/nifty50", name: "Nifty50 Data", icon: <BarChart2 className="h-5 w-5" /> },
    { path: "/etf", name: "ETF Data", icon: <BarChart2 className="h-5 w-5" /> },
    { path: "/nifty500", name: "Nifty500 Data", icon: <BarChart2 className="h-5 w-5" /> },
    { path: "/pricing", name: "Pricing", icon: <DollarSign className="h-5 w-5" /> },
    { path: "/gallery", name: "Gallery", icon: <Image className="h-5 w-5" /> },
    { path: "/event", name: "Events", icon: <Calendar className="h-5 w-5" /> },
  ];

  return (
    <div 
      className={`fixed inset-0 z-30 bg-white transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden`}
      style={{ top: "64px" }}
    >
      <div className="container mx-auto py-4 h-full overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="space-y-1 flex-grow">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  handleNavigation(item.path);
                  toggleMenu();
                }}
                className={`flex items-center w-full py-3 rounded-lg text-left text-base font-medium transition-colors ${
                  isActive(item.path) || isActivePrefix(item.path)
                    ? "bg-blue-50 text-lightBlue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className={`mr-3 ${
                  isActive(item.path) || isActivePrefix(item.path) 
                    ? "text-lightBlue-600" 
                    : "text-gray-500"
                }`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
            
            {/* Certificate Validation Button */}
            <button
              onClick={() => {
                openCertificateModal();
                toggleMenu();
              }}
              className="flex items-center w-full ml-2 px-4 py-3 rounded-lg text-left text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="mr-3 text-yellow-500">
                <Award className="h-5 w-5" />
              </span>
              Certificate
            </button>

            {/* Book Demo Button */}
            <button
              onClick={() => {
                openBookDemoModal();
                toggleMenu();
              }}
              className="flex items-center w-full px-4 py-3 rounded-lg text-left text-base font-medium text-white bg-purple-600 hover:bg-purple-700 mt-2"
            >
              Book A Demo
            </button>
          </div>


{/* working  */}
          {/* Authentication/Profile Section */}
          {/* <div className="mt-auto pt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    handleNavigation("/organization");
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-lightBlue-600 hover:bg-blue-700"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {orgName}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleOpenLogin();
                    toggleMenu();
                  }}
                  className="w-full flex -mt-4 items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-lightBlue-600 hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleOpenRegister();
                    toggleMenu();
                  }}
                  className="w-full flex  items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            )}
          </div> */}

<div className="mt-auto pt-4 border-t border-gray-100">
            {isAuthenticated || isUserAuthenticated ? (
              // If EITHER Org or User is logged in
              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Navigate to correct dashboard
                    if (isAuthenticated) {
                        handleNavigation("/organization");
                    } else if (isUserAuthenticated) {
                        handleNavigation(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'); // Adjust paths if needed
                    }
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-lightBlue-600 hover:bg-blue-700"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  {isAuthenticated ? orgName : userName} {/* Show correct name */}
                </button>
                {/* <button
                   onClick={() => {
                      handleLogout(); 
                      toggleMenu(); 
                   }}
                   className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100"
                >
                  <LogIn className="mr-2 h-5 w-5 transform rotate-180" />
                   Logout
                </button> */}
              </div>
            ) : (
              // If NO ONE is logged in
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleOpenLogin();
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-lightBlue-600 hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    handleOpenRegister();
                    toggleMenu();
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MainHomeNavbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBookDemoBGModal, setIsBookDemoBGModal] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [stockDataOpen, setStockDataOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { orgName } = useSelector((state) => state.organization.auth);
  const isAuthenticated = !!orgName;

  const currentUser = useSelector(selectCurrentUser);
  const isUserAuthenticated = !!currentUser; // Check if currentUser object exists
  const userName = currentUser?.name; // Get user name if available
  const userRole = currentUser?.role; // Get u

  const navItems = [
    { path: "/", name: "Home" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/services", name: "Services" },
    { path: "/pricing", name: "Pricing" },
    { path: "/gallery", name: "Gallery" },
    { path: "/event", name: "Events" },
  ];

  // Create a ref for the stock data dropdown
  const stockDataRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add click outside handler for stock data dropdown
    const handleClickOutside = (event) => {
      if (stockDataRef.current && !stockDataRef.current.contains(event.target)) {
        setStockDataOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [scrolled]);

  // const handleLogout = () => {
  //   dispatch(logoutOrganization());
  //   navigate("/");
  // };

  // Inside MainHomeNavbar component:

const handleLogout = () => {
  if (isAuthenticated) {
    dispatch(logoutOrganization());
  } else if (isUserAuthenticated) {
    dispatch(logoutUser()); // Dispatch the user logout action
  }
  // Navigate home after any logout
  toast.success("logout successfully");

  navigate("/");
  setNavbarOpen(false); // Close mobile menu if open
  setStockDataOpen(false); // Close dropdown if open
};

  const handleNavigation = (path) => {
    setNavbarOpen(false);
    navigate(path);
  };

  const handleOpenRegister = () => {
    setNavbarOpen(false);
    setIsRegisterModalOpen(true);
  };

  const handleOpenLogin = () => {
    setNavbarOpen(false);
    setIsLoginModalOpen(true);
  };

  const openCertificateModal = () => {
    setNavbarOpen(false);
    setIsCertificateModalOpen(true);
  };

  const openBookDemoModal = () => {
    setNavbarOpen(false);
    setIsBookDemoBGModal(true);
  };

  const closeCertificateModal = () => setIsCertificateModalOpen(false);
  const toggleMenu = () => {
    setNavbarOpen(!navbarOpen);
  };

  const toggleStockData = () => {
    setStockDataOpen(!stockDataOpen);
  };

  const isActive = (path) => location.pathname === path;
  const isActivePrefix = (prefix) => location.pathname.startsWith(prefix);

  return (
    <>
      <nav className={`fixed top-0 z-30 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white shadow-sm"
      }`}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div
                className="flex-shrink-0 mr-12 flex items-center cursor-pointer"
                onClick={() => handleNavigation("/")}
              >
                <img
                  src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
                  alt="PGR Logo"
                  className="h-10 w-auto"
                />
                <span className="ml-3 text-lg font-bold text-gray-900 hidden sm:block whitespace-nowrap">
                  PGR - Virtual Trading App
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Navigation Links */}
              <div className="flex -mr-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                      isActive(item.path)
                        ? "text-lightBlue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-lightBlue-600"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}

                {/* Stock Data Dropdown */}
                <div className="relative" ref={stockDataRef}>
                  <button
                    onClick={toggleStockData}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center whitespace-nowrap transition-colors ${
                      isActivePrefix("/nifty50") || isActivePrefix("/etf") || isActivePrefix("/nifty500")
                        ? "text-lightBlue-600 bg-blue-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-lightBlue-600"
                    }`}
                  >
                    Stock Data
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      stockDataOpen ? "rotate-180" : ""
                    }`} />
                  </button>
                  {stockDataOpen && (
                    <div 
                      className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleNavigation("/nifty50");
                            setStockDataOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActivePrefix("/nifty50")
                              ? "bg-blue-50 text-lightBlue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Nifty50 Data
                        </button>
                        <button
                          onClick={() => {
                            handleNavigation("/etf");
                            setStockDataOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActivePrefix("/etf")
                              ? "bg-blue-50 text-lightBlue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          ETF Data
                        </button>
                        <button
                          onClick={() => {
                            handleNavigation("/nifty500");
                            setStockDataOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActivePrefix("/nifty500")
                              ? "bg-blue-50 text-lightBlue-600 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          Nifty500 Data
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* nav items end */}

              {/* Action Buttons */}
              <div className="flex items-center ml-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openCertificateModal}
                    className="inline-flex mr-2 items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-gray-700 bg-yellow-50 hover:bg-yellow-100 whitespace-nowrap transition-colors"
                    title="Validate Certificate"
                  >
                    <Award className="mr-1.5 h-4 w-4 text-yellow-500" />
                    Certificate
                  </button>

                  <button
                    onClick={openBookDemoModal}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 whitespace-nowrap transition-colors"
                  >
                    Book Demo
                  </button>
                </div>

                {/* working */}

                {/* {isAuthenticated ? (
                  <button
                    onClick={() => navigate("/organization")}
                    className="inline-flex items-center px-4 py-2 mx-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lightBlue-600 hover:bg-blue-700 whitespace-nowrap transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    {orgName}
                  </button>
                ) : (
                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={handleOpenLogin}
                      className="inline-flex mr-2 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lightBlue-600 hover:bg-blue-700 whitespace-nowrap transition-colors"
                    >
                      Login/Register
                    </button>
                  </div>
                )} */}

                
   {/* --- UPDATED Login/Profile/Logout Section --- */}
   {isAuthenticated || isUserAuthenticated ? (
     // Show Profile Button and Logout Button if EITHER Org or User is logged in
     <div className="flex items-center ml-2">
       <button
         onClick={() => {
           // Navigate to the correct dashboard based on who is logged in
           if (isAuthenticated) {
             navigate("/organization");
           } else if (isUserAuthenticated) {
             navigate(userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard'); // Adjust paths if needed
           }
         }}
         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lightBlue-600 hover:bg-blue-700 whitespace-nowrap transition-colors"
       >
         <LogIn className="mr-1.5 h-4 w-4" />
         {isAuthenticated ? orgName : userName} {/* Show Org name or User name */}
       </button>
       {/* <button
          onClick={handleLogout}
          className="ml-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Logout"
       >
         <span className="sr-only">Logout</span>
          <LogIn className="h-4 w-4 transform rotate-180" /> 
       </button> */}
     </div>
   ) : (
     // Show Login/Register button if NO ONE is logged in
     <div className="flex items-center space-x-2 ml-2">
       <button
         onClick={handleOpenLogin}
         className="inline-flex mr-2 items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-lightBlue-600 hover:bg-blue-700 whitespace-nowrap transition-colors"
       >
         Login/Register
       </button>
     </div>
   )}
   {/* --- END UPDATED Section --- */}


                <a
                  href="https://chat.whatsapp.com/GCNCQb6Ul4l5FRwlT5y3Tb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 ml-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                  title="Join WhatsApp Group"
                >
                  <span className="sr-only">Join WhatsApp Group</span>
                  <FaWhatsapp className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <a
                href="https://chat.whatsapp.com/GCNCQb6Ul4l5FRwlT5y3Tb"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 mr-1 text-green-500 hover:bg-gray-100 rounded-full transition-colors"
                title="Join WhatsApp Group"
              >
                <span className="sr-only">Join WhatsApp Group</span>
                <FaWhatsapp className="w-5 h-5" />
              </a>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                aria-controls="mobile-menu"
                aria-expanded={navbarOpen}
              >
                <span className="sr-only">Open main menu</span>
                {navbarOpen ? (
                  <X className="block h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="block h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* <MobileMenu
          isOpen={navbarOpen}
          isAuthenticated={isAuthenticated}
          orgName={orgName}
          handleNavigation={handleNavigation}
          handleOpenLogin={handleOpenLogin}
          handleOpenRegister={handleOpenRegister}
          openCertificateModal={openCertificateModal}
          openBookDemoModal={openBookDemoModal}
          isActive={isActive}
          isActivePrefix={isActivePrefix}
          toggleMenu={toggleMenu}
        /> */}


<MobileMenu
  isOpen={navbarOpen}
  // Pass both Org and User states
  isAuthenticated={isAuthenticated}
  orgName={orgName}
  isUserAuthenticated={isUserAuthenticated}
  userName={userName}
  userRole={userRole}
  // Pass handlers
  handleNavigation={handleNavigation}
  handleOpenLogin={handleOpenLogin}
  handleOpenRegister={handleOpenRegister}
  openCertificateModal={openCertificateModal}
  openBookDemoModal={openBookDemoModal}
  handleLogout={handleLogout} // Pass the updated logout handler
  // Pass helpers
  isActive={isActive}
  isActivePrefix={isActivePrefix}
  toggleMenu={toggleMenu}
/>
      </nav>

      {/* Modals */}
      <UnifiedLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onOpenRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <UnifiedRegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onOpenLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      {isBookDemoBGModal && (
        <BookDemoBGModal closeModal={() => setIsBookDemoBGModal(false)} />
      )}

      <CertificateValidationModal
        isOpen={isCertificateModalOpen}
        onClose={closeCertificateModal}
      />
    </>
  );
};

export default MainHomeNavbar;



