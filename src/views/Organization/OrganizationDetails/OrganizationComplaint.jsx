// OrganizationComplaint.js

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  PlusCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import {
  fetchOrganizationComplaints,
  registerOrganizationComplaint,
  updateOrganizationComplaint,
  deleteOrganizationComplaint,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setStartDate,
  setEndDate,
  clearFilters,
} from "../../../redux/Organization/complaints/complaintsSlice";
import Pagination from "../../../components/Organization/TableFunctions/Pagination";
import OrganizationComplaintTable from "../../../components/Organization/Tables/ComplaintTable/OrganizationComplaintTable";
import OrganizationComplaintModal from "../../../components/Organization/Modals/OrganizationComplaintModal";
import ConfirmationModal from "../../../components/Organization/Modals/ConfirmationModal";
import Loader from "../../../components/Common/Loader";
import toast from "react-hot-toast";
import Dashboard from '../../../components/Organization/Dashboards/Dashboard';
import StatsSection from "../../../components/Organization/Cards/StatsSection";
import { useOrganizationDashboard } from "../../../hooks/useOrganizationDashbaord";


const OrganizationComplaint = () => {
  // useOrganizationDashboard();
      const [refreshTrigger, setRefreshTrigger] = useState(0);
      useOrganizationDashboard(refreshTrigger); 
  
  const dispatch = useDispatch();
  const { complaints, loading, currentPage, totalPages, itemsPerPage, searchTerm, startDate, endDate } =
    useSelector((state) => state.organization.complaints);

  const [isAddComplaintModalOpen, setAddComplaintModalOpen] = useState(false);
  const [isEditComplaintModalOpen, setEditComplaintModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintToDelete, setComplaintToDelete] = useState(null);
  const orgName = localStorage.getItem("orgName");
  const org = JSON.parse(localStorage.getItem("org"));

  useEffect(() => {
    dispatch(
      fetchOrganizationComplaints({
        orgName,
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
        startDate,
        endDate,
      })
    );
  }, [dispatch, orgName, currentPage, itemsPerPage, searchTerm, startDate, endDate]);

  const handleAddComplaint = (complaintData) => {
    dispatch(registerOrganizationComplaint({ ...complaintData, orgName, organizationId: org._id }))
      .unwrap()
      .then(() => {
        toast.success("Complaint submitted successfully!");
       setRefreshTrigger(prev => prev + 1);
      })
      .catch((err) => toast.error(err || "Failed to submit complaint"));
  };

  const handleEditComplaint = (complaintData) => {
    dispatch(updateOrganizationComplaint({ complaintId: selectedComplaint._id, complaintData }))
      .unwrap()
      .then(() => {
        toast.success("Complaint updated successfully!");
        setSelectedComplaint(null);
        setEditComplaintModalOpen(false);
      })
      .catch((err) => toast.error(err || "Failed to update complaint"));
  };

  const handleDeleteComplaint = async () => {
    try {
      await dispatch(deleteOrganizationComplaint(complaintToDelete)).unwrap();
      toast.success("Complaint deleted successfully");
      setRefreshTrigger(prev => prev + 1);
      setDeleteConfirmationModalOpen(false);
      dispatch(
        fetchOrganizationComplaints({
          orgName,
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          startDate,
          endDate,
        })
      );
    } catch (error) {
      console.error("Failed to delete complaint:", error);
      toast.error("Failed to delete complaint");
    }
  };

  const handleOpenEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setEditComplaintModalOpen(true);
  };

  const handleOpenDeleteModal = (complaintId) => {
    setComplaintToDelete(complaintId);
    setDeleteConfirmationModalOpen(true);
  };

  return (
    <div className="relative">
      {/* <Dashboard type="organization-complaint" showAllCards={false} showCardsTable={false} /> */}
      <div className="mt-18">
      <StatsSection isDashboard={false} pageType="complaints" />
      </div>

      <div className="mx-auto w-[95%] z-50">
        <div className="relative flex flex-col min-w-0 break-words w-full rounded-lg -mt-28">
          {/* Header */}
          <div className="bg-gray-50 mt-16 px-6 py-2 h-19 rounded-lg lg:flex sm:my-1 sm:mb-2 items-center z-0 justify-between border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center flex-grow">
            <AlertCircle className="mr-2 text-red-600" size={24} />
              Manage Complaints
            </h2>
            <button
              onClick={() => setAddComplaintModalOpen(true)}
              className="flex items-center bg-lightBlue-600 text-white px-4 py-2 rounded-lg hover:bg-lightBlue-700 transition-colors"
            >
              <PlusCircle size={18} className="mr-2" />
              Add Complaint
            </button>
          </div>

          {/* Complaint Table and Pagination */}
          {loading ? (
            <Loader />
          ) : (
            <div className="pt-16 -mt-17">
              <OrganizationComplaintTable
                complaints={complaints}
                onDelete={handleOpenDeleteModal}
                onEdit={handleOpenEditModal}
              />
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

      {/* Add Complaint Modal */}
      <OrganizationComplaintModal
        isOpen={isAddComplaintModalOpen}
        onClose={() => setAddComplaintModalOpen(false)}
        onSubmit={handleAddComplaint}
      />

      {/* Edit Complaint Modal */}
      <OrganizationComplaintModal
        isOpen={isEditComplaintModalOpen}
        onClose={() => setEditComplaintModalOpen(false)}
        onSubmit={handleEditComplaint}
        complaintData={selectedComplaint}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteConfirmationModalOpen}
        onClose={() => setDeleteConfirmationModalOpen(false)}
        onConfirm={handleDeleteComplaint}
        message="Are you sure you want to delete this complaint? This action cannot be undone."
      />
    </div>
  );
};

export default OrganizationComplaint;
