import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ShoppingCart,
  Package,
  AlertTriangle
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectLoadingState,
  fetchTransactionHistory,
  fetchHoldings
} from '../../../redux/User/trading/tradingSlice';
import Pagination from '../../Common/TableItems/Pagination';
import Loader from '../../Common/Loader';

const PortfolioTable = ({ transactions = [], holdings = [], onStockClick }) => {
  const dispatch = useDispatch();
  
  // State management
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Selectors
  const { loading } = useSelector(selectLoadingState);
  const userId = useSelector((state) => state.user.auth?.user?._id);
  const subscriptionPlanId = useSelector((state) => 
    state.user.subscriptionPlan?.activeSubscription?._id
  );

  // Improved stock type detection
  const getStockType = (symbol, stockType, transactions = []) => {
    // Priority 1: Use explicitly provided type
    if (stockType) return stockType;
    
    // Priority 2: Get type from transactions (most recent first)
    const sortedTxs = [...transactions].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt));
    const txWithType = sortedTxs.find(t => t.companySymbol === symbol);
    if (txWithType?.stockType) return txWithType.stockType;
    
    // Priority 3: Get type from holdings
    const holdingWithType = holdings.find(h => h.companySymbol === symbol);
    if (holdingWithType?.stockType) return holdingWithType.stockType;
    
    // Priority 4: Check if it's an ETF (case-insensitive)
    if (typeof symbol === 'string' && symbol.toUpperCase().includes('ETF')) {
      return 'etf';
    }
    
    // Default to nifty500 (since it's the largest universe)
    return 'nifty500';
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId && subscriptionPlanId) {
          await dispatch(fetchHoldings({ userId, subscriptionPlanId }));
          await dispatch(fetchTransactionHistory({ userId }));
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err);
      }
    };

    fetchData();
  }, [dispatch, userId, subscriptionPlanId, lastRefresh]);

  // Calculate stock statistics
  const getStockStats = (symbol) => {
    try {
      if (!symbol) return { totalTrades: 0, buyTrades: 0, sellTrades: 0 };

      const stockTransactions = transactions.filter(t => 
        t?.companySymbol === symbol
      );
      
      const totalBuyShares = stockTransactions
        .filter(t => t?.type === 'buy')
        .reduce((total, transaction) => 
          total + (transaction.numberOfShares || 0), 0);
      
      const totalSellShares = stockTransactions
        .filter(t => t?.type === 'sell')
        .reduce((total, transaction) => 
          total + (transaction.numberOfShares || 0), 0);

      return {
        totalTrades: stockTransactions.length,
        buyTrades: totalBuyShares,
        sellTrades: totalSellShares,
        type: getStockType(symbol, null, transactions)
      };
    } catch (error) {
      console.error('Error calculating stock stats:', error);
      return { totalTrades: 0, buyTrades: 0, sellTrades: 0, type: 'nifty50' };
    }
  };

  // Combine holdings and transactions with proper type handling
  const combinedStocks = useMemo(() => {
    try {
      // Create a map of holdings with their types
      const holdingsMap = new Map(
        holdings.map(holding => [
          holding?.companySymbol,
          {
            ...holding,
            type: holding?.stockType || getStockType(holding?.companySymbol, null, transactions)
          }
        ])
      );

      // Get unique symbols from transactions
      const transactionSymbols = new Set(
        transactions
          .map(t => t?.companySymbol)
          .filter(Boolean)
      );

      // Combine and deduplicate
      return [...holdingsMap.keys(), ...transactionSymbols]
        .filter((symbol, index, self) => 
          symbol && self.indexOf(symbol) === index
        )
        .map(symbol => {
          const holding = holdingsMap.get(symbol) || {
            companySymbol: symbol,
            quantity: 0,
            averageBuyPrice: 0,
            lastUpdated: transactions
              .filter(t => t?.companySymbol === symbol)
              .sort((a, b) => 
                new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0)
              )[0]?.createdAt || new Date(),
            type: getStockType(symbol, null, transactions)
          };

          return holding;
        });
    } catch (error) {
      console.error('Error computing combined stocks:', error);
      return [];
    }
  }, [holdings, transactions]);

  // Sort by last updated
  const sortedStocks = [...combinedStocks].sort((a, b) => {
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = sortedStocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStocks.length / itemsPerPage);

  // Helper functions
  const extractDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  const handleRefresh = () => {
    setLastRefresh(Date.now());
  };

  const handleStockClick = (symbol, type) => {
    if (onStockClick) {
      onStockClick(symbol, type || getStockType(symbol, null, transactions));
    }
  };

  // Error handling
  if (error) {
    return (
      <div className="bg-white rounded shadow-lg overflow-hidden w-full p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-red-600 mb-4">
          Failed to Load Portfolio
        </h2>
        <p className="text-gray-600 mb-6">
          {error.message || 'An unexpected error occurred while fetching your portfolio.'}
        </p>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-600 transition-colors"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  // Loading state
  if (loading && transactions.length === 0) {
    return <Loader />;
  }

  // Empty state
  if (sortedStocks.length === 0) {
    return (
      <div className="bg-white rounded shadow-lg overflow-hidden w-full p-8 text-center">
        <div className="text-2xl font-semibold text-gray-700 mb-4">
          📊 No Stock Details Available
        </div>
        <div className="text-lg text-gray-500 mb-6">
          {transactions.length === 0 
            ? 'Start trading to see your portfolio history here.'
            : 'No holdings found for the selected transactions.'}
        </div>
        <button
          onClick={handleRefresh}
          className="px-6 py-3 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-600 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className='flex flex-col'>
      <div className="bg-white rounded shadow-lg overflow-x-auto max-h-[500px] overflow-y-auto w-full h-72 px-4">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Avg. Price</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Current Value</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Trading Activity</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Performance</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentStocks.map((stock) => {
              const stats = getStockStats(stock.companySymbol);
              const currentValue = stock.quantity * (stock.averageBuyPrice || 0);
              const isSoldOut = stock.quantity === 0;

              return (
                <tr key={stock.companySymbol} onClick={() => handleStockClick(stock.companySymbol, stock.type)}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {stock.companySymbol}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-medium text-gray-500 capitalize">
                      {stock.type}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {stock.quantity} {isSoldOut && '(Sold Out)'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {stock.averageBuyPrice ? `₹${stock.averageBuyPrice.toFixed(2)}` : '₹0.00'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ₹{currentValue.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <span 
                        id={`buy-tooltip-${stock.companySymbol}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center space-x-1`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>{stats.buyTrades}</span>
                      </span>
                      <Tooltip 
                        anchorId={`buy-tooltip-${stock.companySymbol}`}
                        content={`${stats.buyTrades} Shares Bought`}
                        place="top"
                      />

                      <span 
                        id={`sell-tooltip-${stock.companySymbol}`}
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 flex items-center space-x-1`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{stats.sellTrades}</span>
                      </span>
                      <Tooltip 
                        anchorId={`sell-tooltip-${stock.companySymbol}`}
                        content={`${stats.sellTrades} Shares Sold`}
                        place="top"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm">
                      {currentValue > 0 ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className="ml-1">0.00%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {extractDate(stock.lastUpdated)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        filteredItems={sortedStocks}
        indexOfFirstItem={indexOfFirstItem}
        indexOfLastItem={indexOfLastItem}
      />
    </div>
  );
};

export default PortfolioTable;