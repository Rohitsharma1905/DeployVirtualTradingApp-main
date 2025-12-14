

// import React, { useState } from 'react';
// import { Bar, Pie, Doughnut } from 'react-chartjs-2';
// import { Chart, registerables } from 'chart.js';
// import PropTypes from 'prop-types';

// Chart.register(...registerables);

// const OrganizationStatsGraph = ({ 
//   stats, 
//   title, 
//   type,
//   unit = ''
// }) => {
//   const [chartType, setChartType] = useState('bar');

//   if (type === 'stocks') {
//     stats = {
//       ...stats,
//       nifty50: stats.nifty50 - 1,
//       nifty500: stats.nifty500 - 1,
//       etf: stats.etf - 1,
//       all: stats.all - 3
//     };
//   }

//   // Configuration for different stat types
//   const config = {
//     users: {
//       chartLabels: ['Total', 'Active', 'Deactive', 'Male', 'Female', 'New', 'Average Age'],
//       chartDataKeys: ['total', 'active', 'deactive', 'male', 'female', 'newUsersLastWeek', 'averageAge'],
//       statsDetails: [
//         { label: 'Total Users', key: 'total' },
//         { label: 'Active Users', key: 'active' },
//         { label: 'Deactive Users', key: 'deactive' },
//         { label: 'Male Users', key: 'male' },
//         { label: 'Female Users', key: 'female' },
//         { label: 'New Users (Last Week)', key: 'newUsersLastWeek' },
//         { label: 'Average Age', key: 'averageAge', unit: 'years' }
//       ],
//       chartTypes: ['bar', 'pie']
//     },
//     events: {
//       chartLabels: ['Total', 'Upcoming', 'Ongoing', 'Completed'],
//       chartDataKeys: ['total', 'upcoming', 'ongoing', 'completed'],
//       statsDetails: [
//         { label: 'Total Events', key: 'total' },
//         { label: 'Upcoming Events', key: 'upcoming' },
//         { label: 'Ongoing Events', key: 'ongoing' },
//         { label: 'Completed Events', key: 'completed' }
//       ],
//       // chartTypes: ['bar', 'doughnut']
//       chartTypes: ['bar', 'pie']
//     },
//     feedbacks: {
//       chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Positive', 'Negative'],
//       chartDataKeys: ['total', 'averageRating', '6', 'recommendationRate', 'totalPositive', 'totalNegative'],
//       statsDetails: [
//         { label: 'Total Feedback', key: 'total' },
//         { label: 'Average Rating', key: 'averageRating' },
//         { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
//         { label: 'Positive Feedback', key: 'totalPositive' },
//         { label: 'Negative Feedback', key: 'totalNegative' },
//         { 
//           label: 'Most Popular Category', 
//           key: 'mostPopularCategory._id', 
//           defaultValue: 'N/A',
//           format: (val, stats) => `${stats.mostPopularCategory?._id || 'N/A'} (${stats.mostPopularCategory?.total || 0})`
//         }
//       ],
//       chartTypes: ['bar', 'pie']
//     },
//     complaints: {
//       chartLabels: ['Total', 'Pending', 'Resolved', 'Resolution %'],
//       chartDataKeys: ['total', 'pending', 'resolved', 'resolutionRate'],
//       statsDetails: [
//         { label: 'Total Complaints', key: 'total' },
//         { label: 'Pending Complaints', key: 'pending' },
//         { label: 'Resolved Complaints', key: 'resolved' },
//         { label: 'Resolution Rate', key: 'resolutionRate', unit: '%' },
//         { 
//           label: 'Average Resolution Time', 
//           key: 'avgResolutionTime', 
//           defaultValue: 'N/A',
//           format: (val) => val ? `${val} days` : 'N/A'
//         }
//       ],
//       chartTypes: ['bar', 'pie']
//     },
//     userFeedbacks: {
//       chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Participation %'],
//       chartDataKeys: ['total', 'averageRating', 'recommendationRate', 'participationRate'],
//       statsDetails: [
//         { label: 'Total Feedbacks', key: 'total' },
//         { label: 'Average Rating', key: 'averageRating' },
//         { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
//         { label: 'User Participation', key: 'participationRate', unit: '%' },
//         { 
//           label: 'Top Feedback User', 
//           key: 'topFeedbackUsers.0.userName', 
//           defaultValue: 'N/A',
//           format: (val, stats) => stats.topFeedbackUsers?.[0]?.userName || 'N/A'
//         },
//         { 
//           label: 'Top User Feedbacks', 
//           key: 'topFeedbackUsers.0.feedbackCount', 
//           defaultValue: 'N/A'
//         }
//       ],
//       // chartTypes: ['bar', 'doughnut']
//       chartTypes: ['bar', 'pie']
//     },
//     userQueries: {
//       chartLabels: ['Total Queries', 'Response Rate', 'Recent Queries'],
//       chartDataKeys: ['total', 'responseRate', 'recentQueries.length'],
//       statsDetails: [
//         { label: 'Total Queries', key: 'total' },
//         { label: 'Response Rate', key: 'responseRate', unit: '%' },
//         { 
//           label: 'Recent Queries Count', 
//           key: 'recentQueries.length', 
//           defaultValue: '0'
//         },
//         { 
//           label: 'Most Common Query Type', 
//           key: 'queriesByType.0.type', 
//           defaultValue: 'N/A',
//           format: (val, stats) => {
//             if (!stats.queriesByType?.length) return 'N/A';
//             const mostCommon = stats.queriesByType.reduce((prev, current) => 
//               (prev.count > current.count) ? prev : current
//             );
//             return `${mostCommon.type} (${mostCommon.count})`;
//           }
//         }
//       ],
//       chartTypes: ['bar', 'pie']
//     },
//     stocks: {
//       chartLabels: ['All Stocks', 'Nifty50', 'Nifty500', 'ETF'],
//       chartDataKeys: ['all', 'nifty50', 'nifty500', 'etf'],
//       statsDetails: [
//         { label: 'Total Stocks', key: 'all' },
//         { label: 'Nifty50 Stocks', key: 'nifty50' },
//         { label: 'Nifty500 Stocks', key: 'nifty500' },
//         { label: 'ETF Stocks', key: 'etf' },
//         { 
//           label: 'Most Active Sector', 
//           key: 'mostActiveSector', 
//           defaultValue: 'N/A',
//           format: (val) => val || 'N/A'
//         },
//         { 
//           label: 'Top Gainer', 
//           key: 'topGainer.symbol', 
//           defaultValue: 'N/A',
//           format: (val, stats) => stats.topGainer?.symbol ? `${stats.topGainer.symbol} (${stats.topGainer.percentageChange || 0}%)` : 'N/A'
//         },
//         { 
//           label: 'Top Loser', 
//           key: 'topLoser.symbol', 
//           defaultValue: 'N/A',
//           format: (val, stats) => stats.topLoser?.symbol ? `${stats.topLoser.symbol} (${stats.topLoser.percentageChange || 0}%)` : 'N/A'
//         }
//       ],
//       // chartTypes: ['bar', 'doughnut']
//       chartTypes: ['bar', 'pie']
//     },
//     gallery: {
//       chartLabels: ['Total Photos', 'Total Categories', 'Total Albums'],
//       chartDataKeys: ['totalPhotos', 'totalCategories', 'totalAlbums'],
//       statsDetails: [
//         { label: 'Total Photos', key: 'totalPhotos' },
//         { label: 'Total Categories', key: 'totalCategories' },
//         { label: 'Total Albums', key: 'totalAlbums' },
//         { 
//           label: 'Most Popular Category', 
//           key: 'mostPopularCategory', 
//           defaultValue: 'N/A',
//           format: (val) => val || 'N/A'
//         },
//         { 
//           label: 'Recent Uploads', 
//           key: 'recentUploads', 
//           defaultValue: '0',
//           format: (val) => val?.toString() || '0'
//         },
//         { 
//           label: 'Average Photos per Album', 
//           key: 'avgPhotosPerAlbum', 
//           defaultValue: '0',
//           format: (val) => val ? Math.round(val).toString() : '0'
//         }
//       ],
//       chartTypes: ['bar', 'pie']
//     }
//   };

//   const { chartLabels, chartDataKeys, statsDetails, chartTypes } = config[type] || config.users;

//   // Prepare chart data
//   const chartData = {
//     labels: chartLabels,
//     datasets: [{
//       label: title,
//       data: chartDataKeys.map(key => {
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
//         'rgba(255, 159, 64, 0.5)',
//         'rgba(255, 206, 86, 0.5)',
//         'rgba(201, 203, 207, 0.5)'
//       ],
//       borderColor: [
//         'rgba(54, 162, 235, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(255, 99, 132, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(201, 203, 207, 1)'
//       ],
//       borderWidth: 1,
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: true,
//     plugins: {
//       legend: {
//         position: chartType === 'bar' ? 'top' : 'right',
//         labels: {
//           boxWidth: 12
//         }
//       },
//       tooltip: {
//         callbacks: {
//           label: function(context) {
//             return `${context.label}: ${context.raw}${unit ? ` ${unit}` : ''}`;
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
//                 <label key={type} className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     className="form-radio"
//                     name="chartType"
//                     value={type}
//                     checked={chartType === type}
//                     onChange={() => setChartType(type)}
//                   />
//                   <span className="ml-2 capitalize">{type} Chart</span>
//                 </label>
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
//             {statsDetails.map((detail, index) => (
//               <div key={index} className="flex justify-between">
//                 <span>{detail.label}:</span>
//                 <span className="font-medium">
//                   {detail.format 
//                     ? detail.format(getNestedValue(stats, detail.key), stats) 
//                     : getNestedValue(stats, detail.key) ?? detail.defaultValue ?? '0'}
//                   {detail.unit ? ` ${detail.unit}` : ''}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Helper function to get nested values from object
// function getNestedValue(obj, key) {
//   if (!key.includes('.')) return obj?.[key];
  
//   const keys = key.split('.');
//   let value = obj;
//   for (const k of keys) {
//     value = value?.[k];
//     if (value === undefined) break;
//   }
//   return value;
// }

// OrganizationStatsGraph.propTypes = {
//   stats: PropTypes.object.isRequired,
//   title: PropTypes.string.isRequired,
//   type: PropTypes.oneOf([
//     'users', 
//     'events', 
//     'feedbacks', 
//     'complaints', 
//     'userFeedbacks', 
//     'userQueries',
//     'stocks',
//     'gallery'
//   ]).isRequired,
//   unit: PropTypes.string
// };

// export default OrganizationStatsGraph;



import React, { useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import PropTypes from 'prop-types';

Chart.register(...registerables);

const OrganizationStatsGraph = ({ 
  stats, 
  title, 
  type,
  unit = ''
}) => {
  const [chartType, setChartType] = useState('bar');

  if (type === 'stocks') {
    stats = {
      ...stats,
      nifty50: stats.nifty50 - 1,
      nifty500: stats.nifty500 - 1,
      etf: stats.etf - 1,
      all: stats.all - 3
    };
  }

  // Configuration for different stat types
  const config = {
    users: {
      chartLabels: ['Total', 'Active', 'Deactive', 'Male', 'Female', 'New', 'Average Age'],
      chartDataKeys: ['total', 'active', 'deactive', 'male', 'female', 'newUsersLastWeek', 'averageAge'],
      statsDetails: [
        { label: 'Total Users', key: 'total' },
        { label: 'Active Users', key: 'active' },
        { label: 'Deactive Users', key: 'deactive' },
        { label: 'Male Users', key: 'male' },
        { label: 'Female Users', key: 'female' },
        { label: 'New Users (Last Week)', key: 'newUsersLastWeek' },
        { label: 'Average Age', key: 'averageAge', unit: 'years' }
      ],
      chartTypes: ['bar', 'pie']
    },
    events: {
      chartLabels: ['Participants', 'Participation Rate', 'Certificates Issued'],
      chartDataKeys: ['participatingUsers', 'participationRate', 'certificatesIssued'],
      statsDetails: [
        { label: 'Total Participants', key: 'participatingUsers' },
        { label: 'Participation Rate', key: 'participationRate', unit: '%' },
        { label: 'Certificates Issued', key: 'certificatesIssued' },
        // { 
        //   label: 'Most Active Participant', 
        //   key: 'mostActiveParticipant.name', 
        //   defaultValue: 'N/A',
        //   format: (val, stats) => stats.mostActiveParticipant?.name || 'N/A'
        // },
        // { 
        //   label: 'Participations', 
        //   key: 'mostActiveParticipant.count', 
        //   defaultValue: '0'
        // }
      ],
      chartTypes: ['bar', 'pie']
    },
    feedbacks: {
      chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Positive', 'Negative'],
      chartDataKeys: ['total', 'averageRating', '6', 'recommendationRate', 'totalPositive', 'totalNegative'],
      statsDetails: [
        { label: 'Total Feedback', key: 'total' },
        { label: 'Average Rating', key: 'averageRating' },
        { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
        { label: 'Positive Feedback', key: 'totalPositive' },
        { label: 'Negative Feedback', key: 'totalNegative' },
        { 
          label: 'Most Popular Category', 
          key: 'mostPopularCategory._id', 
          defaultValue: 'N/A',
          format: (val, stats) => `${stats.mostPopularCategory?._id || 'N/A'} (${stats.mostPopularCategory?.total || 0})`
        }
      ],
      chartTypes: ['bar', 'pie']
    },
    complaints: {
      chartLabels: ['Total', 'Pending', 'Resolved', 'Resolution %'],
      chartDataKeys: ['total', 'pending', 'resolved', 'resolutionRate'],
      statsDetails: [
        { label: 'Total Complaints', key: 'total' },
        { label: 'Pending Complaints', key: 'pending' },
        { label: 'Resolved Complaints', key: 'resolved' },
        { label: 'Resolution Rate', key: 'resolutionRate', unit: '%' },
        { 
          label: 'Average Resolution Time', 
          key: 'avgResolutionTime', 
          defaultValue: 'N/A',
          format: (val) => val ? `${val} days` : 'N/A'
        }
      ],
      chartTypes: ['bar', 'pie']
    },
    userComplaints: {
      chartLabels: ['Total', 'Pending', 'Resolved', 'Resolution Rate'],
      chartDataKeys: ['total', 'pending', 'resolved', 'resolutionRate'],
      statsDetails: [
        { label: 'Total Complaints', key: 'total' },
        { label: 'Pending Complaints', key: 'pending' },
        { label: 'Resolved Complaints', key: 'resolved' },
        { label: 'Resolution Rate', key: 'resolutionRate', unit: '%' },
        // { 
        //   label: 'Average Resolution Time', 
        //   key: 'avgResolutionTime', 
        //   defaultValue: 'N/A',
        //   format: (val) => val ? `${val} days` : 'N/A'
        // },
        // { 
        //   label: 'Most Common Issue', 
        //   key: 'mostCommonIssue', 
        //   defaultValue: 'N/A',
        //   format: (val) => val || 'N/A'
        // },
        // { 
        //   label: 'Top Complainant', 
        //   key: 'topComplainant.name', 
        //   defaultValue: 'N/A',
        //   format: (val, stats) => stats.topComplainant?.name || 'N/A'
        // }
      ],
      chartTypes: ['bar', 'pie']
    },
    userFeedbacks: {
      chartLabels: ['Total', 'Avg Rating', 'Recommend %', 'Participation %'],
      chartDataKeys: ['total', 'averageRating', 'recommendationRate', 'participationRate'],
      statsDetails: [
        { label: 'Total Feedbacks', key: 'total' },
        { label: 'Average Rating', key: 'averageRating' },
        { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
        { label: 'User Participation', key: 'participationRate', unit: '%' },
        { 
          label: 'Top Feedback User', 
          key: 'topFeedbackUsers.0.userName', 
          defaultValue: 'N/A',
          format: (val, stats) => stats.topFeedbackUsers?.[0]?.userName || 'N/A'
        },
        { 
          label: 'Top User Feedbacks', 
          key: 'topFeedbackUsers.0.feedbackCount', 
          defaultValue: 'N/A'
        }
      ],
      chartTypes: ['bar', 'pie']
    },
    userQueries: {
      chartLabels: ['Total Queries', 'Response Rate', 'Recent Queries'],
      chartDataKeys: ['total', 'responseRate', 'recentQueries.length'],
      statsDetails: [
        { label: 'Total Queries', key: 'total' },
        { label: 'Response Rate', key: 'responseRate', unit: '%' },
        { 
          label: 'Recent Queries Count', 
          key: 'recentQueries.length', 
          defaultValue: '0'
        },
        { 
          label: 'Most Common Query Type', 
          key: 'queriesByType.0.type', 
          defaultValue: 'N/A',
          format: (val, stats) => {
            if (!stats.queriesByType?.length) return 'N/A';
            const mostCommon = stats.queriesByType.reduce((prev, current) => 
              (prev.count > current.count) ? prev : current
            );
            return `${mostCommon.type} (${mostCommon.count})`;
          }
        }
      ],
      chartTypes: ['bar', 'pie']
    },
    stocks: {
      chartLabels: ['All Stocks', 'Nifty50', 'Nifty500', 'ETF'],
      chartDataKeys: ['all', 'nifty50', 'nifty500', 'etf'],
      statsDetails: [
        { label: 'Total Stocks', key: 'all' },
        { label: 'Nifty50 Stocks', key: 'nifty50' },
        { label: 'Nifty500 Stocks', key: 'nifty500' },
        { label: 'ETF Stocks', key: 'etf' },
        { 
          label: 'Most Active Sector', 
          key: 'mostActiveSector', 
          defaultValue: 'N/A',
          format: (val) => val || 'N/A'
        },
        { 
          label: 'Top Gainer', 
          key: 'topGainer.symbol', 
          defaultValue: 'N/A',
          format: (val, stats) => stats.topGainer?.symbol ? `${stats.topGainer.symbol} (${stats.topGainer.percentageChange || 0}%)` : 'N/A'
        },
        { 
          label: 'Top Loser', 
          key: 'topLoser.symbol', 
          defaultValue: 'N/A',
          format: (val, stats) => stats.topLoser?.symbol ? `${stats.topLoser.symbol} (${stats.topLoser.percentageChange || 0}%)` : 'N/A'
        }
      ],
      chartTypes: ['bar', 'pie']
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
        },
        { 
          label: 'Recent Uploads', 
          key: 'recentUploads', 
          defaultValue: '0',
          format: (val) => val?.toString() || '0'
        },
        { 
          label: 'Average Photos per Album', 
          key: 'avgPhotosPerAlbum', 
          defaultValue: '0',
          format: (val) => val ? Math.round(val).toString() : '0'
        }
      ],
      chartTypes: ['bar', 'pie']
    }
  };

  const { chartLabels, chartDataKeys, statsDetails, chartTypes } = config[type] || config.users;

  // Prepare chart data
  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: title,
      data: chartDataKeys.map(key => {
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
            return `${context.label}: ${context.raw}${unit ? ` ${unit}` : ''}`;
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
      case 'doughnut':
        return <Doughnut data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
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
            {statsDetails.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span>{detail.label}:</span>
                <span className="font-medium">
                  {detail.format 
                    ? detail.format(getNestedValue(stats, detail.key), stats) 
                    : getNestedValue(stats, detail.key) ?? detail.defaultValue ?? '0'}
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

// Helper function to get nested values from object
function getNestedValue(obj, key) {
  if (!key.includes('.')) return obj?.[key];
  
  const keys = key.split('.');
  let value = obj;
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  return value;
}

OrganizationStatsGraph.propTypes = {
  stats: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'users', 
    'events', 
    'feedbacks', 
    'complaints', 
    'userComplaints',
    'userFeedbacks', 
    'userQueries',
    'stocks',
    'gallery'
  ]).isRequired,
  unit: PropTypes.string
};

export default OrganizationStatsGraph;