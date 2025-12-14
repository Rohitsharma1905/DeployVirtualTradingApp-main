// // components/User/Modals/graphs/UserStatsGraph.js
// import React, { useState } from 'react';
// import { Bar, Pie, Doughnut } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import PropTypes from 'prop-types';

// Chart.register(...registerables);

// const UserStatsGraph = ({ 
//   stats, 
//   title,
//   chartLabels = [],
//   chartDataKeys = [],
//   statsDetails = [],
//   chartTypes = ['bar', 'pie']
// }) => {
//   const [chartType, setChartType] = useState('bar');

//   // Default configurations if not provided
//   const defaultConfig = {
//     users: {
//       chartLabels: ['Total', 'Active', 'Gender', 'Age'],
//       chartDataKeys: ['total', 'active', 'gender', 'age'],
//       statsDetails: [
//         { label: 'Total', key: 'total' },
//         { label: 'Active', key: 'active' },
//         { label: 'Gender', key: 'gender' },
//         { label: 'Age', key: 'age', unit: 'years' },
//         { label: 'Registered On', key: 'registrationDate', format: (val) => new Date(val).toLocaleDateString() }
//       ]
//     },
//     events: {
//       chartLabels: ['Total', 'Upcoming', 'Ongoing', 'Completed'],
//       chartDataKeys: ['total', 'upcoming', 'ongoing', 'completed'],
//       statsDetails: [
//         { label: 'Total Events', key: 'total' },
//         { label: 'Upcoming Events', key: 'upcoming' },
//         { label: 'Ongoing Events', key: 'ongoing' },
//         { label: 'Completed Events', key: 'completed' }
//       ]
//     },
//     feedback: {
//       chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Positive', 'Negative'],
//       chartDataKeys: ['total', 'averageRating', 'recommendationRate', 'positive', 'negative'],
//       statsDetails: [
//         { label: 'Total Feedback', key: 'total' },
//         { label: 'Average Rating', key: 'averageRating' },
//         { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
//         { label: 'Positive Feedback', key: 'positive' },
//         { label: 'Negative Feedback', key: 'negative' }
//       ]
//     },
//     complaints: {
//       chartLabels: ['Total', 'Pending', 'Solved', 'Resolution %'],
//       chartDataKeys: ['total', 'pending', 'solved', 'resolutionRate'],
//       statsDetails: [
//         { label: 'Total Complaints', key: 'total' },
//         { label: 'Pending Complaints', key: 'pending' },
//         { label: 'Solved Complaints', key: 'solved' },
//         { label: 'Resolution Rate', key: 'resolutionRate', unit: '%' }
//       ]
//     },
//     queries: {
//       chartLabels: ['Total', 'Responded', 'Response Rate'],
//       chartDataKeys: ['total', 'responded', 'responseRate'],
//       statsDetails: [
//         { label: 'Total Queries', key: 'total' },
//         { label: 'Responded Queries', key: 'responded' },
//         { label: 'Response Rate', key: 'responseRate', unit: '%' }
//       ]
//     },
//     subscription: {
//       chartLabels: ['Current Plan', 'Plan Value', 'Days Remaining', 'Status'],
//       chartDataKeys: ['plan', 'planPrice', 'daysRemaining', 'status'],
//       statsDetails: [
//         { label: 'Current Plan', key: 'plan' },
//         { label: 'Plan Value', key: 'planPrice', format: (val) => `₹${val}` },
//         { label: 'Days Remaining', key: 'daysRemaining' },
//         { label: 'Status', key: 'status' },
//         { label: 'Start Date', key: 'startDate', format: (val) => new Date(val).toLocaleDateString() },
//         { label: 'End Date', key: 'endDate', format: (val) => new Date(val).toLocaleDateString() }
//       ]
//     }
//   };

//   // Determine which config to use based on title or provided props
//   const configKey = title.toLowerCase().includes('subscription') ? 'subscription' : 
//                    title.toLowerCase().includes('event') ? 'events' :
//                    title.toLowerCase().includes('feedback') ? 'feedback' :
//                    title.toLowerCase().includes('complaint') ? 'complaints' :
//                    title.toLowerCase().includes('query') ? 'queries' : 'users';

//   const { chartLabels: defaultLabels, chartDataKeys: defaultKeys, statsDetails: defaultDetails } = defaultConfig[configKey];
  
//   const finalChartLabels = chartLabels.length ? chartLabels : defaultLabels;
//   const finalChartDataKeys = chartDataKeys.length ? chartDataKeys : defaultKeys;
//   const finalStatsDetails = statsDetails.length ? statsDetails : defaultDetails;

//   // Prepare chart data
//   const chartData = {
//     labels: finalChartLabels,
//     datasets: [{
//       label: title,
//       data: finalChartDataKeys.map(key => {
//         // Handle nested keys if needed
//         if (key.includes('.')) {
//           const keys = key.split('.');
//           let value = stats;
//           for (const k of keys) {
//             value = value?.[k];
//             if (value === undefined) break;
//           }
//           return value || 0;
//         }
//         return stats?.[key] || 0;
//       }),
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.5)',
//         'rgba(75, 192, 192, 0.5)',
//         'rgba(255, 99, 132, 0.5)',
//         'rgba(153, 102, 255, 0.5)',
//         'rgba(255, 159, 64, 0.5)'
//       ],
//       borderColor: [
//         'rgba(54, 162, 235, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(255, 99, 132, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)'
//       ],
//       borderWidth: 1,
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: chartType === 'bar' ? 'top' : 'right',
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             let label = context.label || '';
//             if (label) {
//               label += ': ';
//             }
//             if (context.parsed.y !== undefined) {
//               label += context.parsed.y;
//             } else {
//               label += context.raw;
//             }
//             return label;
//           }
//         }
//       }
//     },
//     scales: chartType === 'bar' ? {
//       y: {
//         beginAtZero: true
//       }
//     } : undefined
//   };

//   const renderChart = () => {
//     switch(chartType) {
//       case 'bar':
//         return <Bar data={chartData} options={chartOptions} />;
//       case 'pie':
//         return <Pie data={chartData} options={chartOptions} />;
//       case 'doughnut':
//         return <Doughnut data={chartData} options={chartOptions} />;
//       default:
//         return <Bar data={chartData} options={chartOptions} />;
//     }
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">
//               {title} {chartType === 'bar' ? 'Statistics' : 'Distribution'}
//             </h3>
//             <div className="flex space-x-4">
//               {chartTypes.map(type => (
//                 <button
//                   key={type}
//                   onClick={() => setChartType(type)}
//                   className={`px-3 py-1 rounded capitalize ${chartType === type ? 
//                     'bg-lightBlue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
//                 >
//                   {type} Chart
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className={chartType !== 'bar' ? "max-w-xs mx-auto" : ""}>
//             {renderChart()}
//           </div>
//         </div>
        
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Detailed Statistics</h3>
//           <div className="space-y-4">
//             {finalStatsDetails.map((detail, index) => {
//               const value = detail.key.includes('.') ? 
//                 detail.key.split('.').reduce((obj, key) => obj?.[key], stats) : 
//                 stats?.[detail.key];
              
//               return (
//                 <div key={index} className="flex justify-between">
//                   <span>{detail.label}:</span>
//                   <span className="font-medium">
//                     {detail.format ? detail.format(value, stats) : 
//                      value ?? detail.defaultValue ?? 'N/A'}
//                     {detail.unit ? ` ${detail.unit}` : ''}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// UserStatsGraph.propTypes = {
//   stats: PropTypes.object.isRequired,
//   title: PropTypes.string.isRequired,
//   chartLabels: PropTypes.arrayOf(PropTypes.string),
//   chartDataKeys: PropTypes.arrayOf(PropTypes.string),
//   statsDetails: PropTypes.arrayOf(PropTypes.shape({
//     label: PropTypes.string,
//     key: PropTypes.string,
//     unit: PropTypes.string,
//     format: PropTypes.func,
//     defaultValue: PropTypes.any
//   })),
//   chartTypes: PropTypes.arrayOf(PropTypes.oneOf(['bar', 'pie', 'doughnut']))
// };

// UserStatsGraph.defaultProps = {
//   chartLabels: [],
//   chartDataKeys: [],
//   statsDetails: [],
//   chartTypes: ['bar', 'pie']
// };

// export default UserStatsGraph;




// components/User/Modals/graphs/UserStatsGraph.js
import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';
import { fetchNiftyData } from "../../../../redux/Common/nifty50Slice";
import { fetchNifty500Data } from "../../../../redux/Common/nifty500Slice";
import { fetchStockData } from "../../../../redux/Common/etfSlice";
import { useSelector } from 'react-redux';

Chart.register(...registerables);

const UserStatsGraph = ({ 
  stats, 
  title,
  chartLabels = [],
  chartDataKeys = [],
  statsDetails = [],
  chartTypes = ['bar', 'pie']
}) => {
  const [chartType, setChartType] = useState('bar');

  const nifty50Data = useSelector((state) => state.common.nifty50.data);
  const nifty500Data = useSelector((state) => state.common.nifty500.data);
  const etfData = useSelector((state) => state.common.etf.stockData);



  // Default configurations if not provided
  const defaultConfig = {
    users: {
      chartLabels: ['Total', 'Active', 'Gender', 'Age'],
      chartDataKeys: ['total', 'active', 'gender', 'age'],
      statsDetails: [
        { label: 'Total', key: 'total' },
        { label: 'Active', key: 'active' },
        { label: 'Gender', key: 'gender' },
        { label: 'Age', key: 'age', unit: 'years' },
        { label: 'Registered On', key: 'registrationDate', format: (val) => new Date(val).toLocaleDateString() }
      ]
    },
    events: {
      chartLabels: ['Total', 'Upcoming', 'Ongoing', 'Completed'],
      chartDataKeys: ['total', 'upcoming', 'ongoing', 'completed'],
      statsDetails: [
        { label: 'Total Events', key: 'total' },
        { label: 'Upcoming Events', key: 'upcoming' },
        { label: 'Ongoing Events', key: 'ongoing' },
        { label: 'Completed Events', key: 'completed' }
      ]
    },
    feedback: {
      chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Positive', 'Negative'],
      chartDataKeys: ['total', 'averageRating', 'recommendationRate', 'positive', 'negative'],
      statsDetails: [
        { label: 'Total Feedback', key: 'total' },
        { label: 'Average Rating', key: 'averageRating' },
        { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
        { label: 'Positive Feedback', key: 'positive' },
        { label: 'Negative Feedback', key: 'negative' }
      ]
    },
    complaints: {
      chartLabels: ['Total', 'Pending', 'Solved', 'Resolution %'],
      chartDataKeys: ['total', 'pending', 'solved', 'resolutionRate'],
      statsDetails: [
        { label: 'Total Complaints', key: 'total' },
        { label: 'Pending Complaints', key: 'pending' },
        { label: 'Solved Complaints', key: 'solved' },
        { label: 'Resolution Rate', key: 'resolutionRate', unit: '%' }
      ]
    },
    queries: {
      chartLabels: ['Total', 'Responded', 'Response Rate'],
      chartDataKeys: ['total', 'responded', 'responseRate'],
      statsDetails: [
        { label: 'Total Queries', key: 'total' },
        { label: 'Responded Queries', key: 'responded' },
        { label: 'Response Rate', key: 'responseRate', unit: '%' }
      ]
    },
    subscription: {
      chartLabels: ['Current Plan', 'Plan Value', 'Days Remaining', 'Status'],
      chartDataKeys: ['plan', 'planPrice', 'daysRemaining', 'status'],
      statsDetails: [
        { label: 'Current Plan', key: 'plan' },
        { label: 'Plan Value', key: 'planPrice', format: (val) => `₹${val}` },
        { label: 'Days Remaining', key: 'daysRemaining' },
        { label: 'Status', key: 'status' },
        { label: 'Start Date', key: 'startDate', format: (val) => new Date(val).toLocaleDateString() },
        { label: 'End Date', key: 'endDate', format: (val) => new Date(val).toLocaleDateString() }
      ]
    },
    // stocks: {
    //   chartLabels: ['All Stocks', 'Nifty50', 'Nifty500', 'ETF'],
    //   chartDataKeys: ['all', 'nifty50', 'nifty500', 'etf'],
    //   statsDetails: [
    //     { label: 'Total Stocks', key: 'all' },
    //     { label: 'Nifty50 Stocks', key: 'nifty50' },
    //     { label: 'Nifty500 Stocks', key: 'nifty500' },
    //     { label: 'ETF Stocks', key: 'etf' },
    //     { 
    //       label: 'Most Active Sector', 
    //       key: 'mostActiveSector', 
    //       defaultValue: 'N/A',
    //       format: (val) => val || 'N/A'
    //     }
    //   ]
    // },
    // Inside your UserStatsGraph component's config object
stocks: {
  chartLabels: ['All Stocks', 'Nifty50', 'Nifty500', 'ETF'],
  chartDataKeys: ['all', 'nifty50', 'nifty500', 'etf'],
  statsDetails: [
    { label: 'Total Stocks', key: 'all', defaultValue: (nifty500Data.length + nifty50Data.length + etfData.length).toString()}, // Hardcoded default
    { label: 'Nifty50 Stocks', key: 'nifty50', defaultValue: nifty50Data.length.toString() }, // Hardcoded default
    { label: 'Nifty500 Stocks', key: 'nifty500', defaultValue: nifty500Data.length.toString() }, // Hardcoded default
    { label: 'ETF Stocks', key: 'etf', defaultValue: etfData.length.toString() }, // Hardcoded default
    // { 
    //   label: 'Most Active Sector', 
    //   key: 'mostActiveSector', 
    //   defaultValue: 'Technology', // Hardcoded default
    //   format: (val) => val || 'Technology' // Falls back to hardcoded value
    // },
    // // Additional hardcoded stats if needed
    // { 
    //   label: 'Market Cap', 
    //   key: 'marketCap',
    //   defaultValue: '₹3,400,000 Cr', // Hardcoded value
    //   format: (val) => val || '₹3,400,000 Cr' // Will always show this value
    // }
  ]
},
    gallery: {
      chartLabels: ['Total Photos', 'Total Categories', 'Total Albums'],
      chartDataKeys: ['totalPhotos', 'totalCategories', 'totalAlbums'],
      statsDetails: [
        { label: 'Total Photos', key: 'totalPhotos' },
        { label: 'Total Categories', key: 'totalCategories' },
        { label: 'Total Albums', key: 'totalAlbums' },
        { 
          label: 'Most Popular Category', 
          key: 'mostPopularCategory', 
          defaultValue: 'N/A',
          format: (val) => val || 'N/A'
        }
      ]
    }
  };

  // Determine which config to use based on title or provided props
  const configKey = title.toLowerCase().includes('subscription') ? 'subscription' : 
                   title.toLowerCase().includes('event') ? 'events' :
                   title.toLowerCase().includes('feedback') ? 'feedback' :
                   title.toLowerCase().includes('complaint') ? 'complaints' :
                   title.toLowerCase().includes('query') ? 'queries' :
                   title.toLowerCase().includes('stock') ? 'stocks' :
                   title.toLowerCase().includes('gallery') ? 'gallery' : 'users';
  
  const { chartLabels: defaultLabels, chartDataKeys: defaultKeys, statsDetails: defaultDetails } = defaultConfig[configKey];
  
  const finalChartLabels = chartLabels.length ? chartLabels : defaultLabels;
  const finalChartDataKeys = chartDataKeys.length ? chartDataKeys : defaultKeys;
  const finalStatsDetails = statsDetails.length ? statsDetails : defaultDetails;

  // Prepare chart data
  const chartData = {
    labels: finalChartLabels,
    datasets: [{
      label: title,
      data: finalChartDataKeys.map(key => {
        // Handle nested keys if needed
        if (key.includes('.')) {
          const keys = key.split('.');
          let value = stats;
          for (const k of keys) {
            value = value?.[k];
            if (value === undefined) break;
          }
          return value || 0;
        }
        return stats?.[key] || 0;
      }),
      backgroundColor: [
        'rgba(54, 162, 235, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(255, 99, 132, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(201, 203, 207, 0.5)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(201, 203, 207, 1)'
      ],
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: chartType === 'bar' ? 'top' : 'right',
        labels: {
          boxWidth: 12
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== undefined) {
              label += context.parsed.y;
            } else {
              label += context.raw;
            }
            return label;
          }
        }
      }
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true
      }
    } : undefined
  };

  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return <Bar data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  // Helper function to get nested values from object
  const getNestedValue = (obj, key) => {
    if (!key.includes('.')) return obj?.[key];
    
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {title} {chartType === 'bar' ? 'Statistics' : 'Distribution'}
            </h3>
            <div className="flex space-x-4">
              {chartTypes.map(type => (
                <label key={type} className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="chartType"
                    value={type}
                    checked={chartType === type}
                    onChange={() => setChartType(type)}
                  />
                  <span className="ml-2 capitalize">{type} Chart</span>
                </label>
              ))}
            </div>
          </div>
          <div className={chartType !== 'bar' ? "max-w-xs mx-auto" : ""}>
            {renderChart()}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Detailed Statistics</h3>
          <div className="space-y-4">
            {finalStatsDetails.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span>{detail.label}:</span>
                <span className="font-medium">
                  {detail.format 
                    ? detail.format(getNestedValue(stats, detail.key), stats) 
                    : getNestedValue(stats, detail.key) ?? detail.defaultValue ?? 'N/A'}
                  {detail.unit ? ` ${detail.unit}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

UserStatsGraph.propTypes = {
  stats: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string),
  chartDataKeys: PropTypes.arrayOf(PropTypes.string),
  statsDetails: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    key: PropTypes.string,
    unit: PropTypes.string,
    format: PropTypes.func,
    defaultValue: PropTypes.any
  })),
  chartTypes: PropTypes.arrayOf(PropTypes.oneOf(['bar', 'pie']))
};

UserStatsGraph.defaultProps = {
  chartLabels: [],
  chartDataKeys: [],
  statsDetails: [],
  chartTypes: ['bar', 'pie']
};

export default UserStatsGraph;