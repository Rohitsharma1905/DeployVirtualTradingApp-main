import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  RefreshCcw,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  selectHistoricalData,
  selectLoadingStates,
  selectHistoricalTimeRange,
  setActiveFilter,
  fetchHistoricalData,
  
} from '../../../../../redux/Common/companyDetailsSlice';

// Utility Functions
const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  }).format(num);
};

const formatCurrency = (num) => {
  if (num === null || num === undefined) return 'N/A';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(num);
};

const formatVolume = (volume) => {
  if (volume === null || volume === undefined) return 'N/A';
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(2)}Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(2)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(2)}K`;
  }
  return volume.toString();
};

// Component for Time Range Button
const TimeRangeButton = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center px-4 py-2 rounded-lg text-sm font-medium 
      transition-all duration-200 
      ${active 
        ? 'bg-lightBlue-600 text-white shadow-sm' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }
    `}
  >
    {Icon && <Icon size={16} className="mr-2" />}
    {label}
  </button>
);

// Component for Table Header
const TableHeader = ({ column, sortColumn, sortDirection, onSort }) => {
  const isSorted = sortColumn === column.key;
  
  return (
    <th
      className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 
                 uppercase tracking-wider cursor-pointer hover:bg-gray-100 
                 transition-colors duration-200 sticky top-0"
      onClick={() => onSort(column.key)}
    >
      <div className="flex items-center space-x-1">
        <span>{column.label}</span>
        <div className="flex flex-col">
          <ChevronUp
            size={12}
            className={`${isSorted && sortDirection === 'asc' ? 'text-lightBlue-600' : 'text-gray-400'}`}
          />
          <ChevronDown
            size={12}
            className={`${isSorted && sortDirection === 'desc' ? 'text-lightBlue-600' : 'text-gray-400'}`}
          />
        </div>
      </div>
    </th>
  );
};

// Loading Skeleton Component - Updated to use tr directly
const TableSkeleton = ({ columns }) => (
  <>
    {[...Array(5)].map((_, rowIndex) => (
      <tr key={rowIndex} className="border-b border-gray-200">
        {[...Array(columns)].map((_, colIndex) => (
          <td key={colIndex} className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded"></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

const HistoricalTab = ({ symbol, type }) => {
  const dispatch = useDispatch();

  // Redux Selectors
  const historicalData = useSelector(selectHistoricalData);
  const { historicalLoading, isRefreshing } = useSelector(selectLoadingStates);
  const activeTimeRange = useSelector(selectHistoricalTimeRange);

  // Local State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // Time Range Options
  const timeRanges = [
    { label: '1D', value: '1D', icon: Clock },
    { label: '1W', value: '1W', icon: Calendar },
    { label: '1M', value: '1M', icon: Calendar },
    { label: '3M', value: '3M', icon: Calendar },
    { label: 'YTD', value: 'YTD', icon: Calendar },
  ];

  // Table Columns Configuration
  const columns = [
    { 
      key: 'date', 
      label: 'Date & Time',
      format: (value) => new Date(value).toLocaleString()
    },
    { 
      key: 'open', 
      label: 'Open',
      format: (value) => formatCurrency(value)
    },
    { 
      key: 'high', 
      label: 'High',
      format: (value) => formatCurrency(value)
    },
    { 
      key: 'low', 
      label: 'Low',
      format: (value) => formatCurrency(value)
    },
    { 
      key: 'close', 
      label: 'Close',
      format: (value) => formatCurrency(value)
    },
    { 
      key: 'pChange', 
      label: 'Change (%)',
      format: (value) => (
        <div className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {value >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {formatNumber(value)}%
        </div>
      )
    },
    { 
      key: 'volume', 
      label: 'Volume',
      format: (value) => formatVolume(value)
    },
    { 
      key: 'value', 
      label: 'Value',
      format: (value) => formatCurrency(value)
    },
  ];

  // Effects
  useEffect(() => {
    if (symbol && type) {
      dispatch(fetchHistoricalData({ 
        symbol, 
        type, 
        timeRange: activeTimeRange 
      }));
    }
  }, [symbol, type, activeTimeRange, dispatch]);

  // Fixed processedData useMemo with proper array handling
// Update the processedData useMemo to handle all data types
const processedData = useMemo(() => {
  if (!Array.isArray(historicalData)) return [];
  
  // Create a copy of the array to avoid mutating the original
  let filteredData = [...historicalData];
  
  // Apply time range filtering if activeTimeRange is set
  if (activeTimeRange) {
    const now = new Date();
    let cutoffDate = new Date(now);

    switch (activeTimeRange) {
      case '1D':
        cutoffDate.setDate(cutoffDate.getDate() - 1);
        break;
      case '1W':
        cutoffDate.setDate(cutoffDate.getDate() - 7);
        break;
      case '1M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        break;
      case 'YTD':
        cutoffDate = new Date(cutoffDate.getFullYear(), 0, 1);
        break;
      default:
        // No filtering needed for 'ALL'
        break;
    }

    if (activeTimeRange !== 'ALL') {
      filteredData = filteredData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= cutoffDate;
      });
    }
  }

  // Apply search filter if needed
  if (searchTerm) {
    filteredData = filteredData.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }
  
  // Apply sorting (create new array to avoid mutating)
  return [...filteredData].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (sortColumn === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    return sortDirection === 'asc' 
      ? (aValue > bValue ? 1 : -1)
      : (aValue < bValue ? 1 : -1);
  });
}, [historicalData, searchTerm, sortColumn, sortDirection, activeTimeRange]);


  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return processedData.slice(startIndex, startIndex + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  useEffect(() => {
    console.log('Historical Data in Component:', historicalData);
    console.log('Processed Data:', processedData);
    console.log('Paginated Data:', paginatedData);
  }, [historicalData, processedData, paginatedData]);

  // Event Handlers
  const handleTimeRangeChange = (range) => {
    dispatch(setActiveFilter(range));
    setCurrentPage(1);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Error Component
  const ErrorDisplay = ({ message, onRetry }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg">
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <p className="text-red-700 font-medium mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 
                   transition-colors duration-200 flex items-center"
      >
        <RefreshCcw className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  );

  // Export Data Function
  const exportToCSV = () => {
    if (!processedData.length) return;

    const csvContent = [
      columns.map(col => col.label).join(','),
      ...processedData.map(row =>
        columns
          .map(col => {
            const value = row[col.key];
            return typeof value === 'string' ? `"${value}"` : value;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${symbol}_historical_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Controls Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Time Range Filters */}
          <div className="flex flex-wrap gap-2">
            {timeRanges.map(range => (
              <TimeRangeButton
                key={range.value}
                label={range.label}
                icon={range.icon}
                active={activeTimeRange === range.value}
                onClick={() => handleTimeRangeChange(range.value)}
              />
            ))}
          </div>

          {/* Search and Export */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm 
                         focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
              />
            </div>
            <button
              onClick={exportToCSV}
              disabled={!processedData.length}
              className="flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-lg 
                       hover:bg-green-100 transition-colors duration-200 disabled:opacity-50"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map(column => (
                  <TableHeader
                    key={column.key}
                    column={column}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicalLoading ? (
                <TableSkeleton columns={columns.length} />
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr 
                    key={row.id || `${symbol}-${row.date}-${index}`}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    {columns.map(column => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.format ? column.format(row[column.key]) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, processedData.length)} of{' '}
                {processedData.length} results
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="border border-gray-200 rounded-md text-sm"
              >
                {[10, 20, 50, 100].map(value => (
                  <option key={value} value={value}>
                    {value} per page
                  </option>
                ))}
              </select>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * itemsPerPage >= processedData.length}
                className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

HistoricalTab.propTypes = {
  symbol: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired
};

export default HistoricalTab;