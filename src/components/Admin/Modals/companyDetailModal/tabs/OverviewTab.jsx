import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../../../Common/Loader';
import { 
  TrendingUp,
  BarChart2, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign
} from 'lucide-react';

const formatValue = (value, type = 'number') => {
  if (value === undefined || value === null) return 'N/A';
  
  switch (type) {
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

const DataRow = ({ label, value, change }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
    <span className="text-sm text-gray-600">{label}</span>
    <div className="flex items-center space-x-3">
      <span className="text-sm font-medium text-gray-900">{value}</span>
      {change !== undefined && (
        <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium
          ${change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {change >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {change}%
        </div>
      )}
    </div>
  </div>
);

const OverviewTab = ({ data, loading, error }) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 bg-red-50 rounded-lg">
        <AlertTriangle className="text-red-500 w-12 h-12 mb-3" />
        <p className="text-red-800 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Price Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="text-lightBlue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Price Information</h2>
        </div>
        <div className="space-y-1">
          <DataRow 
            label="Current Price" 
            value={formatValue(data?.lastPrice, 'currency')}
            change={data?.pChange}
          />
          <DataRow 
            label="Day's Range" 
            value={`${formatValue(data?.dayLow, 'currency')} - ${formatValue(data?.dayHigh, 'currency')}`}
          />
          <DataRow 
            label="52 Week Range" 
            value={`${formatValue(data?.yearLow, 'currency')} - ${formatValue(data?.yearHigh, 'currency')}`}
          />
          <DataRow 
            label="Opening Price" 
            value={formatValue(data?.open, 'currency')}
          />
          <DataRow 
            label="Previous Close" 
            value={formatValue(data?.previousClose, 'currency')}
          />
          <DataRow 
            label="Today's Change" 
            value={formatValue(data?.change, 'currency')}
            change={data?.pChange}
          />
        </div>
      </div>

      {/* Trading Information Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart2 className="text-lightBlue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Trading Information</h2>
        </div>
        <div className="space-y-1">
          <DataRow 
            label="Total Volume" 
            value={formatValue(data?.totalTradedVolume, 'volume')}
          />
          <DataRow 
            label="Total Value" 
            value={formatValue(data?.totalTradedValue, 'currency')}
          />
          <DataRow 
            label="1 Month Return" 
            value={formatValue(data?.perChange30d, 'percentage')}
            change={data?.perChange30d}
          />
          <DataRow 
            label="3 Month Return" 
            value={formatValue(data?.perChange90d, 'percentage')}
            change={data?.perChange90d}
          />
          <DataRow 
            label="1 Year Return" 
            value={formatValue(data?.perChange365d, 'percentage')}
            change={data?.perChange365d}
          />
          <DataRow 
            label="Last Updated" 
            value={data?.lastUpdateTime ? new Date(data.lastUpdateTime).toLocaleTimeString() : 'N/A'}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
      <div>
        <Loader />
      </div>
    
      )}
    </div>
  );
};

OverviewTab.propTypes = {
  data: PropTypes.object,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

export default OverviewTab;