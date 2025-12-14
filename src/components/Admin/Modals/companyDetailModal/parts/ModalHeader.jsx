import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

const MetricCard = ({ label, value, isHighlighted, type }) => {
  const getHighlightColor = () => {
    if (!isHighlighted) return 'bg-gray-50';
    return type === 'positive' ? 'bg-green-50' : 'bg-red-50';
  };

  const getTextColor = () => {
    if (!isHighlighted) return 'text-gray-900';
    return type === 'positive' ? 'text-green-700' : 'text-red-700';
  };

  const getBorderColor = () => {
    if (!isHighlighted) return 'border-gray-200';
    return type === 'positive' ? 'border-green-200' : 'border-red-200';
  };

  return (
    <div className={`px-3 py-1.5 ${getHighlightColor()} ${getBorderColor()} rounded-md border transition-all duration-150`}>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className={`text-sm font-semibold tabular-nums ${getTextColor()}`}>{value}</div>
    </div>
  );
};

const ModalHeader = ({ type, onClose, symbol, data, loading, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatValue = (value, formatType = 'number') => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (formatType) {
      case 'currency':
        return `₹${Number(value).toLocaleString('en-IN', {
          maximumFractionDigits: 2
        })}`;
      case 'percentage':
        return `${Number(value).toFixed(2)}%`;
      case 'volume':
        const num = Number(value);
        if (num >= 10000000) return `${(num / 10000000).toFixed(2)}Cr`;
        if (num >= 100000) return `${(num / 100000).toFixed(2)}L`;
        return num.toLocaleString('en-IN');
      default:
        return value;
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing || loading) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="p-4 sm:p-6 border-b border-gray-100 bg-white">
      {!loading && data ? (
        <>
          {/* Desktop Layout (lg screens and up) */}
          <div className="hidden lg:flex items-center justify-between gap-4">
            {/* Left Side - Symbol and Basic Info */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 bg-lightBlue-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-xs">
                <span className="text-xl font-bold text-white">{symbol.charAt(0)}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900 truncate min-w-[120px]">{symbol}</h2>
                <span className={`text-xl font-bold tabular-nums ${
                  data.pChange > 0 ? 'text-green-600' : 
                  data.pChange < 0 ? 'text-red-600' : 'text-lightBlue-600'
                }`}>
                  {formatValue(data.lastPrice, 'currency')}
                </span>
                <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                  data.pChange > 0 
                    ? 'bg-green-50 text-green-600 border border-green-100' 
                    : data.pChange < 0
                    ? 'bg-red-50 text-red-600 border border-red-100'
                    : 'bg-blue-50 text-lightBlue-600 border border-blue-100'
                }`}>
                  {data.pChange > 0 ? (
                    <ArrowUpRight size={14} className="mr-1" />
                  ) : data.pChange < 0 ? (
                    <ArrowDownRight size={14} className="mr-1" />
                  ) : null}
                  <span>{formatValue(data.pChange, 'percentage')}</span>
                </div>
                <span className="px-2 py-0.5 bg-blue-50 text-lightBlue-600 rounded-full text-xs font-medium">
                  {type === 'etf' ? 'ETF' : 'EQUITY'}
                </span>
                <span className="text-xs text-gray-500">NSE • {data.lastUpdateTime ? new Date(data.lastUpdateTime).toLocaleTimeString() : 'Live'}</span>
              </div>
            </div>

            {/* Right Side - Metrics and Controls */}
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <MetricCard 
                  label="Open" 
                  value={formatValue(data.open, 'currency')}
                  isHighlighted={data.open !== data.previousClose}
                  type={data.open > data.previousClose ? 'positive' : 'negative'}
                />
                <MetricCard 
                  label="High" 
                  value={formatValue(data.dayHigh, 'currency')}
                  isHighlighted={data.lastPrice === data.dayHigh}
                  type="positive"
                />
                <MetricCard 
                  label="Low" 
                  value={formatValue(data.dayLow, 'currency')}
                  isHighlighted={data.lastPrice === data.dayLow}
                  type="negative"
                />
                <MetricCard 
                  label="Prev Close" 
                  value={formatValue(data.previousClose, 'currency')}
                  isHighlighted={false}
                />
                <MetricCard 
                  label="Volume" 
                  value={formatValue(data.totalTradedVolume, 'volume')}
                  isHighlighted={false}
                />
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  className={`p-2 rounded-lg transition-all ${
                    loading || isRefreshing
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Refresh data"
                >
                  <RefreshCw 
                    size={18} 
                    className={`transition-transform duration-700 ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  />
                </button>

                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Layout (below lg screens) */}
          <div className="lg:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
            {/* Left Side - Symbol and Price */}
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-lightBlue-600 rounded-lg flex-shrink-0 flex items-center justify-center shadow-xs">
                <span className="text-xl font-bold text-white">{symbol.charAt(0)}</span>
              </div>
              
              <div className="min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{symbol}</h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg sm:text-xl font-bold tabular-nums ${
                      data.pChange > 0 ? 'text-green-600' : 
                      data.pChange < 0 ? 'text-red-600' : 'text-lightBlue-600'
                    }`}>
                      {formatValue(data.lastPrice, 'currency')}
                    </span>
                    <div className={`flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      data.pChange > 0 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : data.pChange < 0
                        ? 'bg-red-50 text-red-600 border border-red-100'
                        : 'bg-blue-50 text-lightBlue-600 border border-blue-100'
                    }`}>
                      {data.pChange > 0 ? (
                        <ArrowUpRight size={14} className="mr-1" />
                      ) : data.pChange < 0 ? (
                        <ArrowDownRight size={14} className="mr-1" />
                      ) : null}
                      <span>{formatValue(data.pChange, 'percentage')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-lightBlue-600 rounded-full text-xs font-medium">
                    {type === 'etf' ? 'ETF' : 'EQUITY'}
                  </span>
                  <span className="text-xs text-gray-500">NSE • {data.lastUpdateTime ? new Date(data.lastUpdateTime).toLocaleTimeString() : 'Live'}</span>
                </div>
              </div>
              <div className="flex ml-66 items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  className={`p-2 rounded-lg transition-all ${
                    loading || isRefreshing
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                  title="Refresh data"
                >
                  <RefreshCw 
                    size={18} 
                    className={`transition-transform duration-700 ${
                      isRefreshing ? 'animate-spin' : ''
                    }`}
                  />
                </button>

                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg transition-all bg-gray-50 text-gray-600 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Right Side - Metrics and Controls */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <MetricCard 
                  label="Open" 
                  value={formatValue(data.open, 'currency')}
                  isHighlighted={data.open !== data.previousClose}
                  type={data.open > data.previousClose ? 'positive' : 'negative'}
                />
                <MetricCard 
                  label="High" 
                  value={formatValue(data.dayHigh, 'currency')}
                  isHighlighted={data.lastPrice === data.dayHigh}
                  type="positive"
                />
                <MetricCard 
                  label="Low" 
                  value={formatValue(data.dayLow, 'currency')}
                  isHighlighted={data.lastPrice === data.dayLow}
                  type="negative"
                />
                <MetricCard 
                  label="Prev Close" 
                  value={formatValue(data.previousClose, 'currency')}
                  isHighlighted={false}
                />
                <MetricCard 
                  label="Volume" 
                  value={formatValue(data.totalTradedVolume, 'volume')}
                  isHighlighted={false}
                />
              </div>


            </div>
          </div>
        </>
      ) : (
        // Loading State
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-20 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ModalHeader.propTypes = {
  type: PropTypes.oneOf(['nifty', 'etf']).isRequired,
  onClose: PropTypes.func.isRequired,
  symbol: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.shape({
    lastPrice: PropTypes.number,
    pChange: PropTypes.number,
    open: PropTypes.number,
    dayHigh: PropTypes.number,
    dayLow: PropTypes.number,
    previousClose: PropTypes.number,
    totalTradedVolume: PropTypes.number,
    lastUpdateTime: PropTypes.string
  }),
  onRefresh: PropTypes.func
};

ModalHeader.defaultProps = {
  loading: false,
  data: null,
  onRefresh: () => {}
};

export default ModalHeader;