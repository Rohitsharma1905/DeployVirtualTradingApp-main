import React from "react";

const CompanyDetailModal = ({ isOpen, onClose, company }) => {
  if (!isOpen || !company) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{company.symbol} Details</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Open Price:</strong> {company.open}</p>
          <p><strong>Close Price:</strong> {company.previousClose}</p>
          <p><strong>Day High:</strong> {company.dayHigh}</p>
          <p><strong>Day Low:</strong> {company.dayLow}</p>
          <p><strong>Last Price:</strong> {company.lastPrice}</p>
          <p><strong>Change:</strong> {company.change}</p>
          <p><strong>% Change:</strong> {company.pChange}</p>
          <p><strong>Year High:</strong> {company.yearHigh}</p>
          <p><strong>Year Low:</strong> {company.yearLow}</p>
        </div>
        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailModal;
