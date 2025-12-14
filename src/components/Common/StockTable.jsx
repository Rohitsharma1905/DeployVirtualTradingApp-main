import Loader from '../Common/Loader';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from 'prop-types';
import { useDebounce } from 'use-debounce';
import { 
  ChevronDown, 
  ChevronUp,
  ChevronRight, 
  ChevronLeft, 
  Filter, 
  X, 
  Search as SearchIcon,
  RefreshCw,
  Star,
  ArrowUp,
  ArrowDown,
  BarChart2
} from "lucide-react";
import { 
  fetchStockData, 
  fetchCompanyDetails,
  setSearchTerm,
  setSortConfig,
  setCurrentPage,
  setItemsPerPage,
  setSelectedSymbol,
  resetCompanyDetails
} from "../../redux/Common/etfSlice";
import CompanyDetailModal from "../Admin/Modals/companyDetailModal/index";
import "../../assets/styles/table.css";

const StockTable = ({ userData, isGuestUser = false  }) => {
  const dispatch = useDispatch();
 

  const { 
    stockData = [], 
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
  } = useSelector((state) => state.common.etf) || {};

  const { currentPage, itemsPerPage } = pagination;

  useEffect(() => {
    dispatch(fetchStockData({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: searchTerm 
    }));
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);


  const handleSymbolClick = (symbol, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setSelectedSymbol(symbol)); // Just pass the symbol string
    dispatch(fetchCompanyDetails({ symbol, type: 'etf' })); // Explicitly pass type
  };

  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [debouncedSearch] = useDebounce(localSearch, 1000);

  useEffect(() => {
    dispatch(setSearchTerm(debouncedSearch));
  }, [debouncedSearch, dispatch]);
  
  const handleSearchChange = (value) => {
    setLocalSearch(value); // only update local state
  };

  const handleSortChange = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'none';
    }
    dispatch(setSortConfig({ key, direction }));
  };

  const handleCloseModal = () => {
    dispatch(setSelectedSymbol(null));
    dispatch(resetCompanyDetails());
  };

  const handleTimeRangeChange = (range) => {
    if (selectedSymbol) {
      dispatch(fetchCompanyDetails(selectedSymbol));
    }
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

  const filteredItems = getSortedData(stockData)
    .filter(stock => stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()));
  
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
          onClick={() => dispatch(fetchStockData({ 
            page: currentPage, 
            limit: itemsPerPage, 
            search: searchTerm 
          }))}
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
          onClick={() => dispatch(fetchStockData({ 
            page: currentPage, 
            limit: itemsPerPage, 
            search: searchTerm 
          }))}
          className="flex items-center gap-2 bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh Data
        </button>
      </div>
    );
  }

  // Format column headers for display
  const formatColumnHeader = (key) => {
    const words = key.replace(/([A-Z])/g, ' $1');
    return words.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <>
      <div className="px-8 mx-8 -mt-42 bg-gray-50 rounded-lg h-19 p-4 mb-8.5 flex justify-between items-center">   
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <BarChart2 className="mr-2 text-lightBlue-600" size={24} />
          ETF Market Data
        </h2>
        
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
  value={localSearch}
  onChange={(e) => handleSearchChange(e.target.value)}
/>

{localSearch && (
  <button
    className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
    onClick={() => handleSearchChange("")}
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

            <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Rows per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    dispatch(setItemsPerPage(Number(e.target.value)));
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
                    dispatch(setCurrentPage(Math.max(1, currentPage - 1)));
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
                            dispatch(setCurrentPage(page));
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
                    dispatch(setCurrentPage(Math.min(totalPages, currentPage + 1)));
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
        type="etf"
        userData={userData}
        isGuestUser={isGuestUser}
      />
    </>
  );
};

export default StockTable;

StockTable.propTypes = {
  // ... existing propTypes ...
  isGuestUser: PropTypes.bool,
};

StockTable.defaultProps = {
  // ... existing defaultProps ...
  isGuestUser: false,
};