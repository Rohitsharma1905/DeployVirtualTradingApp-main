import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from 'react-hot-toast';

// Components
import QueriesTable from "../../components/Admin/Tables/QueryTable/QueriesTable";
import Pagination from '../../components/Common/TableItems/Pagination';
import TableFilters from '../../components/Common/TableItems/TableFilters';
import StatsSection from "../../components/Admin/Cards/StatsSection";
import Loader from '../../components/Common/Loader';
// Actions
import { 
  fetchContacts,
  deleteContact,
  setFilters,
  clearFilters,
  setActiveFilters,
  setSearchQuery,
  filterContacts
} from "../../redux/Admin/QueryListPage/QueryTableSllice";

const QueriesPage = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    contacts,
    filteredContacts,
    isLoading,
    error,
    stats,
    filters,
    activeFilters,
    searchQuery
  } = useSelector(state => state.admin.queryTable);

  // Local state
  const [state, setState] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    isFilterOpen: false,
    tempFilters: {
      type: 'all',
      startDate: null,
      endDate: null,
      status: 'all'
    }
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchContacts())
      .unwrap()
      .then(() => {
        console.log('Queries fetched successfully');
      })
      .catch(error => {
        console.error('Error fetching queries:', error);
        toast.error(error.message || 'Failed to fetch queries');
      });
  }, [dispatch]);

  // Filter effect
  useEffect(() => {
    dispatch(filterContacts());
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
      type: state.tempFilters.type !== 'all',
      dateRange: !!(state.tempFilters.startDate && state.tempFilters.endDate),
      search: !!searchQuery
    }));
    setState(prev => ({
      ...prev,
      isFilterOpen: false,
      currentPage: 1
    }));
    dispatch(filterContacts());
  };

  const handleClearFilters = () => {
    setState(prev => ({
      ...prev,
      tempFilters: {
        type: 'all',
        startDate: null,
        endDate: null,
        status: 'all'
      },
      currentPage: 1,
      isFilterOpen: true
    }));
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
  };

  const handleDeleteContact = async (id) => {
    try {
      const loadingToast = toast.loading('Deleting query...');
      await dispatch(deleteContact(id)).unwrap();
      
      toast.success('Query deleted successfully', { id: loadingToast });
      
      // Refresh data
      dispatch(fetchContacts());
      dispatch(filterContacts());
    } catch (error) {
      toast.error(error.message || 'Failed to delete query');
      console.error('Delete error:', error);
    }
  };

  // Pagination calculations
  const totalItems = filteredContacts.length;
  const totalPages = Math.ceil(totalItems / state.itemsPerPage);
  const indexOfLastItem = state.currentPage * state.itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - state.itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  // Stats calculations
  const calculatedStats = {
    total: filteredContacts.length,
    technicalSupport: filteredContacts.filter(c => c.type === 'Technical Support').length,
    billingIssues: filteredContacts.filter(c => c.type === 'Billing Issue').length,
    generalInquiries: filteredContacts.filter(c => c.type === 'General Inquiry').length,
    feedback: filteredContacts.filter(c => c.type === 'Feedback').length,
    ...stats
  };

  // Loading state
  if (isLoading && !filteredContacts.length) {
    return (
      <div>
        <Loader />
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
      <StatsSection 
        stats={calculatedStats}
        isDashboard={false}
        pageType="queries"
      />

      <div className="px-8 mx-4 -mt-12">
        {/* Table Filters */}
        <TableFilters
          filterType="queries"
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
          pageTitle="Manage Queries"
          showAddButton={false}
        />

        {/* Queries Table */}
        <div>
          <QueriesTable 
            contacts={currentItems}
            tempFilters={state.tempFilters}
            searchQuery={searchQuery}
            onDelete={handleDeleteContact}
          />
        </div>

        {/* Pagination */}
        {filteredContacts.length > 0 && (
          <div className="mt-4">
            <Pagination 
              currentPage={state.currentPage}
              totalPages={totalPages}
              itemsPerPage={state.itemsPerPage}
              setItemsPerPage={(value) => setState(prev => ({ 
                ...prev, 
                itemsPerPage: value,
                currentPage: 1 
              }))}
              setCurrentPage={(value) => setState(prev => ({ 
                ...prev, 
                currentPage: value 
              }))}
              filteredItems={filteredContacts}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QueriesPage;