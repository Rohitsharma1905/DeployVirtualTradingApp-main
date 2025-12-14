import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake } from '@fortawesome/free-solid-svg-icons';
import { Filter, ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { IoIosArrowUp } from "react-icons/io";
import { FaTimes } from "react-icons/fa";
import { toast } from 'react-hot-toast';

const TimeSlot_Colors = {
  "10:00 - 12:00": "bg-blue-100 text-blue-800",
  "12:00 - 14:00": "bg-cyan-100 text-cyan-800",
  "14:00 - 16:00": "bg-purple-100 text-purple-800",
  "16:00 - 18:00": "bg-yellow-100 text-yellow-800",
  "18:00 - 20:00": "bg-orange-100 text-orange-800",
  "Any Time": "bg-green-100 text-green-800 pr-4 pl-4",
}
const Status_Colors = {
  true:"bg-green-100 text-green-800",
  false:"bg-yellow-100 text-yellow-800 pr-4 pl-4",
}

const TitleCell = ({ query }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const shouldTruncate = query.length > 60;
  const displayText = isExpanded
    ? query
    : query.slice(0, 60) + (shouldTruncate ? "..." : "");

  return (
    <div className="flex flex-col">
      {/* <span><i className="fas fa-info-circle text-gray-400"/>&nbsp;{displayText}</span> */}
      <span>{displayText}</span>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-lightBlue-600 text-xs hover:underline mt-1 self-start focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

const ToggleButton = ({ id, isResolved, refreshData }) => {

  const handleClick = async () => {
      if (isResolved) {
          toast('This request is already resolved.', {
            icon:'⚠️',
          });
          return;
      }

    try {
      const res = await axios.put(`${BASE_API_URL}/admin/demo/updateDemobyOrganization/${id}`);
      console.log("User Booked Demo Status: ", res.data);
      if (res?.status===201) {
          toast.success(res?.data?.message);
          refreshData()
      }
      else if (res?.status === 409 || res?.status === 400) {
          toast(res?.data?.message, {
              icon: '⚠️',
          })
      }
      else if (res?.status === 500) {
          toast(res?.data?.message, {
              icon: '🛑',
          })
      }
    } 
    catch (error) {
      console.error("Error resolving demo request:", error);
      if (error.response) {
          const { status, data } = error.response;
          if (status === 409 || status===400) {
              toast(data?.message, {
                  icon: '⚠️',
              });
          } 
          else if (status === 500) {
              toast(data?.message, {
                  icon: '🛑',
              })
          } 
          else {
              toast.error(data?.message || "Unknown error, please try again.");
          }
      } 
      else {
          toast.error("An internal server error occurred!");
          refreshData()
      }  
      throw error; 
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isResolved}
      onChange={handleClick}
      // disabled={isResolved}
    />

    {/* Track */}
    <div
      className={`
        relative w-13 h-6 rounded-full bg-white border-2 transition-opacity
        ${isResolved ? "bg-emerald-500 border-emerald-700 cursor-not-allowed" : "bg-red-500 border-red-700"}
      `} //opacity-70
    >
      {/* Sliding Toggle */}
      <div
        className={`
          absolute h-4 w-5 rounded-full bg-white transition-transform duration-300 ease-in-out
          ${isResolved ? "translate-x-6" : "translate-x-0"}
        `}  style={{ top: '2px', left: '2px' }}
      />
    </div>
  </label>
  );
};

const ShowBookDemobyOrg = ({ sidebarExpanded }) => {

  const [showFilters, setShowFilters] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  const [data, setData] = useState([]);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [field, setField] = useState("name")

  const [timeSlot, setTimeSlot]=useState("all")
  const [status, setStatus]=useState("all")

  useEffect(()=>{
    if(search.trim()==="")
      setField("name")
  },[search])

  useEffect(() => {
    let count = 0;
    let filters = {};
  
    if (timeSlot !== "all") {
      count++;
      filters["TimeSlot"] = timeSlot;
    }
    if (status !== "all") {
      count++;
      if(status==="true")
        filters["Status"] = "Completed";
      if(status==="false")
        filters["Status"] = "Pending";
    }
    if (search.trim() !== "") {
      count++;
      filters["Search"] = search;
    }
    setFilterCount(count);
    setAppliedFilters(filters);

  }, [search, timeSlot, status]);

  const removeFilter = (key) => {
    setAppliedFilters((prev) => {
      const updatedFilters = { ...prev }; // Copy the previous state
      delete updatedFilters[key]; // Remove the specific filter
      return updatedFilters; // Update the state
    });
  
    setFilterCount((prev) => Math.max(prev - 1, 0)); // Decrease filter count safely
  
      // Reset the corresponding state variable
    switch (key) {
      case "TimeSlot":
        setTimeSlot("all");
        break;
      case "Status":
        setStatus("all");
          break;
      case "Search":
        setSearch("")
        setField("name")
        break;
      default:
        break;
    }
  };

  const clearAllFilters = () => {
    setAppliedFilters({});  // Reset all filters
    setTimeSlot("all")
    setStatus("all")
    setSearch("")
    setField("name")
    setFilterCount(0);  // Reset filter count
  };

  const fetchBookDemobyOrgData = async () => {
    try {
      const searchQuery = search.trim() === "" ? "all" : search;

      const response = await axios.get(
        // `${BASE_API_URL}/admin/demo/getDemobyOrganization`
        `${BASE_API_URL}/admin/demo/getDemobyOrganization/${timeSlot}/${status}/${field}/${searchQuery}`
      );

      console.log("Book Demo Data: ", response.data);
      setData(response.data.data);
    } 
    catch (error) {
      if (error.response) {
        setErr(error.response?.data?.message);
      } 
      else {
        setErr("Something went wrong. Please try again.");
      }
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetchBookDemobyOrgData();
        setErr("");
      } 
      catch (error) {
        setErr(error.response?.data?.message || "Something went wrong.");
      }
    };
    fetchData();
  }, [timeSlot, status, search, field]);

  const refreshData = () => {
    fetchBookDemobyOrgData();
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <div
        className={`relative z-20 flex items-center justify-center bg-transparent pb-0 pointer-events-none`}
      >
        <div
          className={`
        ${sidebarExpanded ? "left-1 w-[94%]" : "left-0 w-[95%]"}
        -mt-12 relative bg-white pl-1 pr-1 pt-0 rounded-lg h-[72vh] flex flex-col shadow-lg pointer-events-auto
      `}
        >
          <div className="sticky top-0 bg-white left-0 w-full border-b border-gray-100 p-4 mt-1">
            {/* Top Header */}
            <div className="flex justify-between items-center">
              {/* Left Side (Icon + Heading) */}
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faHandshake}
                  className="text-gray-500 text-[21px] h-7"
                />
                <h2 className="text-xl font-bold text-gray-800">
                  Manage Org's Demo Bookings
                </h2>
                {!sidebarExpanded ? (
                  <p className="-ml-2 max-w-[9.5rem] rounded-2xl pt-1 pb-1 pl-2 pr-2 text-xs bg-gray-100 text-gray-700 mt-2">
                    Total Bookings: {data?.length}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-3 -mr-2">
                
              {/* Filter Icon */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative flex items-center gap-5 px-2 py-2 h-[38px] border rounded-lg focus:outline-none hover:shadow-shadow-[0_0_7px_1px_rgba(59,130,246,0.7)] hover:border-blue-400
                            ${showFilters? "shadow-[0_0_7px_1px_rgba(59,130,246,0.5)] border-blue-300" : "shadow-md border-gray-300"}
                          `}
              >
                {/* Filter Icon */}
                <div className="relative">
                  <Filter className="text-gray-500 text-xl hover:text-gray-700 focus:outline-none" />

                  {/* Filter Count - Positioned Bottom Right */}
                  {filterCount > 0 && (
                    <span className="absolute mt-[4px] bottom-1 -right-5.5 bg-lightBlue-600 text-white px-2 py-[2px] rounded-full text-xs">
                      {filterCount}
                    </span>
                  )}
                </div>
                {/* Arrow Icon */}
                <IoIosArrowUp
                  className={`pl-[2px] -pr-[2px] text-gray-500 text-lg transition-transform duration-200 ${
                    showFilters ? "rotate-0" : "rotate-180"
                  }`}
                />
              </button>

                {/* Selector Box for field selection */}
                <div className="flex flex-col relative">
                  <div className="relative group">
                    <select
                    name="SelectField"
                    className="border rounded-lg px-4 py-[8px] text-sm appearance-none w-28 pr-10 truncate"
                    value={field}
                    onChange={(e) => setField(e.target.value || "")}
                    >
                      <option disabled>Select</option>
                      <option value="name">Name</option>
                      <option value="email">Email</option>
                      <option value="mobile">Mobile</option>
                      <option value="contactPerson">Contact Person</option>
                      <option value="demoRequestDate">Demo Booked On</option>
                      <option value="demoResolveDate">Demo Completed On</option>
                      <option value="preferredDate">Preferred Date</option>
                    </select>
                  </div>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <div className="relative w-[220px]">

                    {/* Search/Calender Icon */}
                    {field=='demoRequestDate' || field=='demoResolveDate' || field=='preferredDate'
                      ?<img
                        src="https://cdn-icons-png.flaticon.com/512/747/747310.png"
                        alt="calendar"
                        className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
                      />
                      :<img
                        src="https://cdn-icons-png.flaticon.com/512/622/622669.png"
                        alt="search"
                        className="absolute left-3 top-1/4 transform -translate-y-1/2 w-4 h-4"
                      />
                    }
                  
                    {/* Search/Date Input */}
                    {field=='demoRequestDate' || field=='demoResolveDate' || field=='preferredDate'
                      ?<input
                        type="date"
                        placeholder="Date..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value || "")}
                        className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[38px] focus:outline-none focus:shadow-md focus:border-black"
                      />
                      :<input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value || "")}
                        className="border border-gray-400 pl-10 pr-4 py-2 rounded-lg w-full h-[38px] focus:outline-none focus:shadow-md focus:border-black"
                      />
                    }

                  </div>
                </div>

                {/* Previous/ Recent Record Button */}
                <button
                  onClick={() => console.log("Hii")}
                  className="mr-2 h-[2.35rem] px-5 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-700 transition-colors flex items-center"
                >
                  <span className="font-medium">Recent Bookings</span>
                </button>
              </div>
            </div>

          {/* Filters Section (Visible only when showFilters is true) */}
          {!err && showFilters && (
            <div className="flex justify-end items-center mt-5">
              <div className="flex gap-4 mr-auto">

                {/* Filter By Time Slot */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Time Slot
                  </label>
                  <div className="relative">
                    <select
                      name="TimeSlot"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8 truncate"
                      value={timeSlot}
                      onChange={(e) =>
                        setTimeSlot(e.target.value || "all")
                      }
                    >
                      <option disabled>Time Slot</option>
                      <option value="all">All</option>
                      <option value="Any Time">Any Time</option>
                      <option value="10:00 - 12:00">10:00 - 12:00</option>
                      <option value="12:00 - 14:00">12:00 - 14:00</option>
                      <option value="14:00 - 16:00">14:00 - 16:00</option>
                      <option value="16:00 - 18:00">16:00 - 18:00</option>
                      <option value="18:00 - 20:00">18:00 - 20:00</option>
                    </select>
                  </div>
                </div>

                {/* Status Select */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-600 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="Status"
                      className="border rounded-lg px-5 py-[6px] text-sm appearance-none w-38 pr-8 truncate"
                      value={status}
                      onChange={(e) => setStatus(e.target.value || "all")}
                    >
                      <option disabled>Status</option>
                      <option value="all">All</option>
                      <option value="true">Completed</option>
                      <option value="false">Pending</option>
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

          {/* List of Bookings */}
          <div  className={`flex 
          ${
            showFilters
            ? filterCount > 0 ? "h-[39vh]" : "h-[47vh]"
            : filterCount > 0 ? "h-[50vh]" : "h-[59vh]"
          }`}>
            <div
              className={`inset-0 ${
                data.length > 0 ? "overflow-y-auto" : ""
              } w-full max-h-[500px] rounded-lg`}
            >
              <table
                className={`-ml-5 -mr-14 inset-0 min-w-full table-fixed border-collapse bg-white ${
                data.length > 0 ? "divide-y divide-gray-200" : "w-[805px] overflow-hidden ml-1"
                }`}
              >
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name
                    </th>
                    <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Website
                    </th>
                    <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="min-w-[210px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Person
                    </th>
                    <th className="min-w-[280px] max-w-[280px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th className="min-w-[200px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preferred Date
                    </th>
                    <th className="min-w-[240px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preferred Time-Slot
                    </th>
                    <th className="min-w-[220px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demo Booked On
                    </th>
                    <th className="min-w-[240px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demo Completed On
                    </th>
                    <th className="px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      &nbsp;&nbsp;Status
                    </th>
                    <th className="min-w-[220px] px-12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demo Completed
                    </th>
                  </tr>
                </thead>

                {err && (
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td colSpan="12">
                        <div className="mt-9 ml-15 flex justify-center items-center min-h-[180px]">
                          <div className="flex flex-col items-center justify-center w-96 bg-gray-100 rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                              <i className="fas fa-exclamation-triangle text-red-500 text-3xl"></i>
                            </div>
                            <b className="text-lg text-gray-800 mt-4">
                              Oops! Something went wrong.
                            </b>
                            <p className="text-gray-600 text-sm text-center mt-2">
                              We couldn’t load the content. Please try again
                              later.
                            </p>
                            <p className="text-red-600 font-medium mt-2">
                              {err}
                            </p>
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

                <tbody
                  className={`bg-white ${
                    data.length > 0 ? "divide-y divide-gray-200" : "overflow-hidden"
                  } `}
                >
                  {data.length > 0
                    ? currentRows.map((data, index) => {
                        return (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-12 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {data.isResolved ? <i className="fas fa-check-circle text-lg" style={{ color: 'green' }}/> : <i className="fas fa-times-circle text-lg" style={{ color: 'red' }}/>}
                              &nbsp;&nbsp;&nbsp;
                              {data.name
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </td>

                            <td className="px-12 py-4 whitespace-nowrap text-sm">
                              <a href={`mailto:${data.email}`} className="text-lightBlue-600 hover:underline">
                                <i className="fas fa-envelope mt-2"/>&nbsp;
                                {data.email}
                              </a>
                              {/* <a
                              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${data.email}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lightBlue-600 hover:underline"
                              >
                                <i className="fas fa-envelope mt-2"/>&nbsp;
                                {data.email}
                              </a> */}
                            </td>

                            <td className="px-12 py-4 min-w-[260px] max-w-[260px] break-words truncate whitespace-nowrap overflow-hidden text-ellipsis text-sm text-gray-400">
                              {data.website ? (
                                <a
                                href={data.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                >
                                  <span className="underline text-lightBlue-600">
                                    {data.website}
                                  </span>
                                </a>
                              ) : (
                                  "No website found"
                                )}
                            </td>

                            <td className="px-12 py-4 whitespace-nowrap text-sm text-gray-600">
                              <a href={`tel:${data.mobile}`} className="hover:underline">
                                <i className="fas fa-phone-alt -scale-x-100 text-gray-400"/>&nbsp;
                                {data.mobile}
                              </a>
                            </td>

                            <td className="min-w-[210px] px-12 py-4 whitespace-nowrap text-sm text-gray-500">
                              {data.contactPerson ? data.contactPerson : <span className="text-gray-400">No Contact Person</span>}
                            </td>

                            <td className="min-w-[280px] max-w-[280px] px-12 py-4 text-sm text-gray-500 break-words">
                              <TitleCell query={data.aboutHelp} />
                            </td>

                            <td className="text-center min-w-[200px] px-12 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(data.preferredDate).toLocaleDateString()}
                            </td>

                            <td className="text-center min-w-[240px] px-12 py-4 whitespace-nowrap text-sm text-gray-400 ">
                              {data.preferredTimeSlot 
                                ? <span className={`px-2 py-1 text-xs font-semibold rounded-full ${TimeSlot_Colors[data.preferredTimeSlot]}`}>{ data.preferredTimeSlot }</span>
                                : "No TimeSlot Choosen"
                              }
                            </td>

                            <td className="text-center min-w-[220px] px-12 py-4 whitespace-nowrap text-sm text-gray-600">
                              {new Date(data.demoRequestDate).toLocaleDateString()}
                            </td>

                            <td className="text-center min-w-[240px] px-12 py-4 whitespace-nowrap text-sm text-gray-500">
                              {data.demoResolveDate ? (
                                <span className="ml-2">
                                  {new Date(
                                    data.demoResolveDate
                                  ).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>

                            <td className="text-center px-12 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${Status_Colors[data.isResolved]}`}>
                                {data.isResolved ? "Completed" : "Pending"}
                              </span>
                            </td>

                            <td className="min-w-[220px] text-center px-12 py-4 whitespace-nowrap">
                              <ToggleButton
                                id={data._id}
                                isResolved={data.isResolved}
                                refreshData={refreshData}
                              />
                            </td>
                          </tr>
                        );
                      })
                    : !err && (
                        <tr>
                          <td
                            colSpan="12"
                            className="p-6 text-center text-gray-500 text-base font-medium bg-gray-50 rounded-md mt-4"
                          >
                            <div className={`${showFilters ? "pt-8 pb-8" : "pt-16 pb-17"} flex flex-col items-center space-y-2`}>
                              <FolderOpen className="w-10 h-10 text-gray-400" />
                              <span>No Bookings available.</span>
                            </div>
                          </td>
                        </tr>
                      )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 -mb-1 px-4 py-3">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 pl-7">
              Rows per page:
            </span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="form-select px-5 py-1 rounded-md border-gray-300 shadow-sm 
                    focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-200 
                    focus:ring-opacity-50 text-sm "
            >
              {[10, 50, 100, 200].map((num) => (
                <option key={num} value={num} className="text-gray-700">
                  {num}
                </option>
              ))}
            </select>
          </label>

          <div className="hidden sm:block text-sm text-gray-700">
            <span className="font-semibold">{indexOfFirstRow + 1}</span> -{" "}
            <span className="font-semibold">
              {Math.min(indexOfLastRow, data.length)}
            </span>{" "}
            of <span className="font-semibold">{data.length}</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-200 transition-colors duration-150"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (totalPages <= 5) return true;
              if (page === 1 || page === totalPages) return true;
              return Math.abs(page - currentPage) <= 1;
            })
            .map((page, i, arr) => (
              <React.Fragment key={page}>
                {i > 0 && arr[i - 1] !== page - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}

                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md transition-colors duration-150
                  ${
                    currentPage === page
                      ? "bg-lightBlue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:bg-gray-200 transition-colors duration-150"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
};

ShowBookDemobyOrg.propTypes = {
  sidebarExpanded: PropTypes.bool.isRequired,
};
TitleCell.propTypes = {
  query: PropTypes.string.isRequired,
};
ToggleButton.propTypes = {
  id: PropTypes.instanceOf(Object).isRequired,
  isResolved: PropTypes.bool.isRequired,
  refreshData: PropTypes.func.isRequired,
}

export default ShowBookDemobyOrg;
