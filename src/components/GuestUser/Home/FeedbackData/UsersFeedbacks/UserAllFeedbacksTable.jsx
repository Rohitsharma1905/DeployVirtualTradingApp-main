import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../../../utils/BaseUrl";

import { Filter, Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { FolderOpen } from "lucide-react";
import { FaTimes, FaComments } from "react-icons/fa";
import { IoIosArrowUp } from "react-icons/io";
import { Listbox } from "@headlessui/react";
import { IoIosArrowDown } from "react-icons/io";

const CATEGORY_COLORS = {
  "Website UI/UX": "bg-blue-100 text-blue-800",
  "Trading Features": "bg-green-100 text-green-800",
  "Data Accuracy": "bg-purple-100 text-purple-800",
  "Performance & Speed": "bg-yellow-100 text-yellow-800",
  "Customer Support": "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-800",
};

const UserAllFeedbacksTable = ({ closeModal }) => {
  
  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  const [showDropdown, setShowDropdown] = useState(false);
  const listboxButtonStyle =
  "border rounded-lg px-5 py-[6px] text-sm w-38 text-left flex justify-between items-center bg-white text-gray-600 border-gray-600 hover:border-blue-400";

const listboxOptionsStyle =
  "absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none";

  const [popoverRow1, setPopoverRow1] = useState(null);
  const popoverRef1 = useRef(null);
  const togglePopover1 = (id) => {
    setPopoverRow1(popoverRow1 === id ? null : id);
  };
  const [popoverRow2, setPopoverRow2] = useState(null);
  const popoverRef2 = useRef(null);
  const togglePopover2 = (id) => {
    setPopoverRow2(popoverRow2 === id ? null : id);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef1.current && !popoverRef1.current.contains(event.target)) {
        setPopoverRow1(null);
      }
      if (popoverRef2.current && !popoverRef2.current.contains(event.target)) {
        setPopoverRow2(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [feedbacks, setFeedbacks] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orgData, setOrgData] = useState([]);

  const [err, setErr] = useState("");

  const [category, setCategory] = useState("all");
  const [organization, setOrganization] = useState("All");
  const [recommend, setRecommend] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdDate");
  const [order, setOrder] = useState("decreasing");

  useEffect(() => {
    let count = 0;
    let filters = {};

    if (category !== "all") {
      count++;
      filters["Category"] = category;
    }
    if (organization !== "All" && organization !== "all") {
      count++;
      filters["Organization"] = organization;
    }
    if (recommend !== "all") {
      count++;
      filters["Recommend"] = recommend;
    }
    if (search.trim() !== "") {
      count++;
      filters["Search"] = search;
    }
    if (sortBy !== "createdDate") {
      count++;
      filters["Sort By"] = sortBy;
    }
    if (order !== "decreasing") {
      count++;
      filters["Order"] = order;
    }
    setFilterCount(count);
    setAppliedFilters(filters);
  }, [category, organization, recommend, search, sortBy, order]);

  const removeFilter = (key) => {
    setAppliedFilters((prev) => {
      const updatedFilters = { ...prev }; // Copy the previous state
      delete updatedFilters[key]; // Remove the specific filter
      return updatedFilters; // Update the state
    });

    setFilterCount((prev) => Math.max(prev - 1, 0)); // Decrease filter count safely

    //Reset
    switch (key) {
      case "Category":
        setCategory("all");
        break;
      case "Organization":
        setOrganization("All");
        break;
      case "Recommend":
        setRecommend("all");
        break;
      case "SortBy":
        setSortBy("createdDate");
        break;
      case "Order":
        setOrder("decreasing");
        break;
      case "Search":
        setSearch("")
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setAppliedFilters({}); // Reset all filters
    setCategory("all");
    setOrganization("All");
    setRecommend("all");
    setSearch("");
    setSortBy("createdDate");
    setOrder("decreasing");
    setFilterCount(0); // Reset filter count
  };

  const fetchUserFeedbacks = async () => {
    try {
      const searchQuery = search.trim() === "" ? "all" : search;
      const response = await axios.get(
        `${BASE_API_URL}/guestUser/userFeedbacks/${organization}/${category}/${recommend}/${searchQuery}/${sortBy}/${order}`
        // `http://localhost:5000/v1/api/guestUser/userFeedbacks/${organization}/${category}/${recommend}/${searchQuery}/${sortBy}/${order}`
      );
      setFeedbacks(response.data.feedbackData);

      console.log("Users Feedbacks Object: ", response.data);
      console.log("User Feedbacks: ", feedbacks);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong.");
    }
  };

  const fetchUsersData = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/guestUser/getAllUsers`);
      // const response = await axios.get(`http://localhost:5000/v1/api/guestUser/getAllUsers`);
      setUserData(response.data.data);
      console.log("User Data", response.data);
    } catch (error) {
      setErr(error.response?.data?.message || "Something went wrong.");
    }
  };

  const fetchOrganizationsData = async () => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/guestUser/getAllOrganizations`
        // `http://localhost:5000/v1/api/guestUser/getAllOrganizations`
      );
      setOrgData(response.data.data);
      setErr("");
    } catch (error) {
      setErr(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchUserFeedbacks();
        fetchUsersData();
        fetchOrganizationsData();
        setErr("");
      } catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, [sortBy, order, category, organization, recommend, search]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,24,38,0.4)] pt-19" // Light background
      onClick={closeModal}
    >
      <div
        className="relative bg-white pl-1 pr-1 pt-0 rounded-xl shadow-lg w-[85%] h-[83vh] flex flex-col "
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <div className="sticky top-0 bg-white left-0 w-full border-b border-gray-100 p-4 mt-1">
          {/* Top Header */}
          <div className="flex justify-between items-center">
            {/* Left Side (Icon + Heading) */}
            <div className="flex items-center gap-2">
              <FaComments className="text-[#2474ff] text-[27px]" />
              <h2 className="text-[18px] font-bold text-gray-600">
                Users' Feedbacks
              </h2>
            </div>

            {/* Right Side (Total Feedbacks + Filter Icon + Close Button) */}
            <div className="flex items-center gap-4">
              <h6 className="text-base font-semibold text-gray-400">
                Total Feedbacks: {feedbacks.length}
              </h6>

              {/* Filter Icon */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-9 px-4 py-2 h-[40px] border rounded-lg transition-all duration-200 
                            ${
                              showFilters
                                ? "border-gray-300 shadow-md w-[110px]"
                                : "border-gray-200 w-[110px] hover:shadow-sm hover:border-gray-300"
                            }
                          `}
              >
                {/* Filter Icon */}
                <div className="relative">
                  <Filter className="text-gray-500 text-xl hover:text-gray-700 transition-colors duration-200" />

                  {/* Filter Count - Positioned Bottom Right */}
                  {filterCount > 0 && (
                    <span className="absolute mt-[4px] bottom-1 -right-7.5 bg-lightBlue-600 text-white px-2 py-[2px] rounded-full text-xs">
                      {filterCount}
                    </span>
                  )}
                </div>
                {/* Arrow Icon */}
                <IoIosArrowUp
                  className={`pl-[2px] text-gray-500 text-lg transition-transform duration-200 ${
                    showFilters ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>

              {/* Search bar */}
              <div className="relative">
                <div className="relative w-[270px]">
                  {/* Search Icon */}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                    alt="search"
                    className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
                  />
                  {/* Search Input */}
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value || "")}
                    className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[36px] focus:outline-none focus:shadow-md focus:border-black"
                  />
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors focus:outline-none"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600 text-lg focus:outline-none" />
              </button>
            </div>
          </div>

          {/* Filters Section (Visible only when showFilters is true) */}
          {showFilters && (
            <div className="flex justify-end items-center mt-5">
              <div className="flex gap-4 mr-auto">
{/* Organization Select (using native select) */}
<div className="flex flex-col">
  <label className="text-sm font-medium text-gray-600 mb-1">
    Organization
  </label>
  <div className="relative">
    <select
      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
      value={organization}
      onChange={(e) => setOrganization(e.target.value || "All")}
    >
      <option  value="All">All</option>
      {orgData.map((org) => (
        <option key={org._id} value={org.name}>
          {org.name
            .split(" ")
            .map(
              (word) =>
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(" ")}
        </option>
      ))}
    </select>
  </div>
</div>



                {/* Category Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={category}
                      onChange={(e) => setCategory(e.target.value || "all")}
                    >
                      <option disabled>Category</option>
                      <option value="all">All</option>
                      <option value="Website UI">Website UI/UX</option>
                      <option value="Data Accuracy">Data Accuracy</option>
                      <option value="Trading Features">Trading Features</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Performance & Speed">
                        Performance & Speed
                      </option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Recommendation Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Recommend
                  </label>
                  <div className="relative">
                    <select
                      name="Recommend"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={recommend}
                      onChange={(e) => setRecommend(e.target.value || "all")}
                    >
                      <option disabled>Recommend</option>
                      <option value="all">All</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                {/* Sort By Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    SortBy
                  </label>
                  <div className="relative">
                    <select
                      name="sortBy"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value || "createdDate")
                      }
                    >
                      <option disabled>SortBy</option>
                      <option value="createdDate">Recent Feedback</option>
                      <option value="rating">Ratings</option>
                    </select>
                  </div>
                </div>

                {/* Order Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Order
                  </label>
                  <div className="relative">
                    <select
                      name="Order"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8"
                      value={order}
                      onChange={(e) => setOrder(e.target.value || "decreasing")}
                    >
                      <option disabled>Order</option>
                      <option value="decreasing">High</option>
                      <option value="increasing">Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filterCount > 0 && (
            <div className="mt-2 -mb-1 -ml-1 -mr-1 p-2 bg-gray-100 rounded-lg shadow-md flex justify-between items-center">
              <div className="flex flex-wrap gap-2 flex items-center">
                {Object.entries(appliedFilters).map(([key, value]) => (
                  <span
                    key={key}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {key}: {value}
                    <button
                      onClick={() => removeFilter(key)}
                      className="ml-6 mr-1 mt-1 focus:outline-none bg-transparent"
                    >
                      <FaTimes className="text-blue-300 hover:text-blue-800 text-sm" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-[6px] bg-gray-200 text-gray-700 text-sm font-semibold rounded-full transition-all duration-200 hover:bg-gray-500 hover:text-white shadow-sm"
              >
              Clear All &nbsp;&nbsp;&nbsp;<FaTimes className="text-gray-500 hover:text-gray-700 text-base" />
              </button>
            </div>
          )}
        </div>

        {/* {err && <p className="text-red-500">{err}</p>} */}

        {/* List of Feedbacks */}
        <div  className={`flex 
        ${
          showFilters
          ? filterCount > 0 ? "h-[43vh]" : "h-[51vh]"
          : filterCount > 0 ? "h-[55vh]" : "h-[63vh]"
        }`}>
          <div className="inset-0 overflow-y-auto w-full max-h-[500px] rounded-lg shadow-md">
            <table className="inset-0 min-w-full table-fixed divide-y divide-gray-200 border-collapse bg-white">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedbacks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ratings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommendations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suggestions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>

              {err && (
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                <td colSpan="8">
                  <div className="mt-12 ml-15 flex justify-center items-center min-h-[200px]">
                  <div className="flex flex-col items-center justify-center w-96 bg-gray-100 rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                      <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                    </div>
                    <b className="text-lg text-gray-800 mt-4">Oops! Something went wrong.</b>
                    <p className="text-gray-600 text-sm text-center mt-2">
                      We couldn’t load the content. Please try again later.
                    </p>
                    <p className="text-red-600 font-medium mt-2">{err}</p>
                    <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-red-600 transition"
                    >
                      Retry
                    </button>
                  </div>
                  </div>
                </td>
                </tr>
              </tbody>
              )}

              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedbackData, index) => {
                    const organizationName = orgData.find(
                      (org) => org._id === feedbackData.organizationId?._id
                    );
                    const userName = userData.find(
                      (user) => user._id === feedbackData.userId?._id
                    );
                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* <td className="px-6 py-4 whitespace-nowrap min-w-[185px] text-sm font-medium text-gray-900">
                          {organizationName
                            ? organizationName.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")
                            : "No Organization"}
                        </td> */}

                        <td className="px-6 py-4 whitespace-nowrap min-w-[185px] text-sm font-medium text-gray-900">
                          {userName
                            ? userName.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")
                            : "Anonymous"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              CATEGORY_COLORS[feedbackData.feedbackCategory]
                            }`}
                          >
                            {feedbackData.feedbackCategory}
                          </span>
                        </td>

                        <td className="px-6 py-4 min-w-[195px] text-sm text-gray-500">
                        {feedbackData.feedbackMessage?.length > 50 ? (
                            <>
                            {`${feedbackData.feedbackMessage.substring(0, 50)}...`}
                            <button
                            onClick={() => togglePopover1(feedbackData._id)}
                            className="ml-2 text-lightBlue-600 hover:text-blue-700 focus:outline-none"
                            > Show more </button>
                            {popoverRow1 === feedbackData._id && (
                              <div className="absolute left-100 top-42 w-100 bg-white shadow-lg border border-gray-300 rounded-lg z-10" ref={popoverRef1}>
                              <div className="flex justify-between items-center bg-gray-100 pt-1 pb-[2px] pr-3 pl-3">
                              <div className="flex items-center text-gray-600"><h6>Feedbacks</h6></div>
                              <button
                              onClick={() => togglePopover1(null)}
                              className="text-base focus:outline-none"
                              > <i className="fas fa-times rounded-sm w-6 flex items-center justify-center text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200"></i></button>
                              </div>
                              <div className="max-h-50 min-h-21 overflow-y-auto">
                              <p className="text-gray-700 mt-2.5 mb-2 pr-2 pl-3">{feedbackData.feedbackMessage}</p>
                              </div>
                              <div className="bg-gray-100">
                              <p className="text-gray-700 text-[13px] text-right pb-[2px] pt-[1px] pr-2">- {organizationName.name}</p>
                              </div>
                              </div>
                            )}
                            </>) : (feedbackData.feedbackMessage || "No feedback provided")}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={18}
                                className={`mx-0.5 ${
                                  i < feedbackData.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {feedbackData.recommend ? (
                            <ThumbsUp
                              size={20}
                              className="text-green-500 inline"
                            />
                          ) : (
                            <ThumbsDown
                              size={20}
                              className="text-red-500 inline"
                            />
                          )}
                        </td>

                        <td className="px-6 py-4 min-w-[195px] text-sm text-gray-500">
                        {feedbackData.suggestions?.length > 50 ? (
                            <>
                            {`${feedbackData.suggestions.substring(0, 50)}...`}
                            <button
                            onClick={() => togglePopover2(feedbackData._id)}
                            className="ml-2 text-lightBlue-600 hover:text-blue-700 focus:outline-none"
                            > Show more </button>
                            {popoverRow2 === feedbackData._id && (
                              <div className="absolute left-100 top-42 w-100 bg-white shadow-lg border border-gray-300 rounded-lg z-10" ref={popoverRef2}>
                              <div className="flex justify-between items-center bg-gray-100 pt-1 pb-[2px] pr-3 pl-3">
                              <div className="flex items-center text-gray-600"><h6>Suggestions</h6></div>
                              <button
                              onClick={() => togglePopover2(null)}
                              className="text-base focus:outline-none"
                              > <i className="fas fa-times rounded-sm w-6 flex items-center justify-center text-red-500 bg-red-100 hover:text-red-700 hover:bg-red-200"></i></button>
                              </div>
                              <div className="max-h-50 min-h-21 overflow-y-auto">
                              <p className="text-gray-700 mt-2.5 mb-2 pr-2 pl-3">{feedbackData.suggestions}</p>
                              </div>
                              <div className="bg-gray-100">
                              <p className="text-gray-700 text-[13px] text-right pb-[2px] pt-[1px] pr-2">- {organizationName.name}</p>
                              </div>
                              </div>
                            )}
                            </>) : (feedbackData.suggestions || "No suggestion provided")}                          
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            feedbackData.createdDate
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (!err &&
                  <tr>
                  <td colSpan="8"
                  className="p-6 text-center text-gray-500 text-base font-medium bg-gray-50 rounded-md mt-4"
                  >
                    <div className="pt-20 pb-42 flex flex-col items-center space-y-2">
                    <FolderOpen className="w-10 h-10 text-gray-400" /> 
                    <span>No feedbacks available.</span>
                    </div>
                  </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="sticky bottom-0 -pb-2 bg-white py-1 border-t border-gray-100 flex justify-end">
          <button
            onClick={closeModal}
            className="px-6 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-white transition mt-1 -mb-2 mr-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAllFeedbacksTable;