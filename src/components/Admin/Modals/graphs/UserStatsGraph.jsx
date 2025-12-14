



import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const UserStatsGraph = ({ stats }) => {
  const [chartType, setChartType] = useState('userCounts'); // 'userCounts' or 'distribution'

  const barData = {
    labels: ['Total Users', 'Active Users', 'Deactive Users', 'Male Users', 'Female Users', 'Other Genders', 'Avg Age'],
    datasets: [
      {
        label: 'Users',
        data: [
          stats?.total || 0, 
          stats?.active || 0, 
          stats?.deactive || 0,
          stats?.male || 0,
          stats?.female || 0,
          stats?.other || 0,
          stats?.averageAge || 0
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Total Users', 'Active', 'Deactive', 'Male', 'Female', 'Other', 'Avg Age'],
    datasets: [
      {
        data: [
          stats?.total || 0,
          stats?.active || 0, 
          stats?.deactive || 0,
          stats?.male || 0,
          stats?.female || 0,
          stats?.other || 0,
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
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {chartType === 'userCounts' ? 'User Statistics' : 'User Distribution'}
            </h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="chartType"
                  value="userCounts"
                  checked={chartType === 'userCounts'}
                  onChange={() => setChartType('userCounts')}
                />
                <span className="ml-2">Bar Chart</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="chartType"
                  value="distribution"
                  checked={chartType === 'distribution'}
                  onChange={() => setChartType('distribution')}
                />
                <span className="ml-2">Pie Chart</span>
              </label>
            </div>
          </div>
          <div className={chartType === 'distribution' ? "max-w-xs mx-auto" : ""}>
            {chartType === 'userCounts' ? 
              <Bar 
                data={barData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              /> : 
              <Pie 
                data={pieData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        boxWidth: 12
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
            }
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">User Statistics Details</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Users:</span>
              <span className="font-medium">{stats?.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users:</span>
              <span className="font-medium">{stats?.active || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Deactive Users:</span>
              <span className="font-medium">{stats?.deactive || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Male Users:</span>
              <span className="font-medium">{stats?.male || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Female Users:</span>
              <span className="font-medium">{stats?.female || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Other Genders:</span>
              <span className="font-medium">{stats?.other || 0}</span>
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

