import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  selectEvents,
  selectFilteredEvents,
  selectEventsStatus,
  selectEventsError,
  selectFilters,
  selectActiveFilters,
  selectSearchQuery,
  selectPagination,
  selectModals,
  setFilters,
  setActiveFilters,
  setSearchQuery,
  setPagination,
  setModal,
  clearFilters,
  filterEvents
} from '../../redux/Admin/EventManage/eventSlice';
import {
  Calendar, Clock, Trophy, Gift, Users, Star, 
  ArrowRight, Medal, Zap, Award, ChevronDown, 
  BarChart2, DollarSign, Plus, Edit, 
  Trash2, Shield, BadgeCheck, Coins, Info, Percent,
  Check, X, ChevronRight
} from 'lucide-react';
import EventModal from '../../components/Admin/Modals/EventModal';
import EventDetailsModal from '../../components/Admin/Modals/EventDetailsModal';
import StatsSection from '../../components/Admin/Cards/StatsSection';
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import ConfirmationModal from "../../components/Admin/Modals/ConformationModal";
import { fetchDashboardStats } from '../../redux/User/userSlice';

const AdminEventsPage = () => {
  const dispatch = useDispatch();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selectors
  const events = useSelector(selectEvents);
  const filteredEvents = useSelector(selectFilteredEvents);
  const isLoading = useSelector(selectEventsStatus) === 'loading';
  const error = useSelector(selectEventsError);
  const filters = useSelector(selectFilters);
  const activeFilters = useSelector(selectActiveFilters);
  const searchQuery = useSelector(selectSearchQuery);
  const pagination = useSelector(selectPagination);
  const modals = useSelector(selectModals);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchEvents()).unwrap();
      } catch (error) {
        toast.error(error.message || 'Failed to fetch events');
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter effect
  useEffect(() => {
    dispatch(filterEvents());
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
      dateRange: !!(filters.startDate && filters.endDate),
      search: !!searchQuery
    }));
    dispatch(setPagination({ currentPage: 1 }));
    dispatch(setModal({ isFilterOpen: false }));
    dispatch(filterEvents());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
    dispatch(setActiveFilters({
      status: false,
      dateRange: false,
      search: false
    }));
    dispatch(setPagination({ currentPage: 1 }));
  };

  const handleDeleteClick = (event) => {
    if (!event?._id) {
      toast.error('Invalid event selected');
      return;
    }
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent?._id) return;

    const loadingToast = toast.loading('Deleting event...');
    try {
      await dispatch(deleteEvent(selectedEvent._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedEvent(null);
      toast.success('Event deleted successfully', { id: loadingToast });
      await Promise.all([
        dispatch(fetchEvents()),
        dispatch(fetchDashboardStats())
      ]);
    } catch (error) {
      toast.error(error.message || 'Failed to delete event', { id: loadingToast });
    }
  };

const handleCreateEvent = async (eventData) => {
  const loadingToast = toast.loading('Creating event...');
  try {
    const response = await dispatch(createEvent(eventData)).unwrap();
    toast.success('Event created successfully', { id: loadingToast });
    dispatch(setModal({ isFormOpen: false }));
    await Promise.all([
      dispatch(fetchEvents()),
      dispatch(fetchDashboardStats())
    ]);
  } catch (error) {
    toast.dismiss(loadingToast);
    
    if (error.payload?.errors) {
      // Group errors by field for better display
      const fieldErrors = {};
      error.payload.errors.forEach(err => {
        if (!fieldErrors[err.field]) {
          fieldErrors[err.field] = [];
        }
        fieldErrors[err.field].push(err.message);
      });

      // Display grouped errors
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        toast.error(`${field}: ${messages.join(', ')}`, {
          duration: 6000,
          position: 'top-right'
        });
      });
    } else {
      toast.error(error.payload?.message || error.message || 'Failed to create event');
    }
  }
};

  const handleUpdateEvent = async (eventData) => {
    if (!selectedEvent?._id) return;

    const loadingToast = toast.loading('Updating event...');
    try {
      await dispatch(updateEvent({ 
        eventId: selectedEvent._id, 
        eventData 
      })).unwrap();
      dispatch(setModal({ isFormOpen: false }));
      setSelectedEvent(null);
      toast.success('Event updated successfully', { id: loadingToast });
      await Promise.all([
        dispatch(fetchEvents()),
        dispatch(fetchDashboardStats())
      ]);
    } catch (error) {
      toast.error(error.message || 'Failed to update event', { id: loadingToast });
    }
  };

  const openCreateModal = () => {
    setSelectedEvent(null);
    dispatch(setModal({ isFormOpen: true }));
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    dispatch(setModal({ isFormOpen: true }));
  };

  const openDetailsModal = (event) => {
    setSelectedEvent(event);
    dispatch(setModal({ isDetailsOpen: true }));
  };

  const getStatusColor = (status) => {
    const statusColors = {
      ongoing: "bg-blue-100 text-blue-800",
      upcoming: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  // Calculate current items for pagination
  const currentItems = filteredEvents?.slice(
    (pagination.currentPage - 1) * pagination.itemsPerPage,
    pagination.currentPage * pagination.itemsPerPage
  ) || [];

  // Loading state
  if (isLoading && !filteredEvents?.length) {
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
          filterType="events"
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
          pageTitle="Manage Events"
          showAddButton={true}
          addButtonText="Add Event"
          onAddNew={openCreateModal}
        />

        <div className="bg-white rounded-lg shadow-lg overflow-hidden ">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize Pool</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Fee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No events found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((event) => (
                    <tr key={event._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-white shadow-xs flex items-center justify-center mr-3">
                            {(() => {
                              switch(event.icon) {
                                case 'Trophy': return <Trophy className="text-lightBlue-600" size={20} />;
                                case 'Medal': return <Medal className="text-yellow-500" size={20} />;
                                case 'Gift': return <Gift className="text-purple-500" size={20} />;
                                case 'Award': return <Award className="text-green-500" size={20} />;
                                case 'Star': return <Star className="text-orange-500" size={20} />;
                                case 'Zap': return <Zap className="text-red-500" size={20} />;
                                case 'Users': return <Users className="text-green-500" size={20} />;
                                case 'BarChart2': return <BarChart2 className="text-red-500" size={20} />;
                                case 'Coins': return <Coins className="text-amber-500" size={20} />;
                                default: return <Trophy className="text-lightBlue-600" size={20} />;
                              }
                            })()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{event.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-1">{event.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(event.startDate)}</div>
                        <div className="text-xs text-gray-500">to {formatDate(event.endDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.prize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${event.entryFee || 'Free'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{event.participants || 0}</div>
                        <div className="text-xs text-gray-500">{event.progress}% complete</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.type)}`}>
                          {event.type || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => openDetailsModal(event)}
                            className="text-lightBlue-600 hover:text-blue-900"
                          >
                            <Info size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="text-yellow-600 mx-2 hover:text-yellow-900"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event)}
                            className="text-red-600 mx-2 hover:text-red-900"
                          >
                            <Trash2 size={18} />
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

        {filteredEvents?.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={Math.ceil(filteredEvents.length / pagination.itemsPerPage)}
              itemsPerPage={pagination.itemsPerPage}
              setItemsPerPage={(value) => dispatch(setPagination({ itemsPerPage: value }))}
              setCurrentPage={(value) => dispatch(setPagination({ currentPage: value }))}
              filteredItems={filteredEvents}
              indexOfFirstItem={(pagination.currentPage - 1) * pagination.itemsPerPage}
              indexOfLastItem={Math.min(pagination.currentPage * pagination.itemsPerPage, filteredEvents.length)}
            />
          </div>
        )}

        {/* Event Modal */}
        {modals?.isFormOpen && (
          <EventModal 
            event={selectedEvent}
            onClose={() => {
              dispatch(setModal({ isFormOpen: false }));
              setSelectedEvent(null);
            }}
            onSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          />
        )}

        {/* Event Details Modal */}
        {modals?.isDetailsOpen && selectedEvent && (
          <EventDetailsModal 
            isOpen={modals.isDetailsOpen}
            onClose={() => {
              dispatch(setModal({ isDetailsOpen: false }));
              setSelectedEvent(null);
            }}
            event={selectedEvent}
            onEdit={() => {
              dispatch(setModal({ isDetailsOpen: false, isFormOpen: true }));
            }}
            onDelete={() => {
              dispatch(setModal({ isDetailsOpen: false }));
              handleDeleteClick(selectedEvent);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedEvent(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the event "${selectedEvent?.title}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default AdminEventsPage;