import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { BASE_API_URL } from '../../../../utils/BaseUrl'; // Ensure path is correct
import { motion, AnimatePresence } from 'framer-motion';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaRegSadTear, FaSpinner } from "react-icons/fa";
import { FiExternalLink, FiInfo } from "react-icons/fi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ShowAllClientsModal from './ShowAllOrganizationsModal'; // Ensure path is correct

// --- Custom Arrow Component ---
const CustomArrow = ({ direction, onClick, disabled }) => (
<button
    onClick={onClick}
    disabled={disabled}
    // Using absolute positioning relative to the 'group' container
    className={`absolute top-1/2 transform -translate-y-1/2 z-30 p-2.5 rounded-full shadow-md transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 hover:opacity-100
        ${direction === 'prev' ? 'left-[-15px] md:left-[-25px]' : 'right-[-15px] md:right-[-25px]'}
        ${disabled
            ? 'bg-gray-200 cursor-not-allowed text-gray-400 opacity-40'
            : 'bg-white/80 backdrop-blur-sm hover:bg-white text-lightBlue-600 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400'
        }`}
    aria-label={direction === 'prev' ? "Previous Organizations" : "Next Organizations"}
>
    {direction === 'prev' ? <BiChevronLeft className="text-xl md:text-2xl" /> : <BiChevronRight className="text-xl md:text-2xl" />}
</button>
);

// --- Main Component ---
const OrganizationsSlider = () => {
    const [clientsData, setClientsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [showModal, setShowModal] = useState(false);
    const sliderRef = useRef(null);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    // --- Data Fetching ---
    const fetchClientsData = async () => {
        setLoading(true);
        setErr('');
        try {
            const response = await axios.get(`${BASE_API_URL}/guestUser/getAllOrganizations`);
            const approvedClients = (response.data.data || []).filter(org => org.approvalStatus === 'approved');
            setClientsData(approvedClients);
        } catch (error) {
            console.error("Error fetching organizations:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load organizations.';
            setErr(errorMessage);
            setClientsData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientsData();
    }, []);

    // --- Slider Settings ---
    const getSlidesToShow = () => {
         if (typeof window === 'undefined') return 6;
         if (window.innerWidth >= 1536) return 6; // 2xl
         if (window.innerWidth >= 1280) return 5; // xl
         if (window.innerWidth >= 1024) return 4; // lg
         if (window.innerWidth >= 768) return 3;  // md
         if (window.innerWidth >= 640) return 2;  // sm
         return 2; // xs
    };
    const initialSlidesToShow = getSlidesToShow();

    const settings = {
        dots: true,
        infinite: clientsData.length > initialSlidesToShow,
        speed: 500,
        slidesToShow: initialSlidesToShow, // Use dynamically calculated initial value
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        nextArrow: <CustomArrow direction="next" />,
        prevArrow: <CustomArrow direction="prev" />,
        dotsClass: "slick-dots slick-dots-custom",
        responsive: [
             {
                breakpoint: 1536, // 2xl
                settings: { slidesToShow: 6, slidesToScroll: 2, infinite: clientsData.length > 6 }
            },
            {
                breakpoint: 1280, // xl
                settings: { slidesToShow: 5, slidesToScroll: 2, infinite: clientsData.length > 5 }
            },
            {
                breakpoint: 1024, // lg
                settings: { slidesToShow: 4, slidesToScroll: 2, infinite: clientsData.length > 4 }
            },
            {
                breakpoint: 768, // md
                // Keep arrows on medium screens but adjust slides
                settings: { slidesToShow: 3, slidesToScroll: 1, infinite: clientsData.length > 3, dots: true, arrows: true }
            },
            {
                breakpoint: 640, // sm - Showing 2 slides, remove arrows
                settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false, infinite: clientsData.length > 2, dots: true }
            },
             {
                breakpoint: 480, // Smaller screens - remove arrows
                settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false, infinite: clientsData.length > 2, dots: true }
            }
        ]
    };

    // --- Framer Motion Variants ---
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    // Card Variants for the INNER card element
    const cardInnerVariants = {
        initial: { scale: 1, y: 0, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.04)"},
        hover: {
            scale: 1.06,
            y: -8,
            zIndex: 20,
            boxShadow: "0px 18px 35px rgba(0, 87, 184, 0.18), 0px 8px 15px rgba(0, 87, 184, 0.12)",
            transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
        }
    };

    // --- Render Helper for Slider Content ---
    const renderSliderContent = () => (
        <motion.div
            key="slider"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="w-full"
        >
            {/* Header Section - Reverted to previous style */}
            <div className="mb-8 md:mb-10 flex justify-between items-center px-4 lg:px-0"> {/* Adjusted padding */}
                {/* Approved Partners Count - Reverted Style */}
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                        Approved Partners: <span className="font-bold text-lightBlue-600">{clientsData.length}</span> {/* Use blue-600 from current theme */}
                    </span>
                </div>
                {/* View All Button - Reverted Style */}
                <button
                    onClick={openModal}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lightBlue-600 rounded-lg transition-all hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2" // Use blue-600/700 from current theme
                    aria-label="View All Partner Organizations"
                >
                    View All Partners
                    <FiExternalLink className="text-sm" /> {/* Adjusted icon size */}
                </button>
            </div>

            {/* Slider Container - 'group' for arrow hover */}
            <div className="relative group">
                 {/* Slider Component: Added padding for dots */}
                 {/* Adjusted margin for slider based on screen size */}
                 <Slider ref={sliderRef} {...settings} className="pb-12 md:pb-14 mx-[-8px] sm:mx-[-10px] md:mx-0">
                    {clientsData.map((client) => (
                        // Outer div: Provides padding for hover effect expansion
                        <div
                            key={client._id || client.id}
                            className="px-2 sm:px-2.5 md:px-3 py-3 outline-none h-full cursor-pointer"
                        >
                            {/* Inner Motion Div: Apply hover animation */}
                            <motion.div
                                variants={cardInnerVariants}
                                initial="initial"
                                whileHover="hover"
                                // Card Styling: Adjusted for circular image container
                                className="bg-white rounded-xl h-36 md:h-40 flex items-center justify-center p-3 border border-gray-200/90 transition-all duration-300 ease-in-out overflow-hidden relative group-hover:border-blue-300/50" // Slightly reduced padding p-3
                                title={client.name}
                            >
                                <img
                                    src={client.photo || "https://via.placeholder.com/150/F0F0F0/808080?text=Logo"}
                                    alt={`${client.name} Logo`}
                                    // Image Styling: INCREASED SIZE, Circular, object-cover, grayscale effect
                                    className="h-28 w-28 md:h-32 md:w-32 rounded-full object-cover filter grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300 ease-in-out" // Increased h/w to h-28/w-28 and md:h-32/w-32
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/150/F0F0F0/808080?text=Error";
                                        e.target.alt = "Logo loading error";
                                        // Ensure error placeholder is also circular and matches new size
                                        e.target.style.opacity = '0.7';
                                        e.target.className = "h-28 w-28 md:h-32 md:w-32 rounded-full object-cover opacity-70"; // Updated size here too
                                    }}
                                />
                            </motion.div>
                        </div>
                    ))}
                </Slider>
            </div>
        </motion.div>
    );

    // --- Main Render Logic ---
    return (
        <div className="organizations-slider-container py-10 md:py-14 bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Adjusted max-width slightly if needed */}
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                            className="flex flex-col items-center justify-center h-64 text-center"
                        >
                            <FaSpinner className="animate-spin text-4xl text-lightBlue-600 mb-5" />
                            <p className="text-gray-700 font-semibold text-lg">Loading Partners...</p>
                        </motion.div>
                    ) : err ? (
                        <motion.div
                            key="error"
                            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                            className="flex flex-col items-center justify-center h-64 text-center p-6 bg-red-50 rounded-lg border border-red-200 shadow-sm"
                        >
                            <FaRegSadTear className="text-5xl text-red-400 mb-5" />
                            <p className="text-red-800 font-semibold text-lg mb-2">Oops! Failed to Load Partners</p>
                            <p className="text-gray-600 text-sm max-w-md mb-5">{err}</p>
                             <button
                                onClick={fetchClientsData}
                                className="px-5 py-2.5 bg-lightBlue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition duration-200 shadow-sm hover:shadow-md"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    ) : clientsData.length === 0 ? (
                        <motion.div
                            key="empty"
                            variants={containerVariants} initial="hidden" animate="visible" exit="hidden"
                            className="flex flex-col items-center justify-center h-64 text-center p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm"
                        >
                            <FiInfo className="text-5xl text-gray-400 mb-5" />
                            <p className="text-gray-800 font-semibold text-lg mb-2">No Partner Organizations Found</p>
                            <p className="text-gray-500 text-sm">We currently don't have any approved partners listed. Please check back later.</p>
                        </motion.div>
                    ) : (
                        renderSliderContent()
                    )}
                </AnimatePresence>
            </div>

            {/* Modal */}
            {showModal && clientsData.length > 0 && (
                 <ShowAllClientsModal
                    closeModal={closeModal}
                    clients={clientsData}
                />
            )}

            {/* Custom Slick Dots Styling - Scoped */}
            <style jsx global>{`
                /* Keep existing global styles */
                .organizations-slider-container .slick-slider {
                   /* Removed margin override, handled by mx-* on Slider */
                }

                .organizations-slider-container .slick-dots-custom {
                    bottom: -25px; /* Adjusted position slightly */
                    position: absolute;
                    width: 100%;
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                    padding: 0;
                    margin: 25px 0 0 0; /* Increased top margin */
                    list-style: none;
                }

                .organizations-slider-container .slick-dots-custom li {
                    margin: 0 4px;
                }

                .organizations-slider-container .slick-dots-custom li button {
                    width: 9px;
                    height: 9px;
                    padding: 0;
                    border-radius: 50%;
                    background-color: #cbd5e1; /* gray-300 */
                    border: none;
                    cursor: pointer;
                    text-indent: -9999px;
                    overflow: hidden;
                    transition: all 0.3s ease-in-out;
                }

                .organizations-slider-container .slick-dots-custom li.slick-active button {
                    background-color: #3b82f6; /* blue-500 */
                    width: 28px;
                    border-radius: 10px;
                }

                .organizations-slider-container .slick-dots-custom li button:before {
                    display: none;
                }

                .organizations-slider-container .slick-arrow {
                    z-index: 30; /* Ensure arrows are above lifted cards (z-20) */
                }

                .organizations-slider-container .slick-track {
                    margin-top: 4px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: stretch; /* Make items stretch to fill height */
                }
                .organizations-slider-container .slick-slide > div {
                     height: 100%; /* Ensure slide container takes full height */
                     display: flex;
                }
                 .organizations-slider-container .slick-slide > div > div {
                     height: 100%; /* Ensure our padding div takes full height */
                     width: 100%; /* Ensure our padding div takes full width */
                 }

            `}</style>
        </div>
    );
};

export default OrganizationsSlider;