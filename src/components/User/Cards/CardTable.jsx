import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../../assets/styles/table.css';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import Loader from '../../Common/Loader';
const Table = () => {
  const [niftyData, setNiftyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_API_URL}/admin/niftydata`);
        console.log('Fetched data:', response.data);
        if (response.data && Array.isArray(response.data)) {
          const sortedData = response.data.sort((a, b) => new Date(b.fetchTime) - new Date(a.fetchTime));
          setNiftyData([sortedData[0]]);
        } else {
          setError('Invalid data format received');
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'none';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (sortConfig.direction === 'none') {
      return data;
    }
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  };

  // Fundamental Calculation Functions
  const calculatePERatio = (lastPrice, earningsPerShare) => {
    if (!lastPrice || !earningsPerShare) return 'N/A'; // Prevent division by 0 or undefined values
    return (parseFloat(lastPrice) / parseFloat(earningsPerShare)).toFixed(2);
  };
  
  const calculatePBRatio = (lastPrice, bookValue) => {
    if (!lastPrice || !bookValue) return 'N/A';
    return (parseFloat(lastPrice) / parseFloat(bookValue)).toFixed(2);
  };
  
  const calculateDividendYield = (dividend, lastPrice) => {
    if (!dividend || !lastPrice) return 'N/A';
    return ((parseFloat(dividend) / parseFloat(lastPrice)) * 100).toFixed(2) + '%';
  };
  
  const calculateROCE = (roce) => roce ? parseFloat(roce).toFixed(2) + '%' : 'N/A';
  
  const calculateROE = (roe) => roe ? parseFloat(roe).toFixed(2) + '%' : 'N/A';
  

  const calculateFundamentals = (row) => {
    return {
      peRatio: calculatePERatio(row.lastPrice, row.earningsPerShare),
      pbRatio: calculatePBRatio(row.lastPrice, row.bookValue),
      dividendYield: calculateDividendYield(row.dividend, row.lastPrice),
      eps: row.earningsPerShare ? row.earningsPerShare.toFixed(2) : 'N/A',
      roce: calculateROCE(row.roce),
      roe: calculateROE(row.roe),
    };
  };
  

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="py-8">
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <h3 className="table-header">Nifty Data</h3>
          <div className="ag-theme-custom">
            <table className="ag-header">
              <thead>
                <tr>
                  {[
                    'symbol', 'open', 'dayHigh', 'dayLow', 'previousClose', 'lastPrice', 'change', 'pChange',
                    'totalTradedVolume', 'totalTradedValue', 'yearHigh', 'yearLow', 'perChange365d', 'perChange30d',
                    'P/E Ratio', 'P/B Ratio', 'Dividend Yield', 'EPS', 'ROCE', 'ROE'
                  ].map((column) => (
                    <th
                      key={column}
                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort(column)}
                    >
                      {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      {sortConfig.key === column && (sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {niftyData[0]?.stocks && getSortedData(niftyData[0].stocks).map((row, index) => {
                  console.log('Row Data:', row);
                  const fundamentals = calculateFundamentals(row);
                  return (
                    <tr key={index} className="ag-header-cell">
                      <td className="ag-row">
                        <Link to={`/company/${row.symbol}`} className="text-lightBlue-600 hover:text-blue-800">
                          {row.symbol}
                        </Link>
                      </td>
                      {['open', 'dayHigh', 'dayLow', 'previousClose', 'lastPrice', 'change', 'pChange', 'totalTradedVolume', 'totalTradedValue', 'yearHigh', 'yearLow', 'perChange365d', 'perChange30d'].map((field, index) => (
                        <td key={index} className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                          {row[field]}
                        </td>
                      ))}
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.peRatio}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.pbRatio}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.dividendYield}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.eps}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.roce}</td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{fundamentals.roe}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
