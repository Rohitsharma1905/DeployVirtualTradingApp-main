// components/Common/Modals/CompanyDetail/Tabs/ChartTab.jsx

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
import Loader from '../../../../Common/Loader';
import { 
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  RefreshCcw
} from 'lucide-react';

const TimeRangeButton = ({ label, active, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${active 
        ? 'bg-lightBlue-500 text-white shadow-sm' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }
    `}
  >
    {Icon && <Icon size={16} className="mr-2" />}
    {label}
  </button>
);

// const ChartSummary = ({ data }) => {
//   const change = data?.pChange || 0;
//   const isPositive = change >= 0;

//   return (
//     <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <div>
//           <p className="text-sm text-gray-500">Current</p>
//           <p className="text-lg font-semibold">₹{data?.lastPrice?.toFixed(2)}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Change</p>
//           <p className={`text-lg font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
//             {isPositive ? '+' : ''}{change?.toFixed(2)}%
//           </p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Volume</p>
//           <p className="text-lg font-semibold">{Number(data?.totalTradedVolume).toLocaleString()}</p>
//         </div>
//         <div>
//           <p className="text-sm text-gray-500">Value</p>
//           <p className="text-lg font-semibold">₹{Number(data?.totalTradedValue).toLocaleString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

const ChartTab = ({ 
  symbol, 
  data, 
  chartData, 
  onTimeRangeChange, 
  loading, 
  error 
}) => {
  const [activeRange, setActiveRange] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [annotations, setAnnotations] = useState([]);

  const timeRanges = [
    { label: '1D', value: '1D', icon: Clock },
    { label: '1W', value: '1W', icon: Calendar },
    { label: '1M', value: '1M', icon: Calendar },
    { label: '3M', value: '3M', icon: Calendar },
    { label: 'YTD', value: 'YTD', icon: Calendar },
  ];

  const chartTypes = [
    { label: 'Candlestick', value: 'candlestick' },
    { label: 'Line', value: 'line' },
    { label: 'Area', value: 'area' }
  ];

  const chartOptions = {
    chart: {
      type: chartType,
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true
      }
    },
    title: {
      text: `${symbol} Price Chart`,
      align: 'left',
      style: {
        fontSize: '16px',
        fontWeight: 600,
        color: '#1f2937'
      }
    },
    annotations: {
      xaxis: annotations
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
      tooltip: {
        enabled: true
      },
      labels: {
        formatter: (value) => `₹${value.toFixed(2)}`,
        style: {
          fontSize: '12px',
          fontFamily: 'inherit'
        }
      }
    },
    grid: {
      borderColor: '#f3f4f6',
      strokeDashArray: 4
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: '#22c55e',
          downward: '#ef4444'
        },
        wick: {
          useFillColor: true
        }
      }
    },
    tooltip: {
      custom: ({ seriesIndex, dataPointIndex, w }) => {
        if (chartType === 'candlestick') {
          const o = w.globals.seriesCandleO[seriesIndex][dataPointIndex];
          const h = w.globals.seriesCandleH[seriesIndex][dataPointIndex];
          const l = w.globals.seriesCandleL[seriesIndex][dataPointIndex];
          const c = w.globals.seriesCandleC[seriesIndex][dataPointIndex];
          const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);

          return `
            <div class="p-3 bg-white rounded-lg shadow-md border border-gray-200">
              <div class="font-medium text-gray-800 mb-2">
                ${date.toLocaleDateString('en-GB', { 
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div class="text-gray-600">Open:</div>
                <div class="font-medium">₹${o.toFixed(2)}</div>
                <div class="text-gray-600">High:</div>
                <div class="font-medium">₹${h.toFixed(2)}</div>
                <div class="text-gray-600">Low:</div>
                <div class="font-medium">₹${l.toFixed(2)}</div>
                <div class="text-gray-600">Close:</div>
                <div class="font-medium">₹${c.toFixed(2)}</div>
              </div>
            </div>
          `;
        } else {
          const value = w.globals.series[seriesIndex][dataPointIndex];
          const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
          
          return `
            <div class="p-3 bg-white rounded-lg shadow-md border border-gray-200">
              <div class="font-medium text-gray-800 mb-2">
                ${date.toLocaleDateString('en-GB', { 
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div class="text-sm">
                <span class="text-gray-600">Price: </span>
                <span class="font-medium">₹${value.toFixed(2)}</span>
              </div>
            </div>
          `;
        }
      }
    }
  };

  const handleTimeRangeChange = (range) => {
    setActiveRange(range);
    onTimeRangeChange(range);
  };

  // Add market events as annotations
  useEffect(() => {
    if (chartData?.events) {
      setAnnotations(chartData.events.map(event => ({
        x: new Date(event.date).getTime(),
        strokeDashArray: 0,
        borderColor: '#6366f1',
        label: {
          borderColor: '#6366f1',
          style: {
            color: '#fff',
            background: '#6366f1'
          },
          text: event.description
        }
      })));
    }
  }, [chartData]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-red-50 rounded-xl border border-red-200 p-6">
        <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
        <p className="text-red-800 font-medium text-lg">Error Loading Chart</p>
        <p className="text-red-600 text-sm mt-2">{error}</p>
        <button
          onClick={() => onTimeRangeChange(activeRange)}
          className="mt-4 flex items-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200">
        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-2">
          {timeRanges.map(range => (
            <TimeRangeButton
              key={range.value}
              label={range.label}
              icon={range.icon}
              active={activeRange === range.value}
              onClick={() => handleTimeRangeChange(range.value)}
            />
          ))}
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Chart Type:</span>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-lightBlue-500"
          >
            {chartTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        {loading ? (
  <div>
        <Loader />
      </div>
    
        ) : (
          <ReactApexChart
            options={chartOptions}
            series={[
              {
                name: 'Price',
                data: chartType === 'candlestick' 
                  ? chartData?.candlestick || []
                  : chartData?.series || []
              }
            ]}
            type={chartType}
            height={400}
          />
        )}
      </div>
    </div>
  );
};

ChartTab.propTypes = {
  symbol: PropTypes.string.isRequired,
  data: PropTypes.shape({
    lastPrice: PropTypes.number,
    pChange: PropTypes.number,
    totalTradedVolume: PropTypes.number,
    totalTradedValue: PropTypes.number
  }),
  chartData: PropTypes.shape({
    candlestick: PropTypes.array,
    series: PropTypes.array,
    events: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string,
      description: PropTypes.string
    }))
  }),
  onTimeRangeChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string
};

ChartTab.defaultProps = {
  loading: false,
  error: null
};

export default ChartTab;