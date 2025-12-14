import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  ChevronDown,
  ChevronUp,
  PlusCircle,
  Star,
  ThumbsUp,
  Clock,
  ThumbsDown,
  UserCheck,
  Building2,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';
import {
  fetchOrganizationUsersFeedbacks,
  deleteOrganizationUsersFeedback,
  updateOrganizationUsersFeedback,
  updateOrganizationUsersFeedbackStatus,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  clearFilters,
} from "../../../redux/Organization/feedbacks/organizationFeedbackSlice";
import Pagination from "../../../components/Organization/TableFunctions/Pagination";
import OrgUserFeedbackTable from "../../../components/Organization/Tables/FeedbackTable/OrgUserFeedbackTable";
import OrganizationFeedbackFormModal from "../../../components/Organization/Modals/OrganizationFeedbackFormModal";
import ConfirmationModal from "../../../components/Organization/Modals/ConfirmationModal";
import Loader from "../../../components/Common/Loader";
import { Filter, X, SearchIcon } from "lucide-react";
import { getAppliedFiltersCount, getAppliedFiltersText } from "../../../utils/filterFunctions";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Dashboard from "../../../components/Organization/Dashboards/Dashboard";
import StatsSection from "../../../components/Organization/Cards/StatsSection";
import { useOrganizationDashboard } from "../../../hooks/useOrganizationDashbaord";

const OrganizationUsersFeedbacks = () => {
  const [refreshDependency, setRefreshDependency] = useState(0);
  useOrganizationDashboard(refreshDependency);
  const dispatch = useDispatch();
  const {
    feedbacks,
    loading,
    currentPage,
    totalPages,
    itemsPerPage,
    searchTerm,
    startDate,
    endDate,
  } = useSelector((state) => state.organization.userFeedbacks);

  const [isFeedbackFormModalOpen, setFeedbackFormModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [feedbackToEdit, setFeedbackToEdit] = useState(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [localStartDate, setLocalStartDate] = useState(startDate ? new Date(startDate) : null);
  const [localEndDate, setLocalEndDate] = useState(endDate ? new Date(endDate) : null);
  const orgName = localStorage.getItem("orgName");
  const userId = localStorage.getItem("user");

  useEffect(() => {
    dispatch(
      fetchOrganizationUsersFeedbacks({
        orgName,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        startDate,
        endDate,
      })
    );
  }, [dispatch, orgName, currentPage, itemsPerPage, searchTerm, startDate, endDate]);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteOrganizationUsersFeedback(id)).unwrap();
      toast.success("Feedback deleted successfully");
      setRefreshDependency((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to delete feedback:", error);
    } finally {
      setConfirmationModalOpen(false);
    }
  };

  const handleDeleteClick = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setConfirmationModalOpen(true);
  };

  const handleEditClick = (feedback) => {
    setFeedbackToEdit(feedback);
    setFeedbackFormModalOpen(true);
  };

  const handleFormSubmit = async (feedbackData) => {
    if (feedbackToEdit) {
      try {
        await dispatch(
          updateOrganizationUsersFeedback({
            id: feedbackToEdit._id,
            feedbackData,
          })
        ).unwrap();
        toast.success("Feedback updated successfully");
      } catch (error) {
        console.error("Failed to update feedback:", error);
      } finally {
        setFeedbackFormModalOpen(false);
        setFeedbackToEdit(null);
      }
    }
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
    setLocalStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setLocalEndDate(date);
  };

  const clearAllFilters = () => {
    setLocalStartDate(null);
    setLocalEndDate(null);
    dispatch(clearFilters());
    dispatch(setCurrentPage(1));
  };

  const handleApplyFilters = () => {
    dispatch(setStartDate(localStartDate));
    dispatch(setEndDate(localEndDate));
    dispatch(setCurrentPage(1));
  };

  const appliedFiltersCount = getAppliedFiltersCount({ startDate, endDate });
  const appliedFiltersText = getAppliedFiltersText({ startDate, endDate });

  const feedbackToDeleteDetails = feedbacks.find(
    (feedback) => feedback._id === feedbackToDelete
  );

  return (
    <div className="relative">

      {/* <Dashboard type="organization-user-feedback" showAllCards={false} showCardsTable={false} /> */}
      <div className="mt-18">
      <StatsSection isDashboard={false} pageType="userFeedbacks" stats={feedbacks} />

      </div>
      <div className="mx-auto w-full md:w-[95%] px-2 md:px-0 z-50">
        <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg z-0 -mt-12">
          {/* Header Section - Optimized for both mobile and desktop */}
          <div className="bg-gray-50 mt-0 px-4 py-4 md:px-6 md:py-3 rounded-lg border border-gray-200">
            {/* Mobile Layout - Stacked */}
            <div className="md:hidden flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <MessageSquare className="mr-2 text-gray-600" size={20} />
                  Manage Feedbacks
                </h2>
                <button
                  onClick={() => setFilterOpen(!isFilterOpen)}
                  className="h-10 px-3 rounded-lg border border-gray-400 
                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lightBlue-600 
                    transition-colors flex items-center space-x-1"
                >
                  <Filter size={16} />
                  {appliedFiltersCount > 0 && (
                    <span className="ml-1 bg-lightBlue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {appliedFiltersCount}
                    </span>
                  )}
                   {isFilterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full h-10 !pl-8 pr-8 rounded-lg border border-gray-300 
                    focus:outline-none focus:ring-2 focus:ring-lightBlue-500 
                    text-sm placeholder-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => dispatch(setSearchTerm(""))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Layout - Single Line */}
            <div className="hidden md:flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <MessageSquare className="mr-2 text-gray-600" size={20} />
                Manage Feedbacks
              </h2>
              
              <div className="flex items-center space-x-4">
              <button
                  onClick={() => setFilterOpen(!isFilterOpen)}
                  className="h-9 px-4 mr-4 rounded-lg border border-gray-400 
                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lightBlue-600 
                    transition-colors flex items-center space-x-1"
                >
                  <Filter size={16} className="mr-2"/>
                  {appliedFiltersCount > 0 && (
                    <span className="ml-1 bg-lightBlue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {appliedFiltersCount}
                    </span>
                  )}
                  {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <div className="relative w-70">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full h-9 !pl-8 pr-7 rounded-lg border border-gray-300 
                      focus:outline-none focus:ring-2 focus:ring-lightBlue-500 
                      text-sm placeholder-gray-500"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => dispatch(setSearchTerm(""))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

               
              </div>
            </div>
          </div>

          {/* Filter Section */}
          {isFilterOpen && (
  <div className="bg-gray-50 shadow-inner mt-0 overflow-hidden transition-max-height duration-300 ease-in-out max-h-96 p-4 md:p-6 z-50">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full space-y-4 md:space-y-0">
      {/* Date Range filter */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
        <div className="w-full md:w-60">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <DatePicker
            selected={localStartDate}
            onChange={handleStartDateChange}
            selectsStart
            startDate={localStartDate}
            endDate={localEndDate}
            placeholderText="Start Date"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 h-[38px] text-sm"
          />
        </div>
        <div className="w-full md:w-60">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <DatePicker
            selected={localEndDate}
            onChange={handleEndDateChange}
            selectsEnd
            startDate={localStartDate}
            endDate={localEndDate}
            minDate={localStartDate}
            placeholderText="End Date"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 h-[38px] text-sm"
          />
        </div>
      </div>

      {/* Clear & Apply buttons aligned to right */}
      <div className="flex gap-x-4 w-full md:w-auto justify-end items-end">
        <button
          onClick={clearAllFilters}
          className="flex items-center px-4 py-2 h-[42px] rounded-lg border border-gray-300 hover:bg-gray-50 text-sm md:text-base"
        >
          <X size={14} className="mr-1" />
          Clear
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-4 py-2 h-[42px] rounded-lg bg-lightBlue-600 text-white hover:bg-lightBlue-700 text-sm md:text-base"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
)}


          {/* Applied Filters */}
          {appliedFiltersCount > 0 && (
            <div className="bg-gray-50 px-4 py-2 mt-2 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-2 mb-2 md:mb-0">
                <span className="text-sm text-gray-600">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {appliedFiltersText && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {appliedFiltersText}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center self-end md:self-auto"
              >
                <X size={14} className="mr-1" />
                Clear All
              </button>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <Loader />
          ) : (
            <div className="pt-4 md:pt-12 -mt-4 md:-mt-12 overflow-x-auto">
              <OrgUserFeedbackTable
                feedbacks={feedbacks}
                onDelete={handleDeleteClick}
                onEdit={handleEditClick}
              />
              <div className="px-2 md:px-0">
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
          <OrganizationFeedbackFormModal
            isOpen={isFeedbackFormModalOpen}
            onClose={() => setFeedbackFormModalOpen(false)}
            onSubmit={handleFormSubmit}
            feedbackData={feedbackToEdit}
          />

          <ConfirmationModal
            isOpen={isConfirmationModalOpen}
            onClose={() => setConfirmationModalOpen(false)}
            onConfirm={() => handleDelete(feedbackToDelete)}
            message={`Are you sure you want to delete feedback from ${
              feedbackToDeleteDetails?.userId?.name || "this user"
            }?`}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationUsersFeedbacks;