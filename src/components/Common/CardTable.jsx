import Loader from '../Common/Loader';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  X, 
  Search as SearchIcon,
  ChevronDown, 
  ChevronUp,
  ChevronRight, 
  ChevronLeft,
  Filter, 
  RefreshCw,
  BarChart2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Import actions from both slices
import {
  fetchNiftyData,
  fetchCompanyDetails as fetchNifty50CompanyDetails,
  setSearchTerm as setNifty50SearchTerm,
  setSortConfig as setNifty50SortConfig,
  setCurrentPage as setNifty50CurrentPage,
  setItemsPerPage as setNifty50ItemsPerPage,
  setSelectedSymbol as setNifty50SelectedSymbol,
  resetCompanyDetails as resetNifty50CompanyDetails
} from '../../redux/Common/nifty50Slice';

import {
  fetchNifty500Data,
  fetchCompanyDetails as fetchNifty500CompanyDetails,
  setSearchTerm as setNifty500SearchTerm,
  setSortConfig as setNifty500SortConfig,
  setCurrentPage as setNifty500CurrentPage,
  setItemsPerPage as setNifty500ItemsPerPage,
  setSelectedSymbol as setNifty500SelectedSymbol,
  resetCompanyDetails as resetNifty500CompanyDetails
} from '../../redux/Common/nifty500Slice';

import CompanyDetailModal from '../Admin/Modals/companyDetailModal/index';

const CardTable = ({ tableType = 'nifty50', userData, isGuestUser = false  }) => {
  const dispatch = useDispatch();
  
  // Select the appropriate state based on tableType
  const niftyState = useSelector(state => 
    tableType === 'nifty50' 
      ? state.common.nifty50 
      : state.common.nifty500
  );

  const {
    data = [],
    loading = false,
    error = null,
    companyDetails = {
      stockData: null,
      chartData: null,
      loading: false,
      error: null
    },
    pagination = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0
    },
    sortConfig = {
      key: null,
      direction: 'none'
    },
    searchTerm = '',
    selectedSymbol = null
  } = niftyState || {};

  const [searchValue, setSearchValue] = useState(searchTerm);// Add this useEffect to sync Redux state to local input only when Redux value changes externally
  



  const { currentPage, itemsPerPage } = pagination;

  // Helper function to get the appropriate action based on tableType
  const getAction = (nifty50Action, nifty500Action) => {
    return tableType === 'nifty50' ? nifty50Action : nifty500Action;
  };

  useEffect(() => {
    const fetchAction = getAction(fetchNiftyData, fetchNifty500Data);
    dispatch(fetchAction({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm, tableType]);
  

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchValue !== searchTerm) {
        const setSearchAction = getAction(setNifty50SearchTerm, setNifty500SearchTerm);
        dispatch(setSearchAction(searchValue));
      }
    }, 30000 );
    return () => clearTimeout(delayDebounce);
  }, [searchValue, searchTerm, dispatch, tableType]);


  const handleSearchInputChange = (value) => {
    setSearchValue(value);
  };

  const handleSymbolClick = (symbol, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Just pass the symbol string
    const setSymbolAction = getAction(setNifty50SelectedSymbol, setNifty500SelectedSymbol);
    dispatch(setSymbolAction(symbol));
    
    const fetchDetailsAction = getAction(fetchNifty50CompanyDetails, fetchNifty500CompanyDetails);
    dispatch(fetchDetailsAction({ symbol }));
};

  const handleTimeRangeChange = (range) => {
    if (selectedSymbol) {
      const fetchDetailsAction = getAction(fetchNifty50CompanyDetails, fetchNifty500CompanyDetails);
      dispatch(fetchDetailsAction(selectedSymbol));
    }
  };

 

    

  const handleSortChange = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'none';
    }
    const setSortAction = getAction(setNifty50SortConfig, setNifty500SortConfig);
    dispatch(setSortAction({ key, direction }));
  };

  const handleCloseModal = () => {
    const setSymbolAction = getAction(setNifty50SelectedSymbol, setNifty500SelectedSymbol);
    const resetDetailsAction = getAction(resetNifty50CompanyDetails, resetNifty500CompanyDetails);
    dispatch(setSymbolAction(null));
    dispatch(resetDetailsAction());
  };

  const getSortedData = (data) => {
    if (!data || !Array.isArray(data)) return [];
    if (sortConfig.direction === 'none') return data;

    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key] ?? "";
      const valueB = b[sortConfig.key] ?? "";

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortConfig.direction === "ascending" 
          ? valueA - valueB 
          : valueB - valueA;
      }
      return sortConfig.direction === "ascending"
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString());
    });
  };

  const filteredItems = getSortedData(data).filter(stock =>
    stock.symbol?.toLowerCase().includes(searchValue.toLowerCase())
  );

  const formatColumnHeader = (key) => {
    const words = key.replace(/([A-Z])/g, ' $1');
    return words.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col mt-48 items-center justify-center h-64 p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => {
            const fetchAction = getAction(fetchNiftyData, fetchNifty500Data);
            dispatch(fetchAction({ page: currentPage, limit: itemsPerPage, search: searchTerm }));
          }}
          className="flex items-center gap-2 bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Retry
        </button>
      </div>
    );
  }

  if (!filteredItems.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 p-4">
        <div className="text-gray-500 mb-4">No data available</div>
        <button
          onClick={() => {
            const fetchAction = getAction(fetchNiftyData, fetchNifty500Data);
            const setSearchAction = getAction(setNifty50SearchTerm, setNifty500SearchTerm);
            dispatch(setSearchAction(''));
            dispatch(fetchAction({ page: currentPage, limit: itemsPerPage, search: '' }));
            setSearchValue('');
          }}
          className="flex items-center gap-2 bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600 transition-colors"
        >
          <RefreshCw size={16} /> Refresh Data
        </button>
      </div>
     
    );
  }

  return (
    <>
      <div className="px-8 mx-8 -mt-12 bg-gray-50 rounded-lg h-19 p-4 mb-8.5 flex justify-between items-center">   
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <BarChart2 className="mr-2 text-lightBlue-600" size={24} />
            {tableType === 'nifty50' ? 'Nifty 50 Market Data' : 'Nifty 500 Market Data'}
          </h2>

        </div>
        
        <div className="relative w-[300px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-gray-400" />
          </div>
          <input
  type="text"
  placeholder="Search by symbol..."
  className="w-full h-10 pl-10 pr-10 rounded-lg border border-gray-300 
    focus:outline-none focus:ring-2 focus:ring-lightBlue-500 
    text-sm placeholder-gray-500"
  value={searchValue}
  onChange={(e) => handleSearchInputChange(e.target.value)}
/>

{searchValue && (
  <button
    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
    onClick={() => handleSearchInputChange('')}
  >
    <X size={16} />
  </button>
)}

        </div>
      </div>

      <div className="flex flex-wrap mx-4 -mt-0">
        <div className="w-full mb-12 px-4 -mt-8">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <div className="min-w-full">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      {[
                        'symbol',
                        'open',
                        'dayHigh',
                        'dayLow',
                        'previousClose',
                        'lastPrice',
                        'change',
                        'pChange',
                        'totalTradedVolume',
                        'totalTradedValue',
                        'yearHigh',
                        'yearLow',
                        'perChange365d',
                        'perChange30d'
                      ].map((column) => (
                        <th
                          key={column}
                          onClick={() => handleSortChange(column)}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-1">
                            <span>{formatColumnHeader(column)}</span>
                            {sortConfig.key === column && sortConfig.direction === 'ascending' && (
                              <ArrowUp size={16} className="text-gray-500" />
                            )}
                            {sortConfig.key === column && sortConfig.direction === 'descending' && (
                              <ArrowDown size={16} className="text-gray-500" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredItems
                      .slice(indexOfFirstItem, indexOfLastItem)
                      .map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={(e) => handleSymbolClick(row.symbol, e)}
                              className="text-lightBlue-600 hover:text-blue-800 font-medium"
                            >
                              {row.symbol}
                            </button>
                          </td>
                          {[
                            'open',
                            'dayHigh',
                            'dayLow',
                            'previousClose',
                            'lastPrice',
                            'change',
                            'pChange',
                            'totalTradedVolume',
                            'totalTradedValue',
                            'yearHigh',
                            'yearLow',
                            'perChange365d',
                            'perChange30d'
                          ].map((field, idx) => (
                            <td key={idx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {typeof row[field] === 'number'
                                ? field.includes('Change') || field.includes('pChange')
                                  ? <span className={row[field] >= 0 ? "text-green-600" : "text-red-600"}>
                                      {row[field].toFixed(2)}%
                                    </span>
                                  : field.includes('tradedValue')
                                  ? `₹${row[field].toLocaleString()}`
                                  : field.includes('Price') || field.includes('High') || field.includes('Low') || field.includes('open')
                                  ? `₹${row[field].toLocaleString()}`
                                  : row[field].toLocaleString()
                                : row[field] || 'N/A'}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    const setItemsAction = getAction(setNifty50ItemsPerPage, setNifty500ItemsPerPage);
                    dispatch(setItemsAction(Number(e.target.value)));
                  }}
                  className="form-select px-3 py-1 rounded-md border-gray-300 shadow-sm 
                         focus:border-lightBlue-500 focus:ring focus:ring-lightBlue-200 
                         focus:ring-opacity-50 text-sm"
                >
                  {[5, 10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span className="text-sm font-medium text-gray-600">
                  {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const setPageAction = getAction(setNifty50CurrentPage, setNifty500CurrentPage);
                    dispatch(setPageAction(Math.max(1, currentPage - 1)));
                  }}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-1 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => {
                            const setPageAction = getAction(setNifty50CurrentPage, setNifty500CurrentPage);
                            dispatch(setPageAction(page));
                          }}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === page
                              ? "bg-lightBlue-600 text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => {
                    const setPageAction = getAction(setNifty50CurrentPage, setNifty500CurrentPage);
                    dispatch(setPageAction(Math.min(totalPages, currentPage + 1)));
                  }}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-md border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CompanyDetailModal
        isOpen={!!selectedSymbol}
        onClose={handleCloseModal}
        symbol={selectedSymbol}
        data={companyDetails.stockData}
        chartData={companyDetails.chartData}
        onTimeRangeChange={handleTimeRangeChange}
        loading={companyDetails.loading}
        error={companyDetails.error}
        chartSettings={{
          theme: 'light',
          showGrid: true,
          showVolume: true,
          showDetails: true
        }}
        type={tableType}
        userData={userData}
        isGuestUser={isGuestUser}
      />
    </>
  );
};

export default CardTable;


CardTable.propTypes = {
  // ... existing propTypes ...
  isGuestUser: PropTypes.bool,
};

CardTable.defaultProps = {
  // ... existing defaultProps ...
  isGuestUser: false,
};