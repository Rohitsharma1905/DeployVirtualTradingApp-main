import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Users,
  Filter,
  X,
  SearchIcon
} from 'lucide-react';
import {
  fetchOrganizationUsers,
  deleteOrganizationUser,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  setGender,
  clearFilters,
} from "../../../redux/Organization/users/organizationUsersSlice";
import Pagination from "../../../components/Organization/TableFunctions/Pagination";
import FilterComponent from "../../../components/Organization/TableFunctions/FilterComponent";
import OrgUserTable from "../../../components/Organization/Tables/UserTable/OrgUserTable";
import OrganizationUserRegistration from "./Models/OrganizationUserRegistrationUpdateModal";
import ConfirmationModal from "../../../components/Organization/Modals/ConfirmationModal";
import Loader from "../../../components/Common/Loader";
import StatsSection from "../../../components/Organization/Cards/StatsSection";
import { useOrganizationDashboard } from "../../../hooks/useOrganizationDashbaord";
import { getAppliedFiltersCount, getAppliedFiltersText } from "../../../utils/filterFunctions";

const OrganizationUsers = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  useOrganizationDashboard(refreshTrigger);
  
  const dispatch = useDispatch();
  const {
    users: studentList,
    loading,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    startDate,
    endDate,
    gender,
  } = useSelector((state) => state.organization.users);

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const orgName = localStorage.getItem("orgName");

  useEffect(() => {
    dispatch(
      fetchOrganizationUsers({
        orgName,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        startDate,
        endDate,
        gender,
      })
    );
  }, [dispatch, orgName, currentPage, itemsPerPage, searchTerm, startDate, endDate, gender]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOrganizationUser(id)).unwrap();
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setModalOpen(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setConfirmationModalOpen(true);
  };

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };

  const handleItemsPerPageChange = (event) => {
    dispatch(setItemsPerPage(Number(event.target.value)));
    dispatch(setCurrentPage(1));
  };

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
    dispatch(setCurrentPage(1));
  };

  const handleStartDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      dispatch(setStartDate(date.toISOString()));
    } else {
      dispatch(setStartDate(null));
    }
  };

  const handleEndDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      dispatch(setEndDate(date.toISOString()));
    } else {
      dispatch(setEndDate(null));
    }
  };

  const handleGenderChange = (value) => {
    dispatch(setGender(value));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    dispatch(setCurrentPage(1));
  };

  const handleApplyFilters = () => {
    dispatch(setCurrentPage(1));
    dispatch(
      fetchOrganizationUsers({
        orgName,
        page: 1,
        limit: itemsPerPage,
        search: searchTerm,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        gender,
      })
    );
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const appliedFiltersCount = getAppliedFiltersCount({ startDate, endDate, gender });
  const appliedFiltersText = getAppliedFiltersText({ startDate, endDate, gender });

  return (
    <div className="relative">
      <div className="mt-18">
        <StatsSection isDashboard={false} pageType="users" />
      </div>


      <div className="mx-auto w-full md:w-[95%] px-4 md:px-0">
        <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg z-0 -mt-12">
          {/* Header Section - Updated to match OrganizationUsersFeedbacks */}
          <div className="bg-gray-50 mt-0 px-4 md:px-6 py-4 rounded-lg border border-gray-200">
            {/* Desktop Layout - Single Row */}
            <div className="hidden md:flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Users className="mr-2 text-gray-600" size={24} />
                Manage Users
              </h2>


              
              <div className=" flex items-center gap-4 w-2/3 justify-end items-end">
              
                {/* Filter Button */}
                <button
                  onClick={() => setFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-center h-10 px-4 rounded-lg border border-gray-300 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lightBlue-600 transition-colors"
                >
                  <Filter size={16} className="mr-2" />
                 
                  {appliedFiltersCount > 0 && (
                    <span className="ml-1 bg-lightBlue-600 text-white rounded-full px-2.5 py-0.5 text-xs">
                      {appliedFiltersCount}
                    </span>
                  )}
                    {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {/* Search Bar */}
               
                  <div className="relative w-70 ">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 
                   focus:outline-none focus:ring-2 focus:ring-lightBlue-500 
                   text-sm placeholder-gray-500"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => dispatch(setSearchTerm(""))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
               

              

                {/* Add User Button */}
                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setModalOpen(true);
                  }}
                  className="flex items-center justify-center h-10 px-4 rounded-lg bg-lightBlue-600 text-white 
                     hover:bg-lightBlue-700 focus:outline-none focus:ring-2 focus:ring-lightBlue-800 transition-colors"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add User
                </button>
              </div>
            </div>


            {/* Mobile Layout - Stacked */}
            <div className="md:hidden">
              <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                <Users className="mr-2 text-gray-600" size={24} />
                Manage Users
              </h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative w-full border border-gray-200 rounded-lg 
                    focus-within:border-gray-300 focus-within:ring-1 
                    focus-within:ring-lightBlue-500 transition-colors">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-lightBlue-500 
                 text-sm placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => dispatch(setSearchTerm(""))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterOpen(!isFilterOpen)}
                  className="flex items-center justify-center h-10 px-4 rounded-lg border border-gray-300 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lightBlue-600 transition-colors"
                >
                  <Filter size={16} className="mr-2" />
                 
                  {appliedFiltersCount > 0 && (
                    <span className="ml-1 bg-lightBlue-600 text-white rounded-full px-2 py-0.5 text-xs">
                      {appliedFiltersCount}
                    </span>
                  )}
                    {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                <button
                  onClick={() => {
                    setSelectedStudent(null);
                    setModalOpen(true);
                  }}
                  className="flex items-center justify-center h-10 px-4 rounded-lg bg-lightBlue-600 text-white 
                     hover:bg-lightBlue-700 focus:outline-none focus:ring-2 focus:ring-lightBlue-800 transition-colors"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
           
              <FilterComponent
                isFilterOpen={isFilterOpen}
                setFilterOpen={setFilterOpen}
                startDate={startDate}
                onStartDateChange={handleStartDateChange}
                endDate={endDate}
                onEndDateChange={handleEndDateChange}
                gender={gender}
                onGenderChange={handleGenderChange}
                onClearFilters={clearAllFilters}
                onApplyFilters={handleApplyFilters}
              />
          
          )}

          {/* Active Filters Display */}
          {appliedFiltersCount > 0 && (
  <div className="bg-gray-50 px-4 md:px-6 py-2 rounded-lg flex flex-row flex-wrap items-center justify-between w-full">
    <div className="flex items-center flex-wrap gap-2">
      <span className="text-sm text-gray-600">Active filters:</span>
      {appliedFiltersText && (
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {appliedFiltersText}
        </span>
      )}
    </div>

    <button
      onClick={clearAllFilters}
      className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
    >
      <X size={14} className="mr-1" />
      Clear all
    </button>
  </div>
)}


          {/* Table Section */}
          {loading ? (
            <Loader />
          ) : (
            <div className="mt-0">
              <OrgUserTable
                users={studentList}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                expandedRow={expandedRow}
                toggleRow={toggleRow}
              />
              
              {/* Pagination */}
              <div className="mt-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </div>
            </div>
          )}

          {/* Modals */}
          <OrganizationUserRegistration
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            initialValues={selectedStudent}
            refreshStudents={() => {
              dispatch(fetchOrganizationUsers({
                orgName,
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm,
                startDate,
                endDate,
                gender,
              }));
              setRefreshTrigger(prev => prev + 1);
            }}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setConfirmationModalOpen(false)}
            onConfirm={() => handleDelete(studentToDelete._id)}
            message={`Are you sure you want to delete ${studentToDelete?.name}?`}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationUsers;