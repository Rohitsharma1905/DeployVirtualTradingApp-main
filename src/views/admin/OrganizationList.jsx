// OrganizationList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Common/Loader';
// Import actions
import {
  fetchOrganizations,
  deleteOrganization,
  updateOrganizationStatus,
  setFilters,
  setActiveFilters,
  setSearchQuery,
  setPagination,
  setModal,
  clearFilters,
  filterOrganizations
} from '../../redux/Admin/OrganizationListPage/OrganizationListSlice';

// Import components
import OrganizationTable from '../../components/Admin/Tables/OrganizationTable/OrganizationTable';
import OrganizationRegistrationForm from '../../components/Admin/Modals/OrganizationRegistrationForm';
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import StatsSection from "../../components/Admin/Cards/StatsSection";
import ConfirmationModal from "../../components/Admin/Modals/ConformationModal";
import {fetchDashboardStats} from "../../redux/User/userSlice";
// Memoized selector
const selectOrganizationState = state => state.admin.organizationList || {};

const OrganizationList = () => {
  const dispatch = useDispatch();
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Use memoized selector
  const {
    organizations,
    filteredOrganizations,
    isLoading,
    error,
    filters,
    activeFilters,
    searchQuery,
    pagination,
    modals,
    stats
  } = useSelector(selectOrganizationState);

  // Memoize current items calculation
  const currentItems = useMemo(() => {
    const indexOfLastItem = pagination.currentPage * pagination.itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - pagination.itemsPerPage;
    return Array.isArray(filteredOrganizations)
      ? filteredOrganizations.slice(indexOfFirstItem, indexOfLastItem)
      : [];
  }, [filteredOrganizations, pagination.currentPage, pagination.itemsPerPage]);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchOrganizations()).unwrap();
      } catch (error) {
        toast.error(error.message || 'Failed to fetch organizations');
      }
    };
    fetchData();
  }, [dispatch]);

  // Filter effect
  useEffect(() => {
    dispatch(filterOrganizations());
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
    dispatch(filterOrganizations());
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

  const handleDeleteClick = (organization) => {
    if (!organization?._id) {
      toast.error('Invalid organization selected');
      return;
    }
    setSelectedOrganization(organization);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedOrganization?._id) return;

    const loadingToast = toast.loading('Deleting organization...');
    try {
      await dispatch(deleteOrganization(selectedOrganization._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedOrganization(null);
      toast.success('Organization deleted successfully', { id: loadingToast });
      // dispatch(fetchOrganizations());
      await Promise.all([
        dispatch(fetchOrganizations()),
        dispatch(fetchDashboardStats())
      ]);
    } catch (error) {
      toast.error(error.message || 'Failed to delete organization', { id: loadingToast });
    }
  };

  // const handleStatusChange = async (id, status) => {
  //   try {
  //     await dispatch(updateOrganizationStatus({ id, status })).unwrap();
  //     dispatch(fetchOrganizations());
  //   } catch (error) {
  //     toast.error('Failed to update status');
  //   }
  // };

  const handleStatusChange = async (id, status) => {
    try {
      // Get current organization to know previous status
      const org = organizations.find(o => o._id === id);
      await dispatch(updateOrganizationStatus({ 
        id, 
        status,
        prevStatus: org.status 
      })).unwrap();
      
      // Refresh both organizations and stats
      await Promise.all([
        dispatch(fetchOrganizations()),
        dispatch(fetchDashboardStats())
      ]);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEditOrganization = (org) => {
    dispatch(setModal({
      isFormOpen: true,
      selectedOrg: org
    }));
  };

  // Loading state
  if (isLoading && !filteredOrganizations?.length) {
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
      <StatsSection stats={stats} isDashboard={false} pageType="organizations" />

      <div className="px-8 mx-4 -mt-12">
        <TableFilters
          filterType="organizations"
          isFilterOpen={modals.isFilterOpen}
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
          pageTitle="Manage Organizations"
          showAddButton={true}
          addButtonText="Add Organization"
          onAddNew={() => dispatch(setModal({ isFormOpen: true, selectedOrg: null }))}
        />

        <OrganizationTable
          organizations={currentItems}
          isLoading={isLoading}
          onEdit={handleEditOrganization}
          onDelete={handleDeleteClick}
          onStatusChange={handleStatusChange}
        />

        {filteredOrganizations?.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={Math.ceil(filteredOrganizations.length / pagination.itemsPerPage)}
              itemsPerPage={pagination.itemsPerPage}
              setItemsPerPage={(value) => dispatch(setPagination({ itemsPerPage: value }))}
              setCurrentPage={(value) => dispatch(setPagination({ currentPage: value }))}
              filteredItems={filteredOrganizations}
              indexOfFirstItem={(pagination.currentPage - 1) * pagination.itemsPerPage}
              indexOfLastItem={Math.min(pagination.currentPage * pagination.itemsPerPage, filteredOrganizations.length)}
            />
          </div>
        )}

<OrganizationRegistrationForm
  isOpen={modals.isFormOpen}
  onClose={() => {
    dispatch(setModal({ isFormOpen: false, selectedOrg: null }));
  }}
  selectedOrg={modals.selectedOrg}
  onSuccess={() => {
    dispatch(fetchOrganizations());
  }}
/>

        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedOrganization(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the organization "${selectedOrganization?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default OrganizationList;