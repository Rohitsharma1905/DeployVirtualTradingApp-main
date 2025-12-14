


import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const FeedbackStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

  // Process feedback types data
  const feedbackTypes = stats?.byType?.filter(item => item._id !== 'rating') || [];
  const mostPopularCategory = stats?.mostPopularCategory || { _id: 'N/A', total: 0 };

  // Combined chart data
  const chartData = {
    labels: [
      'Total Feedback',
      'Average Rating',
      'Recommendation Rate',
      'Most Popular Category',
      'Total Category',
    ],
    datasets: [{
      label: 'Feedbacks',
      data: [
        stats?.total || 0,
        stats?.averageRating || 0,
        stats?.recommendationRate || 0,
        mostPopularCategory.total,
        "6"
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 159, 64, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {chartType === 'bar' ? 'Feedback Statistics' : 'Feedback Distribution'}
            </h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="chartType"
                  value="bar"
                  checked={chartType === 'bar'}
                  onChange={() => setChartType('bar')}
                />
                <span className="ml-2">Bar Chart</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="chartType"
                  value="pie"
                  checked={chartType === 'pie'}
                  onChange={() => setChartType('pie')}
                />
                <span className="ml-2">Pie Chart</span>
              </label>
            </div>
          </div>
          <div className={chartType === 'pie' ? "max-w-xs mx-auto" : ""}>
            {chartType === 'bar' ? (
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            ) : (
              <Pie 
                data={chartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Feedback Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Feedback:</span>
              <span className="font-medium">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Rating:</span>
              <span className="font-medium">{stats?.averageRating || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Recommendation Rate:</span>
              <span className="font-medium">{stats?.recommendationRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span>Most Popular Category:</span>
              <span className="font-medium capitalize">{mostPopularCategory._id} ({mostPopularCategory.total})</span>
            </div>
            <div className="flex justify-between">
              <span>Total Category:</span>
              <span className="font-medium capitalize">6</span>
            </div>
            {/* {feedbackTypes.map((type, index) => (
              <div key={index} className="flex justify-between">
                <span className="capitalize">{type._id}:</span>
                <span className="font-medium">{type.total}</span>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};


// import React, { useState } from 'react';
// import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   LineElement,
//   PointElement,
//   Tooltip,
//   Legend
// );

// export const FeedbackStatsGraph = ({ stats }) => {
//   const [activeTab, setActiveTab] = useState('overview');
//   const [chartType, setChartType] = useState('bar');

//   // Data processing
//   const feedbackTypes = stats?.byType?.filter(item => item._id !== null) || [];
//   const mostPopularCategory = stats?.mostPopularCategory || { _id: 'N/A', total: 0 };
//   const ratingDistribution = stats?.ratingDistribution || [0, 0, 0, 0, 0];
//   const categoryStats = stats?.categoryStats || [];
//   const monthlyTrends = stats?.monthlyTrends || [];

//   // Chart data configurations
//   const overviewChartData = {
//     labels: [
//       'Total Feedback',
//       'Average Rating',
//       'Recommendation Rate',
//       `Most Popular (${mostPopularCategory._id})`,
//       ...feedbackTypes.map(type => type._id || 'Unknown')
//     ],
//     datasets: [{
//       label: 'Feedback Overview',
//       data: [
//         stats?.total || 0,
//         parseFloat(stats?.averageRating || 0),
//         parseFloat(stats?.recommendationRate || 0),
//         mostPopularCategory.total,
//         ...feedbackTypes.map(type => type.total)
//       ],
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)',
//         'rgba(153, 102, 255, 0.7)',
//         'rgba(255, 99, 132, 0.7)',
//         'rgba(255, 159, 64, 0.7)'
//       ],
//       borderColor: [
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 99, 132, 1)',
//         'rgba(255, 159, 64, 1)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const categoryChartData = {
//     labels: categoryStats.map(cat => cat.category),
//     datasets: [{
//       label: 'Feedback by Category',
//       data: categoryStats.map(cat => cat.count),
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.7)',
//         'rgba(54, 162, 235, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)',
//         'rgba(153, 102, 255, 0.7)',
//         'rgba(255, 159, 64, 0.7)'
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(153, 102, 255, 1)',
//         'rgba(255, 159, 64, 1)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const ratingChartData = {
//     labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
//     datasets: [{
//       label: 'Rating Distribution',
//       data: ratingDistribution,
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.7)',
//         'rgba(255, 159, 64, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)',
//         'rgba(54, 162, 235, 0.7)'
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(255, 159, 64, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(54, 162, 235, 1)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const trendChartData = {
//     labels: monthlyTrends.map(trend => trend.month),
//     datasets: [
//       {
//         label: 'Feedback Count',
//         data: monthlyTrends.map(trend => trend.count),
//         borderColor: 'rgba(54, 162, 235, 1)',
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         yAxisID: 'y',
//         tension: 0.3
//       },
//       {
//         label: 'Average Rating',
//         data: monthlyTrends.map(trend => parseFloat(trend.avgRating)),
//         borderColor: 'rgba(255, 206, 86, 1)',
//         backgroundColor: 'rgba(255, 206, 86, 0.2)',
//         yAxisID: 'y1',
//         tension: 0.3
//       }
//     ]
//   };

//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="flex border-b border-gray-200">
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'overview' ? 'border-b-2 border-lightBlue-600 text-lightBlue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           onClick={() => setActiveTab('overview')}
//         >
//           Overview
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'categories' ? 'border-b-2 border-lightBlue-600 text-lightBlue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           onClick={() => setActiveTab('categories')}
//         >
//           Categories
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'ratings' ? 'border-b-2 border-lightBlue-600 text-lightBlue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           onClick={() => setActiveTab('ratings')}
//         >
//           Ratings
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'trends' ? 'border-b-2 border-lightBlue-600 text-lightBlue-600' : 'text-gray-500 hover:text-gray-700'}`}
//           onClick={() => setActiveTab('trends')}
//         >
//           Trends
//         </button>
//       </div>

//       {/* Overview Tab */}
//       {activeTab === 'overview' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-medium">
//                 Feedback Overview
//               </h3>
//               <div className="flex space-x-4">
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     className="form-radio"
//                     name="chartType"
//                     value="bar"
//                     checked={chartType === 'bar'}
//                     onChange={() => setChartType('bar')}
//                   />
//                   <span className="ml-2">Bar</span>
//                 </label>
//                 <label className="inline-flex items-center">
//                   <input
//                     type="radio"
//                     className="form-radio"
//                     name="chartType"
//                     value="pie"
//                     checked={chartType === 'pie'}
//                     onChange={() => setChartType('pie')}
//                   />
//                   <span className="ml-2">Pie</span>
//                 </label>
//               </div>
//             </div>
//             <div className={chartType === 'pie' ? "max-w-xs mx-auto" : ""}>
//               {chartType === 'bar' ? (
//                 <Bar 
//                   data={overviewChartData} 
//                   options={{
//                     responsive: true,
//                     scales: {
//                       y: {
//                         beginAtZero: true
//                       }
//                     }
//                   }}
//                 />
//               ) : (
//                 <Pie 
//                   data={overviewChartData} 
//                   options={{
//                     responsive: true,
//                     plugins: {
//                       legend: {
//                         position: 'right'
//                       }
//                     }
//                   }}
//                 />
//               )}
//             </div>
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Feedback Summary</h3>
//             <div className="space-y-4">
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Total Feedback:</span>
//                 <span className="font-medium">{stats?.total || 0}</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Average Rating:</span>
//                 <span className="font-medium">{stats?.averageRating || 0}</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Recommendation Rate:</span>
//                 <span className="font-medium">{stats?.recommendationRate || 0}%</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Most Popular Category:</span>
//                 <span className="font-medium capitalize">
//                   {mostPopularCategory._id} ({mostPopularCategory.total})
//                 </span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Positive Feedback (4-5 stars):</span>
//                 <span className="font-medium">{stats?.summary?.totalPositive || 0}</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Negative Feedback (1-2 stars):</span>
//                 <span className="font-medium">{stats?.summary?.totalNegative || 0}</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>Organizational Feedback:</span>
//                 <span className="font-medium">{stats?.summary?.totalOrganizational || 0}</span>
//               </div>
//               <div className="flex justify-between p-2 bg-gray-50 rounded">
//                 <span>User Feedback:</span>
//                 <span className="font-medium">{stats?.summary?.totalUser || 0}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Categories Tab */}
//       {activeTab === 'categories' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Feedback by Category</h3>
//             <Doughnut 
//               data={categoryChartData} 
//               options={{
//                 responsive: true,
//                 plugins: {
//                   legend: {
//                     position: 'right'
//                   }
//                 }
//               }}
//             />
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Category Details</h3>
//             <div className="space-y-4">
//               {categoryStats.map((category, index) => (
//                 <div key={index} className="p-3 bg-gray-50 rounded-lg">
//                   <div className="flex justify-between font-medium capitalize">
//                     <span>{category.category}</span>
//                     <span>{category.count} feedbacks</span>
//                   </div>
//                   <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                     <div className="flex justify-between">
//                       <span>Avg Rating:</span>
//                       <span>{category.avgRating}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Recommend:</span>
//                       <span>{category.recommendRate}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Positive:</span>
//                       <span>{category.positiveCount} ({category.positivePercentage})</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Negative:</span>
//                       <span>{category.negativeCount} ({category.negativePercentage})</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Ratings Tab */}
//       {activeTab === 'ratings' && (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Rating Distribution</h3>
//             <Bar 
//               data={ratingChartData} 
//               options={{
//                 responsive: true,
//                 scales: {
//                   y: {
//                     beginAtZero: true
//                   }
//                 }
//               }}
//             />
//           </div>
          
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Rating Details</h3>
//             <div className="space-y-4">
//               {ratingDistribution.map((count, index) => (
//                 <div key={index} className="flex items-center">
//                   <div className="w-8 text-right mr-2">
//                     {index + 1} Star:
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center">
//                       <div 
//                         className="bg-lightBlue-600 h-6 rounded" 
//                         style={{ width: `${(count / stats?.total) * 100}%` }}
//                       ></div>
//                       <span className="ml-2 text-sm">{count} ({Math.round((count / stats?.total) * 100)}%)</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="pt-4 mt-4 border-t">
//                 <div className="flex justify-between">
//                   <span>Positive (4-5 stars):</span>
//                   {/* <span className="font-medium">
//                     {ratingDistribution.slice(3).reduce((a, b) => a + b, 0)} (
//                     {Math.round((ratingDistribution.slice(3).reduce((a, b) => a + b, 0) / stats?.total * 100)}%)
//                   </span> */}
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Neutral (3 stars):</span>
//                   <span className="font-medium">
//                     {ratingDistribution[2]} ({Math.round(ratingDistribution[2] / stats?.total * 100)}%)
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Negative (1-2 stars):</span>
//                   {/* <span className="font-medium">
//                     {ratingDistribution.slice(0, 2).reduce((a, b) => a + b, 0)} (
//                     {Math.round((ratingDistribution.slice(0, 2).reduce((a, b) => a + b, 0) / stats?.total * 100)}%)
//                   </span> */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Trends Tab */}
//       {activeTab === 'trends' && (
//         <div className="grid grid-cols-1 gap-6">
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-medium mb-4">Monthly Feedback Trends</h3>
//             <Line 
//               data={trendChartData} 
//               options={{
//                 responsive: true,
//                 interaction: {
//                   mode: 'index',
//                   intersect: false,
//                 },
//                 scales: {
//                   y: {
//                     type: 'linear',
//                     display: true,
//                     position: 'left',
//                     title: {
//                       display: true,
//                       text: 'Feedback Count'
//                     }
//                   },
//                   y1: {
//                     type: 'linear',
//                     display: true,
//                     position: 'right',
//                     min: 0,
//                     max: 5,
//                     title: {
//                       display: true,
//                       text: 'Average Rating'
//                     },
//                     grid: {
//                       drawOnChartArea: false,
//                     },
//                   },
//                 }
//               }}
//             />
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-lg font-medium mb-4">Recent Feedback</h3>
//               <div className="space-y-3">
//                 {stats?.recentFeedbacks?.map((feedback, index) => (
//                   <div key={index} className="p-3 border rounded-lg">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <span className="font-medium capitalize">{feedback.feedbackCategory}</span>
//                         <div className="flex items-center mt-1">
//                           {[...Array(5)].map((_, i) => (
//                             <svg
//                               key={i}
//                               className={`w-4 h-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`}
//                               fill="currentColor"
//                               viewBox="0 0 20 20"
//                             >
//                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                             </svg>
//                           ))}
//                         </div>
//                       </div>
//                       <span className="text-sm text-gray-500">
//                         {new Date(feedback.createdDate).toLocaleDateString()}
//                       </span>
//                     </div>
//                     <p className="mt-2 text-sm text-gray-600">{feedback.feedbackMessage}</p>
//                     <div className="mt-2 flex justify-between text-sm">
//                       <span className={`px-2 py-1 rounded ${feedback.recommend ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                         {feedback.recommend ? 'Recommended' : 'Not Recommended'}
//                       </span>
//                       <span className="capitalize">{feedback.feedbackType}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
            
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h3 className="text-lg font-medium mb-4">Feedback by Type</h3>
//               <div className="grid grid-cols-1 gap-4">
//                 {stats?.feedbackByType?.map((type, index) => (
//                   <div key={index} className="p-4 border rounded-lg">
//                     <div className="flex justify-between items-center mb-2">
//                       <span className="font-medium capitalize">{type.type || 'Unknown'}</span>
//                       <span>{type.count} feedbacks</span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 text-sm">
//                       <div className="flex justify-between">
//                         <span>Avg Rating:</span>
//                         <span>{type.avgRating}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Recommend:</span>
//                         <span>{type.recommendCount} ({type.recommendPercentage})</span>
//                       </div>
//                     </div>
//                     <div className="mt-2">
//                       <div className="h-2 bg-gray-200 rounded-full">
//                         <div 
//                           className="h-2 bg-lightBlue-600 rounded-full" 
//                           style={{ width: `${(type.count / stats?.total) * 100}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };