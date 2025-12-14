import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import FeedbackTable from "../../components/Admin/Tables/FeedbackTable/FeedbackTable";
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import StatsSection from "../../components/Admin/Cards/StatsSection";
import Loader from '../../components/Common/Loader';
import {
  fetchFeedbacks,
  setFilters,
  clearFilters,
  updateLocalFilters,
  selectFilteredFeedbacks,
  selectFeedbackLoading,
  selectFeedbackError,
  selectFeedbackStats,
  selectFeedbackFilters
} from "../../redux/Admin/FeedbackListPage/FeedbackTableSlice";


const FeedbackList = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const filteredFeedbacks = useSelector(selectFilteredFeedbacks);
  const loading = useSelector(selectFeedbackLoading);
  const error = useSelector(selectFeedbackError);
  const stats = useSelector(selectFeedbackStats);
  const currentFilters = useSelector(selectFeedbackFilters);

  // Local state
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    isFilterOpen: false,
    searchQuery: "",
    activeFilters: {
      category: false,
      status: false,
      rating: false,
      recommend: false,
      dateRange: false,
      search: false
    },
    tempFilters: {
      category: 'all',
      status: 'all', // lowercase
      rating: 'all',
      recommend: 'all',
      startDate: null,
      endDate: null
    }
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchFeedbacks())
      .unwrap()
      .then(() => {
        // Optional: Handle successful fetch
        console.log('Feedbacks fetched successfully');
      })
      .catch(error => {
        // Optional: Handle error
        console.error('Error fetching feedbacks:', error);
      });
  }, [dispatch]);

  // Filter handlers
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    const processedValue = name === 'status' ? value.toLowerCase() : value;

  setState(prev => ({
    ...prev,
    tempFilters: {
      ...prev.tempFilters,
      [name]: processedValue
    },
    activeFilters: {
      ...prev.activeFilters,
      [name]: processedValue !== 'all'
    }
  }));

  dispatch(updateLocalFilters({ [name]: processedValue }));
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
        category: 'all',
        status: 'all',
        rating: 'all',
        recommend: 'all',
        startDate: null,
        endDate: null
      },
      activeFilters: {
        category: false,
        status: false,
        rating: false,
        recommend: false,
        dateRange: false,
        search: false
      },
      currentPage: 1
    }));
    dispatch(clearFilters());
  }, [dispatch]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    setState(prev => ({
      ...prev,
      currentPage: newPage
    }));
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newValue) => {
    setState(prev => ({
      ...prev,
      itemsPerPage: newValue,
      currentPage: 1
    }));
  }, []);

  // Pagination calculations
  const totalItems = filteredFeedbacks.length;
  const totalPages = Math.ceil(totalItems / state.itemsPerPage);
  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;
  const currentItems = filteredFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Stats calculations
  const calculatedStats = {
    total: filteredFeedbacks.length,
    positive: filteredFeedbacks.filter(f => f.rating >= 4).length,
    negative: filteredFeedbacks.filter(f => f.rating <= 2).length,
    approved: filteredFeedbacks.filter(f => f.status === 'approved').length,
    rejected: filteredFeedbacks.filter(f => f.status === 'rejected').length,
    recommended: filteredFeedbacks.filter(f => f.recommend).length,
    ...stats // Merge with stats from Redux store
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
        pageType="feedbacks"
      />

      <div className="px-8 mx-4 -mt-12">
        <TableFilters
          filterType="feedback"
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
          pageTitle="Manage Feedback"
          showAddButton={false}
        />

        {filteredFeedbacks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback data available</p>
          </div>
        ) : (
          <>
            <FeedbackTable 
              feedbacks={currentItems}
            />

            <div className="mt-4">
              <Pagination 
                currentPage={state.currentPage}
                totalPages={totalPages}
                itemsPerPage={state.itemsPerPage}
                setItemsPerPage={handleItemsPerPageChange}
                setCurrentPage={handlePageChange}
                filteredItems={filteredFeedbacks}
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

export default FeedbackList;