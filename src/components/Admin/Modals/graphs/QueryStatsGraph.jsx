// import React from 'react';
// import { Bar, Doughnut } from 'react-chartjs-2';

// export const QueryStatsGraph = ({ stats }) => {
//   const eventData = {
//     labels: ['Total', 'Recent', 'Category'],
//     datasets: [{
//       label: 'Query',
//       data: [stats?.total || 0, stats?.recentQueries || 0,  "4"],
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)',
//       ]
//     }]
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Queries Status</h3>
//           <Doughnut data={eventData} />
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Queries Statistics</h3>
//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span>Total Queries:</span>
//               <span className="font-medium">{stats?.total || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Recent:</span>
//               <span className="font-medium">{stats?.recentQueries?.count || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Category:</span>
//               <span className="font-medium">{ "4"}</span>
//             </div>
          
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const QueryStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'

  const chartData = {
    labels: ['Total Queries', 'Recent Queries', 'Categories'],
    datasets: [{
      label: 'Queries',
      data: [
        stats?.total || 0,
        stats?.recentQueries?.count || 0,
        4 // Static category count as shown in your example
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)'
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
              {chartType === 'bar' ? 'Query Statistics' : 'Query Distribution'}
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
                  value="doughnut"
                  checked={chartType === 'doughnut'}
                  onChange={() => setChartType('doughnut')}
                />
                <span className="ml-2">Pie Chart</span>
              </label>
            </div>
          </div>
          <div className={chartType === 'doughnut' ? "max-w-xs mx-auto" : ""}>
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
              <Doughnut 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12,
                        padding: 10
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Query Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Queries:</span>
              <span className="font-medium">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Recent Queries:</span>
              <span className="font-medium">{stats?.recentQueries?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Categories:</span>
              <span className="font-medium">4</span>
            </div>
            {/* Add more query statistics here if available */}
          </div>
        </div>
      </div>
    </div>
  );
};