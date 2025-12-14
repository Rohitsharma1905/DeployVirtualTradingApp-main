import React, { useState } from 'react';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const StatsGraph = ({ 
  stats,
  title,
  chartLabels,
  chartDataKeys,
  statsDetails,
  defaultChartType = 'bar',
  chartTypes = ['bar', 'pie'],
  chartColors = [
    'rgba(54, 162, 235, 0.5)',
    'rgba(75, 192, 192, 0.5)',
    'rgba(255, 99, 132, 0.5)',
    'rgba(153, 102, 255, 0.5)',
    'rgba(255, 159, 64, 0.5)',
    'rgba(255, 206, 86, 0.5)',
    'rgba(201, 203, 207, 0.5)'
  ]
}) => {
  const [chartType, setChartType] = useState(defaultChartType);

  // Generate chart data dynamically
  const chartData = {
    labels: chartLabels,
    datasets: [{
      label: title,
      data: chartDataKeys.map(key => stats?.[key] || 0),
      backgroundColor: chartColors.slice(0, chartDataKeys.length),
      borderColor: chartColors.map(color => color.replace('0.5', '1')).slice(0, chartDataKeys.length),
      borderWidth: 1,
    }]
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
            ) : chartType === 'pie' ? (
              <Pie 
                data={chartData} 
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
            ) : (
              <Doughnut 
                data={chartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
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
          <h3 className="text-lg font-medium mb-4">Detailed Statistics</h3>
          <div className="space-y-4">
            {statsDetails.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span>{detail.label}:</span>
                <span className="font-medium">
                  {stats?.[detail.key] ?? detail.defaultValue ?? 0}
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