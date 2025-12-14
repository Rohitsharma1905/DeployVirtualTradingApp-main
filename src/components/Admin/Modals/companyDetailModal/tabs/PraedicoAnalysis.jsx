import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tooltip';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCcw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

// Helper function to calculate 10-day average from historical data
const calculateTenDayAverage = (historicalData) => {
  if (!Array.isArray(historicalData)) return 0;

  // Sort data by date in descending order and get last 10 days
  const sortedData = [...historicalData]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  // Calculate average of closing prices
  const sum = sortedData.reduce((acc, day) => {
    const price = Number(day.close || day.lastPrice);
    return acc + (isNaN(price) ? 0 : price);
  }, 0);

  return sortedData.length > 0 ? sum / sortedData.length : 0;
};

// Helper function to calculate signals based on price comparison
const calculateSignals = (currentPrice, averagePrice) => {
  if (!currentPrice || !averagePrice) {
    return {
      strongBuy: 0,
      buy: 0,
      hold: 1,
      sell: 0,
      strongSell: 0
    };
  }

  const percentageDiff = ((currentPrice - averagePrice) / averagePrice) * 100;
  
  return {
    strongBuy: percentageDiff > 3 ? 1 : 0,
    buy: percentageDiff > 1 && percentageDiff <= 3 ? 1 : 0,
    hold: percentageDiff >= -1 && percentageDiff <= 1 ? 1 : 0,
    sell: percentageDiff < -1 && percentageDiff >= -3 ? 1 : 0,
    strongSell: percentageDiff < -3 ? 1 : 0
  };
};

// Helper function to format currency
const formatPrice = (price) => {
  if (!price || isNaN(price)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

// Helper function to format percentage
const formatPercentage = (percentage) => {
  if (!percentage || isNaN(percentage)) return '0.00%';
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

// AnalysisMeter Component
const AnalysisMeter = ({ signals, className }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [meterPosition, setMeterPosition] = useState(50);

  const totalSignals = Object.values(signals).reduce((a, b) => a + b, 0);

  useEffect(() => {
    const calculatePosition = () => {
      const weights = {
        strongSell: signals.strongSell * 0,
        sell: signals.sell * 25,
        hold: signals.hold * 50,
        buy: signals.buy * 75,
        strongBuy: signals.strongBuy * 100
      };
      const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
      return totalWeight / totalSignals;
    };

    const newPosition = calculatePosition();
    setMeterPosition(newPosition);
  }, [signals, totalSignals]);

  const sections = [
    { 
      name: 'Strong Sell', 
      color: 'bg-red-500', 
      value: signals.strongSell,
      icon: <ArrowDown className="w-3 h-3" />,
      description: 'Price significantly below 10-day average (>3%)'
    },
    { 
      name: 'Sell', 
      color: 'bg-orange-400', 
      value: signals.sell,
      icon: <ArrowDown className="w-3 h-3" />,
      description: 'Price moderately below 10-day average (1-3%)'
    },
    { 
      name: 'Hold', 
      color: 'bg-yellow-400', 
      value: signals.hold,
      icon: <Minus className="w-3 h-3" />,
      description: 'Price near 10-day average (±1%)'
    },
    { 
      name: 'Buy', 
      color: 'bg-blue-400', 
      value: signals.buy,
      icon: <ArrowUp className="w-3 h-3" />,
      description: 'Price moderately above 10-day average (1-3%)'
    },
    { 
      name: 'Strong Buy', 
      color: 'bg-green-500', 
      value: signals.strongBuy,
      icon: <ArrowUp className="w-3 h-3" />,
      description: 'Price significantly above 10-day average (>3%)'
    }
  ];

  return (
    <div className={`relative py-6 ${className}`}>
      {/* Meter Background */}
      <div className="h-3 rounded-full overflow-hidden flex">
        {sections.map((section) => (
          <div
            key={section.name}
            className={`flex-1 ${section.color} relative group cursor-pointer transition-all duration-200`}
            onMouseEnter={() => setHoveredSection(section.name)}
            onMouseLeave={() => setHoveredSection(null)}
            data-tooltip-id="section-tooltip"
            data-tooltip-content={`${section.name}: ${section.description}`}
          >
            {hoveredSection === section.name && (
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                <div className="flex items-center gap-1">
                  {section.icon}
                  <span>{section.name}</span>
                </div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                  <div className="border-4 border-transparent border-t-gray-800" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Indicator Needle */}
      <div
        className="absolute w-0.5 h-6 bg-gray-800 transform -translate-x-1/2 transition-all duration-500 cursor-pointer"
        style={{ left: `${meterPosition}%`, top: '0' }}
        data-tooltip-id="needle-tooltip"
        data-tooltip-content={`Signal Strength: ${meterPosition.toFixed(1)}%`}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-gray-800 -mt-1 -ml-1" />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        {sections.map((section) => (
          <div
            key={section.name}
            className="text-center group relative cursor-pointer"
            onMouseEnter={() => setHoveredSection(section.name)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <div className="flex flex-col items-center">
              <span className="hidden md:block text-xs font-medium">
                {section.name.split(' ').map(word => (
                  <span key={word} className="block">{word}</span>
                ))}
              </span>
              <span className="md:hidden text-xs font-medium flex items-center gap-1">
                {section.icon}
                {section.name.split(' ').map(word => word[0]).join('')}
              </span>
              <span className={`text-xs mt-1 ${
                section.value > 0 ? 'text-gray-900 font-semibold' : 'text-gray-400'
              }`}>
                {section.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main PraedicoAnalysis Component
const PraedicoAnalysis = ({ data, timeframe = '1D' }) => {
  const [selectedTime, setSelectedTime] = useState(timeframe);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const timeframes = [
    { label: '1M', value: '1M' },
    { label: '5M', value: '5M' },
    { label: '15M', value: '15M' },
    { label: '1H', value: '1H' },
    { label: '4H', value: '4H' },
    { label: '1D', value: '1D' }
  ];

  // Memoized calculations
  const currentPrice = useMemo(() => {
    return Number(data?.lastPrice) || 0;
  }, [data?.lastPrice]);

  const averagePrice = useMemo(() => {
    return calculateTenDayAverage(data?.historicalData || []);
  }, [data?.historicalData]);

  const percentageDiff = useMemo(() => {
    if (!currentPrice || !averagePrice) return 0;
    return ((currentPrice - averagePrice) / averagePrice) * 100;
  }, [currentPrice, averagePrice]);

  const signals = useMemo(() => {
    return calculateSignals(currentPrice, averagePrice);
  }, [currentPrice, averagePrice]);

  const getRecommendation = () => {
    if (percentageDiff > 3) return 'STRONG BUY';
    if (percentageDiff > 1) return 'BUY';
    if (percentageDiff < -3) return 'STRONG SELL';
    if (percentageDiff < -1) return 'SELL';
    return 'HOLD';
  };

  const getRecommendationColor = () => {
    const recommendation = getRecommendation();
    switch (recommendation) {
      case 'STRONG BUY': return 'text-green-600';
      case 'BUY': return 'text-lightBlue-600';
      case 'HOLD': return 'text-yellow-600';
      case 'SELL': return 'text-orange-600';
      case 'STRONG SELL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRecommendationIcon = () => {
    const recommendation = getRecommendation();
    switch (recommendation) {
      case 'STRONG BUY':
      case 'BUY':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'STRONG SELL':
      case 'SELL':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Activity className="w-6 h-6 text-yellow-500" />;
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Wait for any refresh logic to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  };

  const indicators = [
    { 
      name: 'RSI', 
      value: data?.rsi || Math.round(50 + (percentageDiff / 10)), 
      type: (data?.rsi || 50) > 70 ? 'overbought' : (data?.rsi || 50) < 30 ? 'oversold' : 'neutral' 
    },
    { 
      name: 'Trend', 
      value: percentageDiff > 0 ? 'Bullish' : 'Bearish', 
      type: percentageDiff > 0 ? 'bullish' : 'bearish' 
    },
    { 
      name: 'MA', 
      value: percentageDiff > 0 ? 'Above' : 'Below', 
      type: percentageDiff > 0 ? 'above' : 'below' 
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-5 w-full md:w-[700px] max-w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold text-gray-800">Praedico Analysis</h2>
          <button 
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCcw className={`w-4 h-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {/* <div className="flex flex-wrap gap-1">
          {timeframes.map((time) => (
            <button
              key={time.value}
              onClick={() => setSelectedTime(time.value)}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                selectedTime === time.value
                  ? 'bg-lightBlue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {time.label}
            </button>
          ))}
        </div> */}
      </div>

      {/* Recommendation */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          {getRecommendationIcon()}
          <h3 className={`text-2xl font-bold ${getRecommendationColor()}`}>
            {getRecommendation()}
          </h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on 10-day average price comparison
        </p>
      </div>

      {/* Analysis Meter */}
      <AnalysisMeter signals={signals} className="mb-6" />

      {/* Price Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        {/* <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Current Price</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(currentPrice)}
          </p>
        </div> */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">10-Day Avg</p>
          <p className="text-sm font-semibold text-gray-900">
            {formatPrice(averagePrice)}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Difference</p>
          <p className={`text-sm font-semibold ${
            percentageDiff > 0 ? 'text-green-600' : 
            percentageDiff < 0 ? 'text-red-600' : 
            'text-gray-900'
          }`}>
            {formatPercentage(percentageDiff)}
          </p>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center border-t pt-4">
        {indicators.map((indicator) => (
          <div key={indicator.name} className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">{indicator.name}</p>
            <p className={`text-sm font-semibold ${
              indicator.type === 'bullish' || indicator.type === 'above' ? 'text-green-600' :
              indicator.type === 'bearish' || indicator.type === 'below' ? 'text-red-600' :
              indicator.type === 'overbought' ? 'text-red-500' :
              indicator.type === 'oversold' ? 'text-green-500' :
              'text-lightBlue-600'
            }`}>
              {indicator.value}
            </p>
          </div>
        ))}
      </div>

      {/* Additional Analysis */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Volume Analysis</h4>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Volume Trend</span>
            <span className="text-sm font-medium text-green-600">
              {data?.volumeTrend || 'Increasing'}
            </span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-2">Price Action</h4>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Trend Direction</span>
            <span className={`text-sm font-medium ${
              percentageDiff > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {percentageDiff > 0 ? 'Upward' : 'Downward'}
            </span>
          </div>
        </div>
      </div>

      {/* Signal Explanation
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Signal Explanation</h4>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            • <span className="font-medium">Strong Buy:</span> Price is more than 3% above the 10-day average
          </p>
          <p className="text-gray-600">
            • <span className="font-medium">Buy:</span> Price is 1-3% above the 10-day average
          </p>
          <p className="text-gray-600">
            • <span className="font-medium">Hold:</span> Price is within 1% of the 10-day average
          </p>
          <p className="text-gray-600">
            • <span className="font-medium">Sell:</span> Price is 1-3% below the 10-day average
          </p>
          <p className="text-gray-600">
            • <span className="font-medium">Strong Sell:</span> Price is more than 3% below the 10-day average
          </p>
        </div>
      </div> */}

      {/* Tooltips */}
      <Tooltip id="section-tooltip" />
      <Tooltip id="needle-tooltip" />
    </div>
  );
};

PraedicoAnalysis.propTypes = {
  data: PropTypes.shape({
    lastPrice: PropTypes.number,
    historicalData: PropTypes.array,
    rsi: PropTypes.number,
    volumeTrend: PropTypes.string,
    type: PropTypes.string
  }),
  timeframe: PropTypes.string
};

AnalysisMeter.propTypes = {
  signals: PropTypes.shape({
    strongBuy: PropTypes.number,
    buy: PropTypes.number,
    hold: PropTypes.number,
    sell: PropTypes.number,
    strongSell: PropTypes.number,
  }).isRequired,
  className: PropTypes.string,
};

export default PraedicoAnalysis;