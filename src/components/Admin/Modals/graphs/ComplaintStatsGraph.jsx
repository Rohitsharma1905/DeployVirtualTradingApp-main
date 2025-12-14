
import React, { useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const ComplaintStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'doughnut'

  const chartData = {
    labels: ['Total Complaints', 'Pending', 'Resolved', 'Recent'],
    datasets: [{
      label: 'Complaints',
      data: [
        stats?.total || 0, 
        stats?.pendingComplaint || 0, 
        stats?.resolvedComplaint || 0, 
        stats?.recentComplaint || 0
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(72, 145, 183, 0.5)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(72, 145, 183, 1)'
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
              {chartType === 'bar' ? 'Complaint Statistics' : 'Complaint Distribution'}
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
          <h3 className="text-lg font-medium mb-4">Complaint Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Complaints:</span>
              <span className="font-medium">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium">{stats?.pendingComplaint || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved:</span>
              <span className="font-medium">{stats?.resolvedComplaint || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Recent:</span>
              <span className="font-medium">{stats?.recentComplaint || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// import React, { useState } from 'react';
// import { Bar, Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// export const ComplaintStatsGraph = ({ stats }) => {
//   const [chartType, setChartType] = useState('bar'); // Toggle between 'bar' and 'doughnut'
//   const [darkMode, setDarkMode] = useState(false); // Toggle for dark mode

//   const chartData = {
//     labels: ['Total Complaints', 'Pending', 'Resolved', 'Recent'],
//     datasets: [{
//       label: 'Complaints',
//       data: [
//         stats?.total || 0, 
//         stats?.pendingComplaint || 0, 
//         stats?.resolvedComplaint || 0, 
//         stats?.recentComplaint || 0
//       ],
//       backgroundColor: [
//         'rgba(54, 162, 235, 0.7)',
//         'rgba(255, 206, 86, 0.7)',
//         'rgba(75, 192, 192, 0.7)',
//         'rgba(72, 145, 183, 0.5)'
//       ],
//       borderColor: [
//         'rgba(54, 162, 235, 1)',
//         'rgba(255, 206, 86, 1)',
//         'rgba(75, 192, 192, 1)',
//         'rgba(72, 145, 183, 1)'
//       ],
//       borderWidth: 1
//     }]
//   };

//   const chartOptions = {
//     responsive: true,
//     animation: {
//       duration: 1000, 
//       easing: 'easeInOutQuart'
//     },
//     scales: {
//       x: {
//         ticks: {
//           color: darkMode ? '#ffffff' : '#000000' // Adjust x-axis text color
//         },
//         grid: {
//           color: darkMode ? '#444444' : '#e0e0e0' // Adjust x-axis gridlines
//         }
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           color: darkMode ? '#ffffff' : '#000000' // Adjust y-axis text color
//         },
//         grid: {
//           color: darkMode ? '#444444' : '#e0e0e0' // Adjust y-axis gridlines
//         }
//       }
//     },
//     plugins: {
//       legend: {
//         labels: {
//           color: darkMode ? '#ffffff' : '#000000' // Adjust legend text color
//         }
//       }
//     }
//   };

//   const handleDownload = () => {
//     const canvas = document.getElementById('chartCanvas');
//     const link = document.createElement('a');
//     link.href = canvas.toDataURL('image/png');
//     link.download = 'complaint-stats-chart.png';
//     link.click();
//   };

//   return (
//     <div className={`space-y-6 p-4 rounded-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
//       <div className="flex justify-between items-center mb-4">
//         <h3 className="text-lg font-medium">Complaint Statistics</h3>
//         <div className="flex space-x-4">
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700"
//           >
//             {darkMode ? 'Light Mode 🌞' : 'Dark Mode 🌙'}
//           </button>
//           <button
//             onClick={handleDownload}
//             className="px-4 py-2 rounded bg-lightBlue-600 text-white hover:bg-blue-700"
//           >
//             Download 📥
//           </button>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">
//               {chartType === 'bar' ? 'Complaint Statistics' : 'Complaint Distribution'}
//             </h3>
//             <div className="flex space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio"
//                   name="chartType"
//                   value="bar"
//                   checked={chartType === 'bar'}
//                   onChange={() => setChartType('bar')}
//                 />
//                 <span className="ml-2">Bar Chart</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio"
//                   name="chartType"
//                   value="doughnut"
//                   checked={chartType === 'doughnut'}
//                   onChange={() => setChartType('doughnut')}
//                 />
//                 <span className="ml-2">Pie Chart</span>
//               </label>
//             </div>
//           </div>
//           <div className={chartType === 'doughnut' ? "max-w-xs mx-auto" : ""}>
//             {chartType === 'bar' ? (
//               <Bar 
//                 id="chartCanvas"
//                 data={chartData} 
//                 options={chartOptions}
//               />
//             ) : (
//               <Doughnut 
//                 id="chartCanvas"
//                 data={chartData} 
//                 options={chartOptions}
//               />
//             )}
//           </div>
//         </div>
        
//         <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
//           <h3 className="text-lg font-medium mb-4">Complaint Details</h3>
//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span>Total Complaints:</span>
//               <span className="font-medium">{stats?.total || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Pending:</span>
//               <span className="font-medium">{stats?.pendingComplaint || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Resolved:</span>
//               <span className="font-medium">{stats?.resolvedComplaint || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Recent:</span>
//               <span className="font-medium">{stats?.recentComplaint || 0}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };