import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import {
  fetchAllParticipants,
  fetchUserEvents,
  updateRegistrationStatus,
  selectAllParticipants,
  selectFilteredParticipants,
  selectParticipantsStatus,
  selectParticipantsError,
  selectParticipantFilters,
  selectParticipantActiveFilters,
  selectParticipantSearchQuery,
  selectParticipantPagination,
  selectParticipantModals,
  selectSelectedParticipant,
  selectSelectedUser,
  selectUserEvents,
  setFilters,
  setActiveFilters,
  setSearchQuery,
  setPagination,
  setModal,
  setSelectedParticipant,
  setSelectedUser,
  clearFilters,
  filterParticipants
} from '../../redux/Admin/ParticipantsManage/participantSlice';
import {
  User, Calendar, Clock, Trophy, Gift, 
  Users, Star, ArrowRight, Medal, 
  Zap, Award, ChevronDown, BarChart2, 
  DollarSign, Plus, Edit, Trash2, 
  Shield, BadgeCheck, Coins, Info, 
  Percent, Check, X, ChevronRight, Mail
} from 'lucide-react';
import ParticipantDetailsModal from '../../components/Admin/Modals/ParticipantDetailModal';
import UserEventsModal from '../../components/Admin/Modals/UserEventsModal';
import StatsSection from '../../components/Admin/Cards/StatsSection';
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';

const Participants = () => {
  const dispatch = useDispatch();

  // Selectors
  const allParticipants = useSelector(selectAllParticipants);
  const filteredParticipants = useSelector(selectFilteredParticipants);
  const isLoading = useSelector(selectParticipantsStatus) === 'loading';
  const error = useSelector(selectParticipantsError);
  const filters = useSelector(selectParticipantFilters);
  const activeFilters = useSelector(selectParticipantActiveFilters);
  const searchQuery = useSelector(selectParticipantSearchQuery);
  const pagination = useSelector(selectParticipantPagination);
  const modals = useSelector(selectParticipantModals);
  const selectedParticipant = useSelector(selectSelectedParticipant);
  const selectedUser = useSelector(selectSelectedUser);
  const userEvents = useSelector(selectUserEvents(selectedUser?._id));

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchAllParticipants()).unwrap();
      } catch (error) {
        toast.error(error.message || 'Failed to fetch participants');
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter effect
  useEffect(() => {
    dispatch(filterParticipants());
  }, [dispatch, filters, searchQuery]);

  // Handler functions
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ [name]: value }));
  };

  const handleStartDateChange = (date) => {
    dispatch(setFilters({ startDate: date }));
  };

  const handleEndDateChange = (date) => {
    dispatch(setFilters({ endDate: date }));
  };

  const handleApplyFilters = () => {
    dispatch(setActiveFilters({
      status: filters.status !== 'all',
      event: filters.eventId !== 'all',
      dateRange: !!(filters.startDate && filters.endDate),
      search: !!searchQuery
    }));
    dispatch(setPagination({ currentPage: 1 }));
    dispatch(setModal({ isFilterOpen: false }));
    dispatch(filterParticipants());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
    dispatch(setActiveFilters({
      status: false,
      event: false,
      dateRange: false,
      search: false
    }));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const openDetailsModal = (participant) => {
    dispatch(setSelectedParticipant(participant));
    dispatch(setModal({ isDetailsOpen: true }));
  };

  const openUserEventsModal = async (userId, userName) => {
    try {
      dispatch(setSelectedUser({ _id: userId, name: userName }));
      await dispatch(fetchUserEvents(userId)).unwrap();
      dispatch(setModal({ isUserEventsOpen: true }));
    } catch (error) {
      toast.error(error.message || 'Failed to fetch user events');
    }
  };

  const handleStatusUpdate = async (registrationId, status) => {
    const loadingToast = toast.loading('Updating registration status...');
    try {
      await dispatch(updateRegistrationStatus({ registrationId, status })).unwrap();
      toast.success('Status updated successfully', { id: loadingToast });
      dispatch(fetchAllParticipants());
    } catch (error) {
      toast.error(error.message || 'Failed to update status', { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Registered: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
      Completed: "bg-blue-100 text-blue-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  // Calculate current items for pagination
  const currentItems = filteredParticipants?.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  ) || [];

  // Loading state
  if (isLoading && !filteredParticipants?.length) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl bg-red-100 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 overflow-hidden">
      <StatsSection isDashboard={false} pageType="events" />

      <div className="px-8 mx-4 -mt-12">
        <TableFilters
          filterType="participants"
          isFilterOpen={modals?.isFilterOpen || false}
          setIsFilterOpen={(value) => dispatch(setModal({ isFilterOpen: value }))}
          tempFilters={filters}
          handleFilterChange={handleFilterChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          applyFilters={handleApplyFilters}
          clearFilters={handleClearFilters}
          searchQuery={searchQuery}
          setSearchQuery={(value) => dispatch(setSearchQuery(value))}
          activeFilters={activeFilters}
          setActiveFilters={(filters) => dispatch(setActiveFilters(filters))}
          pageTitle="Manage Participants"
          showAddButton={false}
        />

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
            {/* // In Participants.js, update the table columns: */}
<thead className="bg-gray-50 border-b">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-200">
  {currentItems.length === 0 ? (
    <tr>
      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
        No participants found
      </td>
    </tr>
  ) : (
    currentItems.map((participant) => (
      <tr key={participant._id} className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <User className="text-lightBlue-600" size={18} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{participant.userId.name}</div>
              <div className="text-xs text-gray-500">{participant.userId.email}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{participant.userId.mobile || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900 capitalize">{participant.userId.gender || 'N/A'}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => openUserEventsModal(participant.userId._id, participant.userId.name)}
              className="text-lightBlue-600 hover:text-blue-900"
            >
              View Events
            </button>
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
        </div>

        {filteredParticipants?.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={Math.ceil(filteredParticipants.length / pagination.itemsPerPage)}
              itemsPerPage={pagination.itemsPerPage}
              setItemsPerPage={(value) => dispatch(setPagination({ itemsPerPage: value }))}
              setCurrentPage={(value) => dispatch(setPagination({ currentPage: value }))}
              filteredItems={filteredParticipants}
              indexOfFirstItem={(pagination.currentPage - 1) * pagination.itemsPerPage}
              indexOfLastItem={Math.min(pagination.currentPage * pagination.itemsPerPage, filteredParticipants.length)}
            />
          </div>
        )}

        {/* Participant Details Modal */}
        {modals?.isDetailsOpen && selectedParticipant && (
          <ParticipantDetailsModal 
            isOpen={modals.isDetailsOpen}
            onClose={() => {
              dispatch(setModal({ isDetailsOpen: false }));
              dispatch(setSelectedParticipant(null));
            }}
            participant={selectedParticipant}
            onViewUserEvents={openUserEventsModal}
            onUpdateStatus={handleStatusUpdate}
          />
        )}

        {/* User Events Modal */}
        {modals?.isUserEventsOpen && selectedUser && (
          <UserEventsModal
            isOpen={modals.isUserEventsOpen}
            onClose={() => {
              dispatch(setModal({ isUserEventsOpen: false }));
              dispatch(setSelectedUser(null));
            }}
            user={selectedUser}
            events={userEvents}
          />
        )}
      </div>
    </div>
  );
};

export default Participants;
