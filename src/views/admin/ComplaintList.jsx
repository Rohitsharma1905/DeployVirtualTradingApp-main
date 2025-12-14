import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ComplaintTable from "../../components/Admin/Tables/ComplaintTable/ComplaintTable";
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import StatsSection from "../../components/Admin/Cards/StatsSection";
import Loader from '../../components/Common/Loader';
import {
  fetchComplaints,
  setFilters,
  clearFilters,
  updateLocalFilters,
  selectFilteredComplaints,
  selectComplaintLoading,
  selectComplaintError,
  selectComplaintStats,
  selectComplaintFilters
} from "../../redux/Admin/ComplaintListPage/complaintTableSlice";

const ComplaintList = () => {
  const dispatch = useDispatch();

  const filteredComplaints = useSelector(selectFilteredComplaints);
  const loading = useSelector(selectComplaintLoading);
  const error = useSelector(selectComplaintError);
  const stats = useSelector(selectComplaintStats);
  const currentFilters = useSelector(selectComplaintFilters);

  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    isFilterOpen: false,
    searchQuery: "",
    activeFilters: {
      status: false,
      category: false,
      dateRange: false,
      search: false
    },
    tempFilters: {
      status: 'all',
      category: 'all',
      startDate: null,
      endDate: null
    }
  });

  useEffect(() => {
    dispatch(fetchComplaints())
      .unwrap()
      .then(() => console.log('Complaints fetched successfully'))
      .catch(error => console.error('Error fetching complaints:', error));
  }, [dispatch]);

  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;

    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        [name]: value
      },
      activeFilters: {
        ...prev.activeFilters,
        [name]: value !== 'all'
      }
    }));

    dispatch(updateLocalFilters({ [name]: value }));
  }, [dispatch]);

  const handleStartDateChange = useCallback((date) => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        startDate: date
      },
      activeFilters: {
        ...prev.activeFilters,
        dateRange: !!(date || prev.tempFilters.endDate)
      }
    }));

    dispatch(updateLocalFilters({ startDate: date }));
  }, [dispatch]);

  const handleEndDateChange = useCallback((date) => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        ...prev.tempFilters,
        endDate: date
      },
      activeFilters: {
        ...prev.activeFilters,
        dateRange: !!(prev.tempFilters.startDate || date)
      }
    }));

    dispatch(updateLocalFilters({ endDate: date }));
  }, [dispatch]);

  const handleSearchChange = useCallback((value) => {
    setState(prev => ({
      ...prev,
      searchQuery: value,
      activeFilters: {
        ...prev.activeFilters,
        search: !!value
      }
    }));

    dispatch(updateLocalFilters({ search: value }));
  }, [dispatch]);

  const handleApplyFilters = useCallback(() => {
    const filters = {
      ...state.tempFilters,
      search: state.searchQuery
    };

    dispatch(setFilters(filters));
    setState(prev => ({
      ...prev,
      isFilterOpen: false,
      currentPage: 1
    }));
  }, [dispatch, state.tempFilters, state.searchQuery]);

  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: "",
      tempFilters: {
        status: 'all',
        category: 'all',
        startDate: null,
        endDate: null
      },
      activeFilters: {
        status: false,
        category: false,
        dateRange: false,
        search: false
      },
      currentPage: 1
    }));
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePageChange = useCallback((newPage) => {
    setState(prev => ({
      ...prev,
      currentPage: newPage
    }));
  }, []);

  const handleItemsPerPageChange = useCallback((newValue) => {
    setState(prev => ({
      ...prev,
      itemsPerPage: newValue,
      currentPage: 1
    }));
  }, []);

  const totalItems = filteredComplaints.length;
  const totalPages = Math.ceil(totalItems / state.itemsPerPage);
  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;
  const currentItems = filteredComplaints.slice(indexOfFirstItem, indexOfLastItem);

  const calculatedStats = {
    total: filteredComplaints.length,
    solved: filteredComplaints.filter(c => c.status === 'solved').length,
    pending: filteredComplaints.filter(c => c.status === 'pending').length,
    ...stats
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl bg-red-100 p-4 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 overflow-hidden">
      <StatsSection 
        stats={calculatedStats} 
        isDashboard={false} 
        pageType="complaints"
      />

      <div className="px-8 mx-4 -mt-12">
        <TableFilters
          filterType="complaint"
          isFilterOpen={state.isFilterOpen}
          setIsFilterOpen={(value) => setState(prev => ({ ...prev, isFilterOpen: value }))}
          tempFilters={state.tempFilters}
          handleFilterChange={handleFilterChange}
          handleStartDateChange={handleStartDateChange}
          handleEndDateChange={handleEndDateChange}
          applyFilters={handleApplyFilters}
          clearFilters={handleClearFilters}
          searchQuery={state.searchQuery}
          setSearchQuery={handleSearchChange}
          activeFilters={state.activeFilters}
          setActiveFilters={(filters) => setState(prev => ({ ...prev, activeFilters: filters }))}
          pageTitle="Manage User Complaints"
          showAddButton={false}
        />

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No complaint data available</p>
          </div>
        ) : (
          <>
            <ComplaintTable 
              complaints={currentItems}
            />

            <div className="mt-4">
              <Pagination 
                currentPage={state.currentPage}
                totalPages={totalPages}
                itemsPerPage={state.itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                setCurrentPage={handlePageChange}
                filteredItems={filteredComplaints}
                indexOfFirstItem={indexOfFirstItem}
                indexOfLastItem={indexOfLastItem}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;