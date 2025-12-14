
// working ---

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
  fetchOrganizationFeedback,
  registerOrganizationFeedback,
  updateOrganizationFeedback,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  clearFilters,
  deleteOrganizationFeedback
} from "../../../redux/Organization/feedbacks/organizationUsersFeedbackSlice";
import Pagination from "../../../components/Organization/TableFunctions/Pagination";
import OrganizationFeedbackTable from "../../../components/Organization/Tables/FeedbackTable/OrganizationFeedbackTable";
import OrganizationFeedbackModal from "../../../components/Organization/Modals/OrganizationFeedbackModal";
import ConfirmationModal from "../../../components/Organization/Modals/ConfirmationModal";
import Loader from "../../../components/Common/Loader";
import { Filter } from "lucide-react";
import toast from "react-hot-toast";
import Dashboard from '../../../components/Organization/Dashboards/Dashboard';
import StatsSection from "../../../components/Organization/Cards/StatsSection";
import { useOrganizationDashboard } from "../../../hooks/useOrganizationDashbaord";

const OrganizationFeedback = () => {
  // useOrganizationDashboard();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    useOrganizationDashboard(refreshTrigger); 

  const dispatch = useDispatch();
  const { feedbacks, loading, currentPage, totalPages, itemsPerPage, searchTerm, startDate, endDate } =
    useSelector((state) => state.organization.feedbacks);

  const [isAddFeedbackModalOpen, setAddFeedbackModalOpen] = useState(false);
  const [isEditFeedbackModalOpen, setEditFeedbackModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const orgName = localStorage.getItem("orgName");
  const org = JSON.parse(localStorage.getItem("org"));


  useEffect(() => {
    dispatch(
      fetchOrganizationFeedback({
        orgName,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        startDate,
        endDate,
      })
    );
  }, [dispatch, orgName, currentPage, itemsPerPage, searchTerm, startDate, endDate]);

  const handleAddFeedback = (feedbackData) => {
    dispatch(registerOrganizationFeedback({ ...feedbackData, orgName, organizationId:org._id }))
      .unwrap()
      .then(() => {
        toast.success("Feedback submitted successfully!");
       setRefreshTrigger(prev => prev + 1);
      })
      
      .catch((err) => toast.error(err || "Failed to submit feedback"));
  };

  const handleEditFeedback = (feedbackData) => {
    dispatch(updateOrganizationFeedback({ feedbackId: selectedFeedback._id, feedbackData }))
      .unwrap()
      .then(() => {
        toast.success("Feedback updated successfully!");
        setSelectedFeedback(null);
        setEditFeedbackModalOpen(false);
      })
      .catch((err) => toast.error(err || "Failed to update feedback"));
  };

  const handleDeleteFeedback = async () => {
    try {
      await dispatch(deleteOrganizationFeedback(feedbackToDelete)).unwrap();
      toast.success("Feedback deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeleteConfirmationModalOpen(false);
      dispatch(
        fetchOrganizationFeedback({
          orgName,
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          startDate,
          endDate,
        })
      );
      
    } catch (error) {
      console.error("Failed to delete feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const handleOpenEditModal = (feedback) => {
    setSelectedFeedback(feedback);
    setEditFeedbackModalOpen(true);
  };

  const handleOpenDeleteModal = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setDeleteConfirmationModalOpen(true);
  };

  return (
    <div className="relative">
      {/* <Dashboard type="organization-feedback" showAllCards={false} showCardsTable={false} /> */}
      <div className="mt-18">
      <StatsSection isDashboard={false} pageType="feedbacks" />
      </div>

      <div className="mx-auto w-[95%] z-50">
        <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg -mt-28">
          {/* Header with Search and Filters */}
          <div className="bg-gray-50 mt-16 px-6 py-2 h-19 rounded-lg lg:flex items-center z-0 justify-between border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center flex-grow">
            <MessageSquare className="mr-2 text-gray-600" size={24} />
              Manage Feedbacks
            </h2>
            <button
              onClick={() => setAddFeedbackModalOpen(true)}
              className="flex items-center bg-lightBlue-600 text-white sm:my-2 px-4 py-2 rounded-lg hover:bg-lightBlue-700 transition-colors"
            >
                <PlusCircle size={18} className="mr-2" />
              Add Feedback
            </button>
          </div>

          {/* Feedback Table and Pagination */}
          {loading ? (
            <Loader />
          ) : (
            <div className="pt-16 -mt-17">
              <OrganizationFeedbackTable feedbacks={feedbacks} onDelete={handleOpenDeleteModal} onEdit={handleOpenEditModal} />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={(page) => dispatch(setCurrentPage(page))}
                onItemsPerPageChange={(e) => dispatch(setItemsPerPage(Number(e.target.value)))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Feedback Modal */}
      <OrganizationFeedbackModal
        isOpen={isAddFeedbackModalOpen}
        onClose={() => setAddFeedbackModalOpen(false)}
        onSubmit={handleAddFeedback}
      />

      {/* Edit Feedback Modal */}
      <OrganizationFeedbackModal
        isOpen={isEditFeedbackModalOpen}
        onClose={() => setEditFeedbackModalOpen(false)}
        onSubmit={handleEditFeedback}
        feedbackData={selectedFeedback}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        onConfirm={handleDeleteFeedback}
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </div>
  );
};

export default OrganizationFeedback;