import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { 
  selectActiveEvent,
} from '../../../../../redux/User/events/eventsSlice';
import {
  placeOrder,
  selectLoadingState,
  fetchTransactionHistory,
  selectTransactions,
  selectHoldings,
  selectHoldingBySymbol,
  fetchHoldings,
} from '../../../../../redux/User/trading/tradingSlice';
import { 
  fetchHistoricalData,
  selectCurrentPrice,
  selectPriceAnalysis,
  selectHistoricalData
} from '../../../../../redux/Common/companyDetailsSlice';
import { getUserSubscriptions } from '../../../../../redux/User/userSubscriptionPlan/userSubscriptionPlansSlice';
import ConfirmationModal from '../../ConformationModal';
import PraedicoAnalysis from './PraedicoAnalysis';
import TransactionHistory from './TransactionHistory';
import TradingControls from './TradingControls';
import MarketStatusOverlay from './../parts/MarketStatusOverlay';
import { isMarketOpen } from '../../../../../utils/marketStatus';

const formatCurrency = (amount) => {
  if (!amount || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const validateOrder = (orderDetails, holdings, remainingBalance) => {
  const { type, numberOfShares, price, currentMarketPrice, symbol, stockType } = orderDetails;
  
  if (!numberOfShares || isNaN(numberOfShares)) {
    throw new Error('Please enter a valid number of shares');
  }

  if (numberOfShares <= 0) {
    throw new Error('Number of shares must be greater than zero');
  }

  const orderValue = numberOfShares * (price || currentMarketPrice);

  if (type === 'buy') {
    if (orderValue > remainingBalance) {
      throw new Error('Insufficient balance for this order');
    }
    
    if (!stockType || !['nifty50', 'nifty500', 'etf'].includes(stockType)) {
      throw new Error('Please select a valid stock type for purchase');
    }
  } else if (type === 'sell') {
    const currentHolding = holdings.find(h => 
      h.companySymbol.toLowerCase() === symbol.toLowerCase()
    );
    
    if (!currentHolding) {
      throw new Error(`You don't have any ${symbol} shares to sell`);
    }
    
    if (currentHolding.quantity < numberOfShares) {
      throw new Error(`Insufficient shares. You only have ${currentHolding.quantity} shares`);
    }

    if (!currentHolding.stockType) {
      throw new Error(`Invalid stock type in your holdings`);
    }
  }

  return true;
};

const handlePlaceOrder = async () => {
  try {
    if (!activeSubscription?._id) {
      throw new Error('No active subscription found');
    }

    const orderValue = calculateOrderValue();
    const PORTAL_FEE = 25;
    const totalWithFee = activeTab === 'buy' 
      ? orderValue + PORTAL_FEE 
      : orderValue - PORTAL_FEE;

    // Determine stockType based on buy/sell
    const stockType = activeTab === 'buy'
      ? ['nifty50', 'nifty500', 'etf'].includes(data?.type) 
        ? data.type 
        : 'nifty50'
      : currentHolding?.stockType || 'nifty50';

    const orderDetails = {
      userId,
      subscriptionPlanId: activeSubscription._id,
      symbol: symbol,
      type: activeTab,
      stockType,
      numberOfShares: quantity,
      price: orderType === 'market' ? currentMarketPrice : price,
      total: orderValue,
      currentMarketPrice,
      orderType,
      eventId: activeEvent?._id,
      portalFee: PORTAL_FEE,
      totalWithFee
    };

    // Validate before placing order
    try {
      validateOrder(orderDetails, holdings, calculateRemainingBalance);
    } catch (validationError) {
      toast.error(validationError.message);
      setShowConfirmation(false);
      return;
    }

    // Dispatch the order
    const result = await dispatch(placeOrder(orderDetails)).unwrap();

    toast.success(
      `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ` +
      `${quantity} shares of ${symbol}` +
      `for ₹${totalWithFee.toFixed(2)}`,
      { duration: 3000 }
    );

    // Reset form
    setShowConfirmation(false);
    setQuantity(0);
    setOrderType('market');
    setPrice(currentMarketPrice);
    setStopPrice(currentMarketPrice);

    // Refresh data
    if (userId) {
      await Promise.all([
        dispatch(fetchHoldings({ userId, subscriptionPlanId: activeSubscription._id })),
        dispatch(fetchTransactionHistory({ userId }))
      ]);
    }

    return result;
  } catch (error) {
    console.error('Order error:', error);
    toast.error(error.message || 'Failed to place order');
    setShowConfirmation(false);
    throw error;
  }
};

const BuySellTab = ({ symbol, data, loading, error, onOpenSubscriptionModal }) => {
  const dispatch = useDispatch();
  
  // Redux selectors
  const userId = useSelector((state) => state.user.auth?.user?._id);
  const userSubscriptions = useSelector((state) => 
    state.user.subscriptionPlan?.userSubscriptions || []
  );
  const holdings = useSelector(selectHoldings);
  const currentHolding = useSelector((state) => selectHoldingBySymbol(state, symbol));
  const { loading: tradingLoading } = useSelector(selectLoadingState);
  const activeEvent = useSelector(selectActiveEvent);
  const currentPrice = useSelector(selectCurrentPrice);
  const priceAnalysis = useSelector(selectPriceAnalysis);
  const historicalData = useSelector(selectHistoricalData);

  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('buy');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState(currentPrice);
  const [stopPrice, setStopPrice] = useState(currentPrice);

  // Memoized values
  const safeData = useMemo(() => data || {}, [data]);
  
  const currentMarketPrice = useMemo(() => {
    const price = Number(currentPrice) || 
                 Number(safeData.currentPrice) || 
                 Number(safeData.lastPrice) || 0;
    return isNaN(price) ? 0 : price;
  }, [currentPrice, safeData]);

  const activeSubscription = useMemo(
    () => userSubscriptions.find((sub) => sub.status === 'Active' && !sub.isDeleted),
    [userSubscriptions]
  );

  const calculateRemainingBalance = useMemo(() => {
    if (!activeSubscription) return 0;
    const totalHoldings = holdings.reduce(
      (total, holding) => total + (holding.quantity * holding.averageBuyPrice),
      0
    );
    return activeSubscription.vertualAmount - totalHoldings;
  }, [activeSubscription, holdings]);

  const marketOpen = isMarketOpen();

  useEffect(() => {
    const initializeData = async () => {
      if (symbol && userId) {
        try {
          setIsLoading(true);
          await Promise.all([
            dispatch(fetchHistoricalData({ 
              symbol, 
              type: data?.type || 'nifty50', 
              timeRange: '1M' 
            })),
            dispatch(getUserSubscriptions(userId)),
            dispatch(fetchHoldings(userId)),
            dispatch(fetchTransactionHistory({ userId, symbol }))
          ]);
        } catch (error) {
          console.error('Error initializing data:', error);
          toast.error('Failed to load trading data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeData();
  }, [dispatch, symbol, userId, data?.type]);

  useEffect(() => {
    setPrice(currentMarketPrice);
    setStopPrice(currentMarketPrice);
  }, [currentMarketPrice]);

  useEffect(() => {
    setQuantity(0);
    setOrderType('market');
    setPrice(currentMarketPrice);
    setStopPrice(currentMarketPrice);
  }, [activeTab, currentMarketPrice]);

  const handleQuantityChange = (value) => {
    let newValue = Math.max(0, parseInt(value) || 0);
    
    if (activeTab === 'buy') {
      const maxAffordable = Math.floor(calculateRemainingBalance / currentMarketPrice);
      newValue = Math.min(newValue, maxAffordable);
    } else {
      const availableShares = currentHolding?.quantity || 0;
      newValue = Math.min(newValue, availableShares);
    }
    
    setQuantity(newValue);
  };

  const handlePriceChange = (value) => {
    const newPrice = Math.max(0, parseFloat(value) || 0);
    setPrice(newPrice);
  };

  const handleStopPriceChange = (value) => {
    const newStopPrice = Math.max(0, parseFloat(value) || 0);
    setStopPrice(newStopPrice);
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    if (type === 'market') {
      setPrice(currentMarketPrice);
      setStopPrice(currentMarketPrice);
    }
  };

  const calculateOrderValue = () => {
    const orderPrice = orderType === 'market' ? currentMarketPrice : price;
    return quantity * orderPrice;
  };
  
  const handlePlaceOrder = async () => {
    try {
      if (!activeSubscription?._id) {
        throw new Error('No active subscription found');
      }

      const orderValue = calculateOrderValue();
      const PORTAL_FEE = 25;
      const totalWithFee = activeTab === 'buy' 
        ? orderValue + PORTAL_FEE 
        : orderValue - PORTAL_FEE;

      // Determine stockType based on buy/sell
      const stockType = activeTab === 'buy'
        ? ['nifty50', 'nifty500', 'etf'].includes(data?.type) 
          ? data.type 
          : 'nifty50'
        : currentHolding?.stockType || 'nifty50';

      const orderDetails = {
        userId,
        subscriptionPlanId: activeSubscription._id,
        symbol: symbol,
        type: activeTab,
        stockType,
        numberOfShares: quantity,
        price: orderType === 'market' ? currentMarketPrice : price,
        total: orderValue,
        currentMarketPrice,
        orderType,
        eventId: activeEvent?._id,
        portalFee: PORTAL_FEE,
        totalWithFee
      };

      // Validate before placing order
      validateOrder(orderDetails, holdings, calculateRemainingBalance);

      // Dispatch the order
      const result = await dispatch(placeOrder(orderDetails)).unwrap();

      toast.success(
        `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ` +
        `${quantity} shares of ${symbol} (${stockType}) ` +
        `for ₹${totalWithFee.toFixed(2)}`,
        { duration: 3000 }
      );

      // Reset form
      setShowConfirmation(false);
      setQuantity(0);
      setOrderType('market');
      setPrice(currentMarketPrice);
      setStopPrice(currentMarketPrice);

      // Refresh data
      if (userId) {
        await Promise.all([
          dispatch(fetchHoldings({ userId, subscriptionPlanId: activeSubscription._id })),
          dispatch(fetchTransactionHistory({ userId }))
        ]);
      }

      return result;
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.message || 'Failed to place order');
      setShowConfirmation(false);
      throw error;
    }
  };

  // Render helpers
  const renderTradingStats = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-3 sm:p-4 border border-blue-100">
        <h4 className="text-xs sm:text-sm text-gray-600 mb-1">Holdings</h4>
        <p className="text-lg sm:text-xl font-bold text-lightBlue-600">
          {currentHolding?.quantity || 0} shares
        </p>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-3 sm:p-4 border border-green-100">
        <h4 className="text-xs sm:text-sm text-gray-600 mb-1">Avg. Price</h4>
        <p className="text-lg sm:text-xl font-bold text-green-600">
          {formatCurrency(currentHolding?.averageBuyPrice || 0)}
        </p>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-3 sm:p-4 border border-purple-100">
        <h4 className="text-xs sm:text-sm text-gray-600 mb-1">Current Value</h4>
        <p className="text-lg sm:text-xl font-bold text-purple-600">
          {formatCurrency((currentHolding?.quantity || 0) * currentMarketPrice)}
        </p>
      </div>
    </div>
  );

  const renderTradingTabs = () => (
    <div className="bg-gray-100 p-0.5 rounded-lg inline-flex gap-1 shadow-sm mb-3 sm:mb-4">
      <button
        onClick={() => setActiveTab('buy')}
        className={`px-4 sm:px-6 py-1 rounded-md text-sm sm:text-base font-semibold ${
          activeTab === 'buy'
            ? 'bg-green-500 text-white'
            : 'text-gray-600 hover:bg-green-50'
        }`}
      >
        Buy
      </button>
      <button
        onClick={() => setActiveTab('sell')}
        className={`px-4 sm:px-6 py-1 rounded-md text-sm sm:text-base font-semibold ${
          activeTab === 'sell'
            ? 'bg-red-500 text-white'
            : 'text-gray-600 hover:bg-red-50'
        }`}
      >
        Sell
      </button>
    </div>
  );

  // Loading State
  if (loading || tradingLoading || isLoading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded-lg mb-4 w-1/2"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-6">
        <div className="text-center text-red-500 flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">Error Loading Data</span>
          <span className="text-sm">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Subscription Check
  const canTrade = activeSubscription?.status === 'Active' && calculateRemainingBalance > 0;
  
  if (!canTrade) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center flex-col gap-4 p-4">
        <div className="text-lg sm:text-xl text-gray-600 text-center">
          {!activeSubscription
            ? 'Please subscribe to start trading'
            : 'Your subscription has expired or has insufficient balance'}
        </div>
        <button
          onClick={onOpenSubscriptionModal}
          className="px-6 py-2 bg-lightBlue-600 text-white rounded-lg hover:bg-lightBlue-600 transition-colors"
        >
          View Subscription Plans
        </button>
      </div>
    );
  }

  // Main Render
    return (
      <div className="w-full bg-white rounded-xl shadow-lg p-4 sm:p-6 space-y-4 sm:space-y-6 relative">
        {!marketOpen && <MarketStatusOverlay tradingPreference={activeSubscription?.tradingPreference} />}
  
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* Left Side - Trading Controls */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6">
          {renderTradingStats()}
          {renderTradingTabs()}

          <TradingControls
            activeTab={activeTab}
            currentMarketPrice={currentMarketPrice}
            quantity={quantity}
            setQuantity={handleQuantityChange}
            orderType={orderType}
            setOrderType={handleOrderTypeChange}
            price={price}
            setPrice={handlePriceChange}
            stopPrice={stopPrice}
            setStopPrice={handleStopPriceChange}
            isDisabled={!marketOpen}
            setShowConfirmation={setShowConfirmation}
            calculateTotal={calculateOrderValue}
            maxQuantity={activeTab === 'buy' 
              ? Math.floor(calculateRemainingBalance / currentMarketPrice)
              : currentHolding?.quantity || 0
            }
          />
        </div>

        {/* Right Side - Analysis */}
        <div className="flex-1 bg-gray-50 rounded-xl p-4 sm:p-6">
          <PraedicoAnalysis
            data={{
              lastPrice: currentMarketPrice,
              historicalData: historicalData,
              type: data?.type || 'nifty50',
              priceAnalysis: priceAnalysis
            }}
          />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <TransactionHistory 
          symbol={symbol}
          currentPrice={currentMarketPrice}
        />
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handlePlaceOrder}
          title="Confirm Order"
          stockName={data?.companyName || symbol}
          quantity={quantity}
          pricePerStock={orderType === 'market' ? currentMarketPrice : price}
          type={activeTab}
        />
      )}
    </div>
  );
};

BuySellTab.propTypes = {
  symbol: PropTypes.string.isRequired,
  data: PropTypes.shape({
    type: PropTypes.oneOf(['nifty50', 'nifty500', 'etf']),
    companyName: PropTypes.string,
    currentPrice: PropTypes.number,
    lastPrice: PropTypes.number,
    change: PropTypes.number,
    changePercent: PropTypes.number,
    dayHigh: PropTypes.number,
    dayLow: PropTypes.number,
    yearHigh: PropTypes.number,
    yearLow: PropTypes.number,
    volume: PropTypes.number,
    marketCap: PropTypes.number,
    historicalData: PropTypes.array
  }),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onOpenSubscriptionModal: PropTypes.func.isRequired,
};

BuySellTab.defaultProps = {
  data: {
    type: 'nifty50',
    companyName: '',
    currentPrice: 0,
    lastPrice: 0,
    change: 0,
    changePercent: 0,
    dayHigh: 0,
    dayLow: 0,
    yearHigh: 0,
    yearLow: 0,
    volume: 0,
    marketCap: 0,
    historicalData: []
  },
  loading: false,
  error: null,
};

export default BuySellTab;