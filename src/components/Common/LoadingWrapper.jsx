import React from 'react';

export default function LoadingWrapper({ isLoading, error, children }) {
  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightBlue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading market data...</p>
      </div>
    );
  }

  return children;
}