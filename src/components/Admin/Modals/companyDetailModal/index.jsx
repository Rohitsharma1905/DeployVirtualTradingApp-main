import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { X, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  fetchCompanyDetails,
  fetchHistoricalData,
  setActiveTab,
  setActiveFilter,
  setCurrentPage,
  setItemsPerPage,
  setIsRefreshing,
  resetCompanyDetails,
} from '../../../../redux/Common/companyDetailsSlice';
import {
  fetchHoldings,
  selectHoldings,
  selectTotalHoldingsValue,
} from '../../../../redux/User/trading/tradingSlice';
import { selectActiveEvent } from '../../../../redux/User/events/eventsSlice';
import ModalHeader from './parts/ModalHeader';
import TabNavigation from './parts/TabNavigation';
import OverviewTab from './tabs/OverviewTab';
import HistoricalTab from './tabs/HistoricalTab';
import Buy_SellTab from './tabs/Buy_SellTab';
import TradingViewTab from './tabs/TradingViewTab';
import SubscriptionModal from '../SubscriptionModal';

// Loading Overlay Component
const LoadingOverlay = ({ message = 'Loading data...' }) => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

// Error Display Component
const ErrorDisplay = ({ error, onRetry, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4">
      <div className="flex flex-col items-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-gray-600 text-center mb-6">{error}</p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
);

const CompanyDetailModal = ({ isOpen, onClose, symbol, type = 'nifty50',isGuestUser = false  }) => {
  const dispatch = useDispatch();

  // User ID selector
  const userId = useSelector((state) => state.user.auth?.user?._id);
  const user = useSelector((state) => state.user.auth?.user);
  const subscriptionPlanId = useSelector((state) =>
    state.user.subscriptionPlan?.activeSubscription?._id
  );
  const activeEvent = useSelector(selectActiveEvent);

  // State for SubscriptionModal
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Company Details Selectors
  const {
    data = null,
    historicalData = {
      rawData: [],
      processedData: {
        candlestick: [],
        volume: [],
        technicalIndicators: {
          sma20: [],
          sma50: [],
          sma200: [],
        },
      },
    },
    loading = false,
    historicalLoading = false,
    error = null,
    activeTab = 'overview',
    activeFilter = '1D',
    currentPage = 1,
    itemsPerPage = 5,
    isRefreshing = false,
  } = useSelector((state) => state.common.companyDetails) || {};

  // User Subscription and Holdings Selectors with memoization
  const activeSubscription = useSelector((state) =>
    state.user?.subscriptionPlan?.userSubscriptions?.find(
      (sub) => sub.status === 'Active' && !sub.isDeleted
    )
  );

  const holdings = useSelector(
    selectHoldings,
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const totalHoldingsValue = useSelector(selectTotalHoldingsValue);

  // Helper Functions
  const calculateRemainingBalance = () => {
    if (!activeSubscription?.vertualAmount) return 0;
    return activeSubscription.vertualAmount - totalHoldingsValue;
  };

  const formatLastUpdatedDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Handle different date formats
      let dateToFormat = dateString;
      
      // If it's already a valid date string (ISO format)
      if (typeof dateString === 'string' && dateString.includes('T')) {
        return new Date(dateString).toLocaleString();
      }
      
      // Handle Unix timestamps (if any)
      if (/^\d+$/.test(dateString)) {
        dateToFormat = parseInt(dateString, 10);
      }
      
      // Handle other string formats
      const date = new Date(dateToFormat);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        // Try parsing as Indian date format if standard parsing fails
        const indianDateParts = dateString.split(/[-/]/);
        if (indianDateParts.length === 3) {
          const indianDate = new Date(
            `${indianDateParts[2]}-${indianDateParts[1]}-${indianDateParts[0]}`
          );
          if (!isNaN(indianDate.getTime())) {
            return indianDate.toLocaleString();
          }
        }
        return 'N/A';
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  // Memoized account summary data
  const accountSummaryData = useMemo(() => {
    if (!activeSubscription) return null;

    return {
      balance: calculateRemainingBalance(),
      plan: activeSubscription.plan || 'Basic',
      validTill: formatDate(activeSubscription.endDate),
      initialAmount: activeSubscription.vertualAmount || 0,
    };
  }, [activeSubscription, totalHoldingsValue]);

  // Available Tabs
  const availableTabs = useMemo(() => {
    return ['overview', 'historical', 'trading-view', 'trading'];
  }, []);

// In CompanyDetailModal.jsx
useEffect(() => {
  if (isOpen && symbol) {
    const loadData = async () => {
      try {
        // First load company details
        await dispatch(fetchCompanyDetails({ symbol, type })).unwrap();
        
        // Then load historical data
        await dispatch(fetchHistoricalData({ symbol, type, timeRange: '1D' })).unwrap();
        
        // Only load holdings if we have the required IDs
        if (userId && subscriptionPlanId) {
          await dispatch(fetchHoldings({ userId, subscriptionPlanId })).unwrap();
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(`Failed to load data for ${symbol}`);
      }
    };

    loadData();
  }
}, [isOpen, symbol, type, dispatch, userId, subscriptionPlanId]);

  useEffect(() => {
    if (isOpen && userId && subscriptionPlanId) {
      dispatch(fetchHoldings({ userId, subscriptionPlanId }));
    }
  }, [isOpen, userId, subscriptionPlanId, dispatch]);

  // Event Handlers
  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
    if (['chart', 'advanced-chart', 'historical'].includes(tab)) {
      dispatch(fetchHistoricalData({ symbol, type, timeRange: activeFilter }));
    }
  };

  const handleFilterChange = (filter) => {
    dispatch(setActiveFilter(filter));
    dispatch(setCurrentPage(1));
    dispatch(fetchHistoricalData({ symbol, type, timeRange: filter }));
  };

  const handleRefresh = async () => {
    if (isRefreshing || loading) return;
  
    dispatch(setIsRefreshing(true));
    try {
      await dispatch(fetchCompanyDetails({ symbol, type })).unwrap();
      await dispatch(fetchHistoricalData({ symbol, type, timeRange: activeFilter })).unwrap();
      
      // Only fetch holdings if we have valid IDs
      if (userId && subscriptionPlanId) {
        await dispatch(fetchHoldings({ userId, subscriptionPlanId })).unwrap();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error(`Error refreshing data:` `${error.message || 'Unknown error'}`);
    } finally {
      dispatch(setIsRefreshing(false));
    }
  };

  // Render Functions
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            data={data}
            loading={loading || isRefreshing}
            error={error}
            onRefresh={handleRefresh}
          />
        );
      case 'trading-view':
        return (
          <TradingViewTab symbol={symbol} loading={loading || isRefreshing} />
        );
        case 'historical':
          return (
            <HistoricalTab
              data={historicalData}
              loading={historicalLoading}
              error={error}
              onTimeRangeChange={(range) => {
                dispatch(setActiveFilter(range));
                dispatch(setCurrentPage(1));
              }}
              onRefresh={handleRefresh}
            />
          );
// In CompanyDetailModal.jsx, modify the trading case in renderTabContent:

case 'trading':
  return (
    <Buy_SellTab
      symbol={symbol}
      type={type} // Ensure type is passed explicitly
      data={{
        type: type,  
        stockType: type,
        companyName: data?.companyName,
        currentPrice: data?.lastPrice || data?.currentPrice,
        lastPrice: data?.lastPrice,
        change: data?.change,
        changePercent: data?.pChange,
        dayHigh: data?.dayHigh,
        dayLow: data?.dayLow,
        yearHigh: data?.yearHigh,
        yearLow: data?.yearLow,
        volume: data?.totalTradedVolume,
        marketCap: data?.marketCap,
        historicalData: historicalData?.rawData || []
      }}
      loading={loading || historicalLoading || isRefreshing}
      error={error}
      onOpenSubscriptionModal={() => setIsSubscriptionModalOpen(true)}
    />
  );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  if (error) {
    return (
      <ErrorDisplay 
        error={error.message || error.toString()} 
        onRetry={handleRefresh} 
        onClose={onClose} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-gray-900 opacity-50 transition-opacity z-0" 
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-10">
        {/* <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"> */}
        <div className={`relative w-full max-w-6xl h-full max-h-[90vh] bg-gray-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden  ${isGuestUser ? 'mt-50' : 'mt-0'}`}>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-all duration-200 z-10 group"
            aria-label="Close modal"
          >
            <X
              size={24}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 z-20 bg-gray-50">
              <ModalHeader
                type={type}
                onClose={onClose}
                symbol={symbol}
                data={data}
                loading={loading || isRefreshing}
                onRefresh={handleRefresh}
              />
            </div>

            <div className="px-6 pb-6">
              <div className="sticky top-[72px] z-10 bg-gray-50 py-4">
                <TabNavigation
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  type={type}
                  loading={loading}
                  availableTabs={availableTabs}
                  accountSummary={accountSummaryData}
                  isUpdating={loading || isRefreshing}
                />
              </div>

              <div className="relative">
                {(loading || isRefreshing) && <LoadingOverlay />}
                {renderTabContent()}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
  <div className="flex flex-row items-center justify-between text-sm text-gray-500">
    <p className="text-gray-400">Data provided by NSE India</p>
    <p className="flex items-center">
      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
      Last updated:{' '}
      {data?.lastUpdateTime
        ? formatLastUpdatedDate(data.lastUpdateTime)
        : 'N/A'}
    </p>
  </div>
</div>
        </div>
      </div>

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        selectedUser={user}
        onSuccess={() => {
          toast.success('Subscription updated successfully');
          setIsSubscriptionModalOpen(false);
        }}
        isGuestUser={isGuestUser}
      />
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('CompanyDetailModal Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          error="An unexpected error occurred"
          onClose={this.props.onClose}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}

// Custom scrollbar styles
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

CompanyDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['nifty50', 'nifty500', 'etf']),
  isGuestUser: PropTypes.bool,
};

CompanyDetailModal.defaultProps = {
  type: 'nifty50',
  isGuestUser: false,
};

export default CompanyDetailModal;