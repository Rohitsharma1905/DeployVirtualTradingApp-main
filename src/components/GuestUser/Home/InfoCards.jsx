import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl"; // Ensure this path is correct
import { motion } from "framer-motion";
import { FiUsers, FiBriefcase, FiActivity, FiCheckCircle } from "react-icons/fi";
import CountUp from 'react-countup';
// useMediaQuery is imported but not used in this specific component version.
// Keep it if you plan to use it elsewhere or remove it if not needed.
import { useMediaQuery } from 'react-responsive'; 

const InfoCards = ({ shouldRefetch }) => {
  // --- State Variables ---
  const [userData, setUserData] = useState([]);
  const [orgData, setOrgData] = useState([]);
  const [approvedOrgs, setApprovedOrgs] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- Data Fetching Functions ---
  const fetchOrgData = async () => {
    setLoading(true); // Set loading true at the start of fetch
    try {
      const response = await axios.get(`${BASE_API_URL}/guestUser/getAllOrganizations`);
      const allOrgs = response.data.data || []; // Ensure it's an array
      setOrgData(allOrgs);
      const approvedOrgCount = allOrgs.filter(org => org.approvalStatus === 'approved').length;
      setApprovedOrgs(approvedOrgCount);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrgData([]); // Set empty array on error
      setApprovedOrgs(0);
    } finally {
        // Only set loading false if both fetches are intended to complete
        // If they run in parallel, manage loading state more carefully
        // Assuming sequential or independent, this might be okay, 
        // but better to set loading false after both complete or use Promise.all
    }
  };
  
  const fetchUserData = async () => {
    setLoading(true); // Set loading true at the start of fetch
    try {
      const response = await axios.get(`${BASE_API_URL}/guestUser/getAllUsers`);
      const allUsers = response.data.data || []; // Ensure it's an array
      setUserData(allUsers);
      const activeCount = allUsers.filter(user => user.isDeleted === false).length;
      setActiveUsers(activeCount);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUserData([]); // Set empty array on error
      setActiveUsers(0);
    } finally {
        setLoading(false); // Set loading false after this fetch completes
    }
  };

  // --- useEffect Hook for Data Fetching ---
  useEffect(() => {
    if (shouldRefetch) {
      // Consider using Promise.all for parallel fetching and better loading state management
      const fetchData = async () => {
        setLoading(true);
        try {
          await Promise.all([fetchOrgData(), fetchUserData()]);
        } catch (error) {
          // Handle potential errors from Promise.all if needed, though individual fetches handle errors
          console.error("Error fetching combined data:", error);
        } finally {
          setLoading(false); // Set loading false after both promises settle
        }
      };
      fetchData();

      // --- Original Sequential Fetch Logic (can be used if preferred) ---
      // setLoading(true); // Set loading at the beginning
      // fetchOrgData().finally(() => {
      //   fetchUserData().finally(() => {
      //     setLoading(false); // Set loading false after both complete
      //   });
      // });
    } else {
        // If shouldRefetch becomes false, maybe reset data or keep existing?
        // Setting loading to false here ensures UI updates if refetch is cancelled.
        setLoading(false);
    }
  }, [shouldRefetch]); // Dependency array

  // --- Stats Configuration ---
  const stats = [
    { 
      id: 1, 
      title: "Partnered Organizations", 
      value: orgData.length,
      icon: <FiBriefcase className="w-6 h-6 md:w-7 md:h-7" />, // Slightly adjusted icon size
      color: "bg-blue-100 text-blue-600",
      baseColorClass: "text-blue-600"
    },
    { 
      id: 2, 
      title: "Verified Organizations", 
      value: approvedOrgs,
      icon: <FiCheckCircle className="w-6 h-6 md:w-7 md:h-7" />,
      color: "bg-emerald-100 text-emerald-600", // Use emerald for a nicer green
      baseColorClass: "text-emerald-600"
    },
    { 
      id: 3, 
      title: "Registered Users", 
      value: userData.length,
      icon: <FiUsers className="w-6 h-6 md:w-7 md:h-7" />,
      color: "bg-indigo-100 text-indigo-600", // Use indigo instead of purple
      baseColorClass: "text-indigo-600"
    },
    { 
      id: 4, 
      title: "Active Users", 
      value: activeUsers,
      icon: <FiActivity className="w-6 h-6 md:w-7 md:h-7" />,
      color: "bg-amber-100 text-amber-600", // Changed color for variety
      baseColorClass: "text-amber-600"
    },
  ];

  // --- Card Animation Variants ---
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -6, scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 15 } }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Stagger animation for each card
      },
    },
  };

  // --- Component Return ---
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger when 20% is visible
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
    >
      {stats.map((stat) => (
        <motion.div 
          key={stat.id}
          variants={cardVariants} // Apply individual card variants
          whileHover="hover"      // Apply hover animation
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100/80 group transition-shadow duration-300 hover:shadow-xl" // Softer border, enhanced shadow on hover
        >
          <div className="p-5 sm:p-6"> {/* Adjusted padding slightly */}
            {/* Icon Section */}
            <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full ${stat.color} mb-4 mx-auto transform transition-transform duration-300 group-hover:scale-110`}> 
              {stat.icon}
            </div>
            
            {/* Number Section (with Loading Skeleton) */}
            <div className="text-center mb-1.5 sm:mb-2 h-10 sm:h-12 flex items-center justify-center"> {/* Fixed height container */}
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
              ) : (
                <CountUp 
                  end={stat.value} 
                  duration={2.5} 
                  separator=","
                  className={`block text-3xl sm:text-4xl font-bold ${stat.baseColorClass}`} // Use base color for number
                />
              )}
            </div>

            {/* Title Section (with Loading Skeleton) */}
            <div className="text-center h-6 flex items-center justify-center"> {/* Fixed height container */}
              {loading ? (
                 <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              ): (
                <p className="text-sm sm:text-base text-gray-500 font-medium"> {/* Slightly lighter title color */}
                  {stat.title}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default InfoCards;