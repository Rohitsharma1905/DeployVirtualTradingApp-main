import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Loader from '../../../../Common/Loader';
import { 
  DollarSign, 
  Activity,
  PieChart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  ChevronDown,
  Search
} from 'lucide-react';
import { 
  selectTransactions,
  selectStatistics,
  selectLoadingState 
} from '../../../../../redux/User/trading/tradingSlice';
import toast from 'react-hot-toast';

// Default values for statistics
const defaultStatistics = {
  totalInvestment: 0,
  currentHoldings: 0,
  currentHoldingsValue: 0,
  realizedPL: 0,
  realizedPLPercentage: 0,
  avgBuyPrice: 0,
  avgSellPrice: 0,
  buyTrades: 0,
  sellTrades: 0,
  successRate: 0
};

const TransactionHistory = ({ currentPrice, symbol }) => {
  // Local state for table controls
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Redux selectors with safe defaults
  const transactions = useSelector(selectTransactions) || [];
  const statistics = useSelector(selectStatistics) || defaultStatistics;
  const { loading } = useSelector(selectLoadingState) || { loading: false };

    // Filtered and sorted transactions with error handling
    const filteredTransactions = useMemo(() => {
      try {
        return transactions
          .filter(transaction => {
            if (!transaction) return false;
            
            const matchesSearch = (transaction.createdAt?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                (transaction.type?.toLowerCase() || '').includes(searchTerm.toLowerCase());
            const matchesFilter = filterType === 'all' || transaction.type === filterType;
            const matchesSymbol = symbol ? transaction.companySymbol === symbol : true;
            return matchesSearch && matchesFilter && matchesSymbol;
          })
          .sort((a, b) => {
            if (!a || !b) return 0;
            
            if (sortConfig.key === 'date') {
              return sortConfig.direction === 'asc'
                ? new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
                : new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            }
            
            const aValue = a[sortConfig.key] || 0;
            const bValue = b[sortConfig.key] || 0;
            
            return sortConfig.direction === 'asc'
              ? aValue - bValue
              : bValue - aValue;
          });
      } catch (error) {
        console.error('Error filtering transactions:', error);
        return [];
      }
    }, [transactions, searchTerm, filterType, sortConfig, symbol]);
  
    // Pagination calculations with safety checks
    const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
    const currentPageSafe = Math.min(Math.max(1, currentPage), totalPages);
    const paginatedTransactions = filteredTransactions.slice(
      (currentPageSafe - 1) * itemsPerPage,
      currentPageSafe * itemsPerPage
    );
  
    // Safe sorting handler
    const handleSort = (key) => {
      setSortConfig(prev => ({
        key,
        direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
      }));
    };
  
    // Safe export handler
    const exportTransactions = () => {
      try {
        const csv = [
          ['Date', 'Type', 'Quantity', 'Price', 'Total'],
          ...filteredTransactions.map(t => [
            new Date(t?.createdAt || Date.now()).toLocaleString(),
            t?.type || '',
            t?.numberOfShares || 0,
            t?.price || 0,
            ((t?.price || 0) * (t?.numberOfShares || 0)).toFixed(2)
          ])
        ].map(row => row.join(',')).join('\n');
  
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${symbol || 'all'}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exporting transactions:', error);
        toast.error('Failed to export transactions');
      }
    };
  
    // Format number with safety check
    const formatNumber = (value, decimals = 2) => {
      try {
        return Number(value || 0).toFixed(decimals);
      } catch (error) {
        return '0.00';
      }
    };
  
    // Loading state
    if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
    }
    return (
      <div className="w-full space-y-6">

  
        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
            </div>
  
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-48 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
                />
              </div>
  
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-lightBlue-600"
              >
                <option value="all">All Types</option>
                <option value="buy">Buy Only</option>
                <option value="sell">Sell Only</option>
              </select>
  
              <button
                onClick={exportTransactions}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-lightBlue-600 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
              {/* Transaction Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { key: 'date', label: 'Date' },
                  { key: 'type', label: 'Type' },
                  { key: 'numberOfShares', label: 'Quantity' },
                  { key: 'price', label: 'Price' },
                  { key: 'total', label: 'Total' }
                ].map(column => (
                  <th
                    key={column.key}
                    onClick={() => handleSort(column.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.label}</span>
                      {sortConfig.key === column.key && (
                        <ChevronDown
                          size={14}
                          className={`transform ${
                            sortConfig.direction === 'asc' ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction, index) => (
                  <tr key={transaction?._id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction?.createdAt 
                        ? new Date(transaction.createdAt).toLocaleString()
                        : 'N/A'
                      }
                    </td>
                    <td className="px-4 py-3">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${transaction?.type === 'buy'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {(transaction?.type || 'N/A').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {transaction?.numberOfShares || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{formatNumber(transaction?.price || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ₹{formatNumber((transaction?.price || 0) * (transaction?.numberOfShares || 0))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedTransactions.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border rounded px-2 py-1 text-sm"
                >
                  {[5, 10, 20, 50].map(value => (
                    <option key={value} value={value}>
                      {value} per page
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">
                  Showing {((currentPageSafe - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPageSafe * itemsPerPage, filteredTransactions.length)} of{' '}
                  {filteredTransactions.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPageSafe === 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPageSafe - 1 && page <= currentPageSafe + 1)
                  ))
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPageSafe === page
                            ? 'bg-lightBlue-600 text-white'
                            : 'hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPageSafe === totalPages}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// PropTypes
TransactionHistory.propTypes = {
  currentPrice: PropTypes.number,
  symbol: PropTypes.string
};

// Default Props
TransactionHistory.defaultProps = {
  currentPrice: 0,
  symbol: null
};

export default TransactionHistory;