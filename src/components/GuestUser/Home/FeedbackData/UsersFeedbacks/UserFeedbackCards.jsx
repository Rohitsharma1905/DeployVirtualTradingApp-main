import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../../../utils/BaseUrl";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { BiMessageDetail } from "react-icons/bi";
import { FiExternalLink } from "react-icons/fi";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaRegSadTear, FaSpinner, FaCheckCircle } from "react-icons/fa";
import UserAllFeedbacksTable from "./UserAllFeedbacksTable";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useMediaQuery } from 'react-responsive';

const UserFeedbackCards = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchUserFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/guestUser/userFeedbacks/createdDate/decreasing`
      );
      setFeedbacks(response.data.feedbackData);
      setLoading(false);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to load feedbacks");
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/guestUser/getAllUsers`
      );
      setUserData(response.data.data);
    } catch (error) {
      setErr(error.response?.data?.message || "Failed to load user data");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserFeedbacks();
  }, []);

  const CustomPrevArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-r-full shadow-lg hover:bg-gray-100 transition-all duration-300"
      aria-label="Previous"
      style={{ boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}
    >
      <BiChevronLeft className="text-2xl text-gray-700 hover:text-lightBlue-600" />
    </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button 
      onClick={onClick} 
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white p-3 rounded-l-full shadow-lg hover:bg-gray-100 transition-all duration-300"
      aria-label="Next"
      style={{ boxShadow: '-2px 0 5px rgba(0,0,0,0.1)' }}
    >
      <BiChevronRight className="text-2xl text-gray-700 hover:text-lightBlue-600" />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    dotsClass: "slick-dots slick-dots-custom",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          dots: false
        }
      }
    ]
  };

  // Mobile view component
  const MobileView = () => (
    <div className="px-4">
      <div className="flex flex-col gap-4 mb-6">
        <div className='flex items-center'>
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <BiMessageDetail className="text-lightBlue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">User Feedbacks</h3>
            <p className="text-xs text-gray-500">What our users say about us</p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="bg-gray-100 px-3 py-1 rounded-lg">
            <span className="text-xs font-medium text-gray-700">
              Total: <span className="font-bold text-lightBlue-600">{feedbacks.length}</span>
            </span>
          </div>
          <button 
            onClick={openModal}
            className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-white bg-lightBlue-600 rounded-lg transition-all hover:bg-blue-700 shadow-md"
          >
            View All
            <FiExternalLink className="text-xs" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {feedbacks.slice(0, 3).map((feedback, index) => {
          const user = userData.find(user => user._id === feedback.userId?._id);
          return (
            <motion.div 
              key={index}
              whileHover={{ y: -2 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-lightBlue-600 font-semibold text-sm">
                        {user ? user.name.charAt(0).toUpperCase() : "U"}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-gray-800">
                      {user ? user.name.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ') : "User"}
                    </h4>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={`mx-0.5 ${
                          i < feedback.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-gray-700 mb-1">
                    {feedback.feedbackCategory}
                  </h4>
                  <p className="text-xs text-gray-600 italic line-clamp-2">
                    "{feedback.feedbackMessage}"
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(feedback.createdDate).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Verified</span>
                    <FaCheckCircle className="w-3 h-3 text-green-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  // Tablet view component
  const TabletView = () => (
    <div className="px-6 py-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className='flex items-center'>
          <div className="bg-blue-100 p-3 rounded-lg mr-4">
            <BiMessageDetail className="text-lightBlue-600 text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">User Feedbacks</h3>
            <p className="text-sm text-gray-500">What our users say about us</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-gray-100 px-3 py-1 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Total: <span className="font-bold text-lightBlue-600">{feedbacks.length}</span>
            </span>
          </div>
          <button 
            onClick={openModal}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-lightBlue-600 rounded-lg transition-all hover:bg-blue-700 shadow-md"
          >
            View All
            <FiExternalLink className="text-sm" />
          </button>
        </div>
      </div>

      <div className="relative px-4">
        <Slider {...settings} className="pb-6" slidesToShow={2} slidesToScroll={1}>
          {feedbacks.map((feedback, index) => {
            const user = userData.find(user => user._id === feedback.userId?._id);
            return (
              <motion.div 
                key={index}
                whileHover={{ y: -3 }}
                className="px-2 outline-none"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all h-full">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-lightBlue-600 font-semibold text-lg">
                            {user ? user.name.charAt(0).toUpperCase() : "U"}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-md font-semibold text-gray-800">
                            {user ? user.name.split(' ').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ') : "User"}
                          </h4>
                          <p className="text-xs text-gray-500">{feedback.feedbackCategory}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={`mx-0.5 ${
                              i < feedback.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4 relative">
                      <div className="absolute -top-2 -left-2 text-gray-200 text-3xl font-serif">"</div>
                      <p className="text-sm text-gray-600 italic line-clamp-3 pl-3">
                        {feedback.feedbackMessage}
                      </p>
                      <div className="absolute -bottom-2 right-0 text-gray-200 text-3xl font-serif">"</div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdDate).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Verified</span>
                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Slider>
      </div>
    </div>
  );

  return (
    <section className={`my-8 md:my-12 lg:my-16 bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 ${isMobile ? 'mx-4' : ''}`}>
      {isMobile ? (
        <MobileView />
      ) : isTablet ? (
        <TabletView />
      ) : (
        <div className="px-6 py-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className='flex items-center'>
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BiMessageDetail className="text-lightBlue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">User Feedbacks</h3>
                <p className="text-sm text-gray-500">What our users say about us</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  Total: <span className="font-bold text-lightBlue-600">{feedbacks.length}</span>
                </span>
              </div>
              <button 
                onClick={openModal}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-lightBlue-600 rounded-lg transition-all hover:bg-blue-700 shadow-md"
              >
                View All
                <FiExternalLink className="text-sm" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <FaSpinner className="animate-spin text-3xl text-lightBlue-600" />
                <p className="text-gray-600">Loading feedbacks...</p>
              </motion.div>
            ) : err ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-12 px-4 bg-red-50 rounded-lg border border-red-100"
              >
                <FaRegSadTear className="text-4xl text-red-400 mb-4" />
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h4>
                <p className="text-gray-600 mb-4 text-center max-w-md text-sm">
                  {err}
                </p>
                <button
                  onClick={fetchUserFeedbacks}
                  className="px-5 py-2 bg-lightBlue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Retry
                </button>
              </motion.div>
            ) : feedbacks.length > 0 ? (
              <div className="relative px-8">
                <Slider {...settings} className="pb-8 pt-2">
                  {feedbacks.map((feedback, index) => {
                    const user = userData.find(user => user._id === feedback.userId?._id);
                    return (
                      <motion.div 
                        key={index}
                        whileHover={{ y: -5 }}
                        className="px-2 outline-none"
                      >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all h-full flex flex-col">
                          {/* User Header */}
                          <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-lightBlue-600 font-semibold text-lg">
                                    {user ? user.name.charAt(0).toUpperCase() : "U"}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-800 line-clamp-1">
                                    {user ? user.name.split(' ').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                    ).join(' ') : "User"}
                                  </h4>
                                  <p className="text-sm text-gray-500">{feedback.feedbackCategory}</p>
                                </div>
                              </div>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    size={16}
                                    className={`${
                                      i < feedback.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Feedback Content */}
                          <div className="p-6 flex-grow bg-gradient-to-b from-white to-gray-50">
                            <div className="relative">
                              <div className="absolute -top-6 -left-2 text-gray-200 text-4xl font-serif">"</div>
                              <p className="text-gray-600 text-sm leading-relaxed pl-4 italic line-clamp-4">
                                {feedback.feedbackMessage}
                              </p>
                              <div className="absolute -bottom-4 right-0 text-gray-200 text-4xl font-serif">"</div>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {new Date(feedback.createdDate).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Verified</span>
                                <FaCheckCircle className="w-4 h-4 text-green-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="text-4xl text-gray-300 mb-3">💬</div>
                <h4 className="text-md text-gray-500 font-medium">No user feedbacks available</h4>
                <p className="text-sm text-gray-400 mt-1">Check back later for updates</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
      
      {showModal && <UserAllFeedbacksTable closeModal={closeModal} />}

      <style jsx>{`
        .slick-dots-custom {
          bottom: -25px;
          display: flex !important;
          justify-content: center;
          align-items: center;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        
        .slick-dots-custom li {
          margin: 0 4px;
        }
        
        .slick-dots-custom li button {
          width: 8px;
          height: 8px;
          padding: 0;
          border-radius: 50%;
          background: #d1d5db;
          border: none;
          text-indent: -9999px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .slick-dots-custom li.slick-active button {
          background: #3b82f6;
          width: 20px;
          border-radius: 10px;
        }
        
        .slick-dots-custom li button:before {
          display: none;
        }

        .slick-slide > div {
          margin: 0 10px;
        }
      `}</style>
    </section>
  );
};

export default UserFeedbackCards;