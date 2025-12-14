import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';

// Components
import StatsSection from "../../components/Admin/Cards/StatsSection";
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import UsersTable from "../../components/Admin/Tables/UserTable/UsersTable";
import RegisterModal from "../../components/Admin/Modals/UserRegister";
import ConfirmationModal from "../../components/Admin/Modals/ConformationModal";
import SubscriptionModal from "../../components/Admin/Modals/SubscriptionModal";
// Actions
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setFilters,
  clearFilters,
  setActiveFilters,
  setSearchQuery,
  updateFilteredUsers  // Add this instead
} from "../../redux/Admin/RegisteredUsersPage/RegisteredUserListSlice";
import { fetchDashboardStats } from "../../redux/User/userSlice";

const RegisterUserList = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    list: users = [],
    filteredUsers = [],
    status = 'idle',
    isLoading = false,
    isDeleting = false,
    error = null,
    stats = {},
    filters = {},
    activeFilters = {},
    searchQuery = "",
  } = useSelector(state => state.admin.registeredUsersTable);

  // Local state
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    isFilterOpen: false,
    isRegisterModalOpen: false,
    isDeleteModalOpen: false,
    selectedUser: null,
    tempFilters: {
      status: "all",
      gender: "all",
      startDate: null,
      endDate: null,
    },
    isSubscriptionModalOpen: false,
    selectedUserForSubscription: null,
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .then(() => {
        console.log('Users fetched successfully');
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        toast.error(error.message || 'Failed to fetch users');
      });
  }, [dispatch]);

  // Filter effect
  useEffect(() => {
    dispatch(updateFilteredUsers());
  }, [dispatch, filters, searchQuery]);

  // Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        [name]: value
      }
    }));
    dispatch(setFilters({ [name]: value }));
  };

  const handleStartDateChange = (date) => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        startDate: date
      }
    }));
    dispatch(setFilters({ startDate: date }));
  };

  const handleEndDateChange = (date) => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        endDate: date
      }
    }));
    dispatch(setFilters({ endDate: date }));
  };

  const handleApplyFilters = () => {
    dispatch(setActiveFilters({
      status: state.tempFilters.status !== 'all',
      gender: state.tempFilters.gender !== 'all',
      dateRange: !!(state.tempFilters.startDate && state.tempFilters.endDate),
      search: !!searchQuery
    }));
    setState(prev => ({
      ...prev,
      isFilterOpen: false,
      currentPage: 1
    }));
    dispatch(updateFilteredUsers());  // Change this line
  };

  const handleClearFilters = () => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        status: "all",
        gender: "all",
        startDate: null,
        endDate: null,
      },
      currentPage: 1,
      isFilterOpen: true
    }));
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
  };

  const handleRegistrationSuccess = async () => {
    try {
      // await dispatch(fetchUsers()).unwrap();
      await Promise.all([
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchDashboardStats()).unwrap()
      ]);
      setState(prev => ({ ...prev, isRegisterModalOpen: false }));
      // toast.success('User operation completed successfully');
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEditClick = (user) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      isRegisterModalOpen: true
    }));
  };

  const handleSubscriptionClick = (user) => {
    setState(prev => ({
      ...prev,
      isSubscriptionModalOpen: true,
      selectedUserForSubscription: user
    }));
  };

  const handleDeleteClick = (user) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      isDeleteModalOpen: true
    }));
  };

  const handleDeleteConfirm = async () => {
    try {
      const loadingToast = toast.loading('Deleting user...');
      await dispatch(deleteUser(state.selectedUser._id)).unwrap();
  
      setState(prev => ({
        ...prev,
        isDeleteModalOpen: false,
        selectedUser: null
      }));

      await Promise.all([
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchDashboardStats()).unwrap()
      ]);
      
      toast.success('User deleted successfully', { id: loadingToast });
      
      // Refresh data
      dispatch(fetchUsers());
      dispatch(updateFilteredUsers());  // Change this line
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
      console.error('Delete error:', error);
    }
  };

  // Pagination calculations
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / state.itemsPerPage);
  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Loading state
  if (isLoading && !filteredUsers.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-xl bg-red-100 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 overflow-hidden">
      <StatsSection stats={stats} isDashboard={false} pageType="users" />

      <div className="px-8 mx-4 -mt-12">
        {/* Table Filters */}
        <TableFilters
          filterType="users"
          isFilterOpen={state.isFilterOpen}
          setIsFilterOpen={(value) => setState(prev => ({ ...prev, isFilterOpen: value }))}
          tempFilters={state.tempFilters}
          handleFilterChange={handleFilterChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          applyFilters={handleApplyFilters}
          clearFilters={handleClearFilters}
          searchQuery={searchQuery}
          setSearchQuery={(value) => dispatch(setSearchQuery(value))}
          activeFilters={activeFilters}
          setActiveFilters={(filters) => dispatch(setActiveFilters(filters))}
          pageTitle="Manage Users"
          showAddButton={true}
          addButtonText="Add User"
          onAddNew={() => setState(prev => ({ 
            ...prev, 
            isRegisterModalOpen: true,
            selectedUser: null 
          }))}
        />

        {/* Users Table */}
        <div>
  <UsersTable 
    users={currentItems}
    onEditClick={handleEditClick}
    onDeleteClick={handleDeleteClick}
    onSubscriptionClick={handleSubscriptionClick} // Add this line
  />
</div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-4">
            <Pagination 
              currentPage={state.currentPage}
              totalPages={totalPages}
              itemsPerPage={state.itemsPerPage}
              setItemsPerPage={(value) => setState(prev => ({ ...prev, itemsPerPage: value, currentPage: 1 }))}
              setCurrentPage={(value) => setState(prev => ({ ...prev, currentPage: value }))}
              filteredItems={filteredUsers}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </div>
        )}

        {/* Register/Edit Modal */}
        <RegisterModal
          isOpen={state.isRegisterModalOpen}
          onClose={() => setState(prev => ({ 
            ...prev, 
            isRegisterModalOpen: false,
            selectedUser: null 
          }))}
          onSuccess={handleRegistrationSuccess}
          selectedUser={state.selectedUser}
        />

        <SubscriptionModal
          isOpen={state.isSubscriptionModalOpen}
          onClose={() => setState(prev => ({ 
            ...prev, 
            isSubscriptionModalOpen: false,
            selectedUserForSubscription: null 
          }))}
          selectedUser={state.selectedUserForSubscription}
          existingPlan={null} // You'll need to fetch this
          onSuccess={() => {
            // Handle success
            toast.success('Subscription updated successfully');
            // Refresh data if needed
          }}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={state.isDeleteModalOpen}
          onClose={() => setState(prev => ({ 
            ...prev, 
            isDeleteModalOpen: false,
            selectedUser: null 
          }))}
          onConfirm={handleDeleteConfirm}
          title="Confirm Deletion"
          message={`Are you sure you want to delete user "${state.selectedUser?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default RegisterUserList;