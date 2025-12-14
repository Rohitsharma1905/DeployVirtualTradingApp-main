// import React from 'react';
// import { Bar, Doughnut } from 'react-chartjs-2';

// export const EventStatsGraph = ({ stats }) => {
//   const eventData = {
//     labels: ['Upcoming', 'Ongoing', 'Completed'],
//     datasets: [{
//       label: 'Events',
//       data: [stats?.upcoming || 0, stats?.ongoing || 0, stats?.completed || 0],
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)'
//       ]
//     }]
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Event Status</h3>
//           <Doughnut data={eventData} />
//         </div>
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Event Statistics</h3>
//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span>Total Events:</span>
//               <span className="font-medium">{stats?.total || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Upcoming:</span>
//               <span className="font-medium">{stats?.upcoming || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Ongoing:</span>
//               <span className="font-medium">{stats?.ongoing || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Completed:</span>
//               <span className="font-medium">{stats?.completed || 0}</span>
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

export const EventStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'

  const chartData = {
    labels: ['Total Events', 'Upcoming', 'Ongoing', 'Completed'],
    datasets: [{
      label: 'Events',
      data: [
        stats?.total || 0,
        stats?.upcoming || 0,
        stats?.ongoing || 0,
        stats?.completed || 0
      ],
      backgroundColor: [
        'rgba(153, 102, 255, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
      ],
      borderColor: [
        'rgba(153, 102, 255, 1)',
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
              {chartType === 'bar' ? 'Event Statistics' : 'Event Distribution'}
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
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return `${context.label}: ${context.raw}`;
                        }
                      }
                    }
                  }
                }}
              />
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Event Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Events:</span>
              <span className="font-medium">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Upcoming Events:</span>
              <span className="font-medium">{stats?.upcoming || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongoing Events:</span>
              <span className="font-medium">{stats?.ongoing || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Events:</span>
              <span className="font-medium">{stats?.completed || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};