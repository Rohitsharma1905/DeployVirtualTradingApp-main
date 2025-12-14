

// // components/graphs/OrganizationStatsGraph.js
// import React, { useState } from 'react';
// import { Bar, Pie } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

// export const OrganizationStatsGraph = ({ stats }) => {
//   const [chartType, setChartType] = useState('organizationCounts'); // 'organizationCounts' or 'userDistribution'

//   const barData = {
//     labels: ['Total Organizations', 'Active Organizations', 'Pending Organizations'],
//     datasets: [
//       {
//         label: 'Count',
//         data: [stats?.totalOrganizations || 0, stats?.activeOrgs || 0, stats?.pendingOrgs || 0],
//         backgroundColor: [
//           'rgba(54, 162, 235, 0.5)',
//           'rgba(75, 192, 192, 0.5)',
//           'rgba(255, 99, 132, 0.5)'
//         ],
//         borderColor: [
//           'rgba(54, 162, 235, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(255, 99, 132, 1)'
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const pieData = {
//     labels: ['Total Users', 'Male Users', 'Female Users'],
//     datasets: [
//       {
//         data: [stats?.totalUsers || 0, stats?.maleUsers || 0, stats?.femaleUsers || 0],
//         backgroundColor: [
//           'rgba(54, 162, 235, 0.5)',
//           'rgba(255, 99, 132, 0.5)',
//           'rgba(255, 206, 86, 0.5)'
//         ],
//         borderColor: [
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 99, 132, 1)',
//           'rgba(255, 206, 86, 1)'
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-lg font-medium">
//               {chartType === 'organizationCounts' ? 'Organization Status' : 'User Distribution'}
//             </h3>
//             <div className="flex space-x-4">
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio"
//                   name="chartType"
//                   value="organizationCounts"
//                   checked={chartType === 'organizationCounts'}
//                   onChange={() => setChartType('organizationCounts')}
//                 />
//                 <span className="ml-2">Organizations</span>
//               </label>
//               <label className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   className="form-radio"
//                   name="chartType"
//                   value="userDistribution"
//                   checked={chartType === 'userDistribution'}
//                   onChange={() => setChartType('userDistribution')}
//                 />
//                 <span className="ml-2">Users</span>
//               </label>
//             </div>
//           </div>
//           {chartType === 'organizationCounts' ? <Bar data={barData} /> : <Pie data={pieData} />}
//         </div>
        
//         <div className="bg-gray-50 p-4 rounded-lg">
//           <h3 className="text-lg font-medium mb-4">Organization Statistics</h3>
//           <div className="space-y-4">
//             <div className="flex justify-between">
//               <span>Total Organizations:</span>
//               <span className="font-medium">{stats?.totalOrganizations || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Active Organizations:</span>
//               <span className="font-medium">{stats?.activeOrgs || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Pending Organizations:</span>
//               <span className="font-medium">{stats?.pendingOrgs || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Total Users:</span>
//               <span className="font-medium">{stats?.totalUsers || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Male Users:</span>
//               <span className="font-medium">{stats?.maleUsers || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Female Users:</span>
//               <span className="font-medium">{stats?.femaleUsers || 0}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Average Age:</span>
//               <span className="font-medium">{stats?.averageAge || 0}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const OrganizationStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'pie'

  const chartData = {
    labels: [
      'Total Orgs', 
      'Active Orgs', 
      'Pending Orgs',
      'Total Users',
      'Male Users',
      'Female Users',
      'Avg Age'
    ],
    datasets: [{
      label: 'Organizations',
      data: [
        stats?.totalOrganizations || 0,
        stats?.activeOrgs || 0,
        stats?.pendingOrgs || 0,
        stats?.totalUsers || 0,
        stats?.maleUsers || 0,
        stats?.femaleUsers || 0,
        stats?.averageAge || 0
      ],
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {chartType === 'bar' ? 'Organization Statistics' : 'Data Distribution'}
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
          <h3 className="text-lg font-medium mb-4">Detailed Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Organizations:</span>
              <span className="font-medium">{stats?.totalOrganizations || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Organizations:</span>
              <span className="font-medium">{stats?.activeOrgs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Organizations:</span>
              <span className="font-medium">{stats?.pendingOrgs || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Users:</span>
              <span className="font-medium">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Male Users:</span>
              <span className="font-medium">{stats?.maleUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Female Users:</span>
              <span className="font-medium">{stats?.femaleUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Average Age:</span>
              <span className="font-medium">{stats?.averageAge || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};