import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../assets/styles/companypage.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, BarChart3, Clock, Award, PieChart } from 'lucide-react';
import Loader from '../../components/Common/Loader';
import AdminNavbar from "../../components/Admin/Navbars/AdminNavbar";
import Sidebar from "../../components/Admin/Sidebar/Sidebar";
// import HeaderStats from "../../components/Admin/Headers/HeaderStats.js";
import FooterAdmin from "../../components/Admin/Footers/FooterAdmin";

const CompanyDetailsPage = () => {
  const { symbol } = useParams();
  const [companyData, setCompanyData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'none' });
  const [filteredData, setFilteredData] = useState([]);

  const priceHistory = [
    { date: '2024-01', price: 100 },
    { date: '2024-02', price: 120 },
    { date: '2024-03', price: 115 },
    { date: '2024-04', price: 140 },
    { date: '2024-05', price: 135 },
    { date: '2024-06', price: 160 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await fetch(`http://localhost:5000/api/company/${symbol}`);
        const companyData = await companyResponse.json();
        if (!companyResponse.ok) {
          throw new Error(companyData.message || 'Failed to fetch company data');
        }
        setCompanyData(companyData);

        const historicalResponse = await fetch(`http://localhost:5000/api/symbol/${symbol}`);
        const historicalData = await historicalResponse.json();
        if (!historicalResponse.ok) {
          throw new Error(historicalData.message || 'Failed to fetch historical data');
        }

        const processedData = preprocessData(historicalData);
        setHistoricalData(processedData);
        setFilteredData(processedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  const preprocessData = (data) => {
    if (!data) return [];
    return data.map((record) => ({
      ...record,
      lastUpdateTime: new Date(record.lastUpdateTime).toISOString(),
    }));
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
        <div className="error-message">
          <p className="error-text">Unable too Fetch Company Data</p>
          <p className="error-details">{error}</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const QuickStats = () => {
    const latestStock = companyData;

    if (!latestStock) {
      return <p>Loading...</p>;
    }

    return (
      <div className="quick-stats-container">
        <div className="quick-stats-flex">
          {[{
            icon: latestStock?.change >= 0 ? ArrowUpCircle : ArrowDownCircle,
            iconColor: latestStock?.change >= 0 ? 'green' : 'red',
            title: 'Current Price',
            value: `₹${latestStock?.lastPrice}`,
            change: `% Change: ${latestStock?.pChange}%`
          },
          {
            icon: TrendingUp,
            iconColor: 'blue',
            title: '52 Week Range',
            value: `₹${latestStock?.yearHigh}`,
            change: `Low: ₹${latestStock?.yearLow}`
          },
          {
            icon: BarChart3,
            iconColor: 'purple',
            title: 'Trading Volume',
            value: Number(latestStock?.totalTradedVolume).toLocaleString(),
            change: 'Shares Traded'
          }].map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-header">
                {React.createElement(stat.icon, { className: 'icon', color: stat.iconColor, size: 24 })}
                <p className="stat-title">{stat.title}</p>
              </div>
              <h3 className="stat-value">{stat.value}</h3>
              <p className={`stat-change ${stat.iconColor}`}>{stat.change}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
    if (!data) return [];
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

  const filterData = (range) => {
    if (!historicalData) return;

    const currentTime = new Date();
    const currentUTCTime = Date.UTC(currentTime.getUTCFullYear(), currentTime.getUTCMonth(), currentTime.getUTCDate(), currentTime.getUTCHours(), currentTime.getUTCMinutes(), currentTime.getUTCSeconds());

    const filtered = historicalData.filter((record) => {
      const lastUpdateTime = new Date(record.lastUpdateTime);
      const recordUTCTime = Date.UTC(lastUpdateTime.getUTCFullYear(), lastUpdateTime.getUTCMonth(), lastUpdateTime.getUTCDate(), lastUpdateTime.getUTCHours(), lastUpdateTime.getUTCMinutes(), lastUpdateTime.getUTCSeconds());

      const timeDiff = currentUTCTime - recordUTCTime;
      switch (range) {
        case "1D":
          return (
            currentTime.getUTCFullYear() === lastUpdateTime.getUTCFullYear() &&
            currentTime.getUTCMonth() === lastUpdateTime.getUTCMonth() &&
            currentTime.getUTCDate() === lastUpdateTime.getUTCDate()
          );
        case "1W":
          return timeDiff <= 7 * 24 * 60 * 60 * 1000;
        case "1M":
          return timeDiff <= 30 * 24 * 60 * 60 * 1000;
        case "3M":
          return timeDiff <= 90 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    setFilteredData(filtered);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="overview-container">
            <div className="overview-card">
              <h3 className="overview-title">
                <Clock className="overview-icon" />
                Trading Information
              </h3>
              <div className="overview-stats">
                {[{ label: 'Open: ', value: companyData?.open }, { label: 'Previous Close: ', value: companyData?.previousClose }, { label: 'Day High: ', value: companyData?.dayHigh }, { label: 'Day Low: ', value: companyData?.dayLow }]
                  .map((item, index) => (
                    <div key={index} className="overview-item">
                      <span className="overview-label">{item.label}</span>
                      <span className="overview-value">{item.value}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="overview-card">
              <h3 className="overview-title">
                <Award className="overview-icon" />
                Performance Metrics
              </h3>
              <div className="overview-stats">
                {[{ label: '1 Month Return: ', value: `${companyData?.perChange30d}%` }, { label: '1 Year Return: ', value: `${companyData?.perChange365d}%` }, { label: 'Total Traded Volume: ', value: Number(companyData?.totalTradedVolume).toLocaleString() }, { label: 'Total Traded Value: ', value: Number(companyData?.totalTradedValue).toLocaleString() }]
                  .map((item, index) => (
                    <div key={index} className="overview-item">
                      <span className="overview-label">{item.label}</span>
                      <span className="overview-value">{item.value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case 'chart':
        return (
          <div className="chart-container">
            <h3 className="chart-title">
              <PieChart className="chart-icon" />
              Price History
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }} />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'analysis':
        return (
          <div className="analysis-container">
            <h3 className="analysis-title">Historical Data</h3>
            <div className="table-container">
              <div className="button-container">
                <button onClick={() => filterData("1D")} className="filter-button">1D</button>
                <button onClick={() => filterData("1W")} className="filter-button">1W</button>
                <button onClick={() => filterData("1M")} className="filter-button">1M</button>
                <button onClick={() => filterData("3M")} className="filter-button">3M</button>
                <button onClick={() => setFilteredData(historicalData || [])} className="filter-button reset-button">Reset</button>
              </div>
              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="ag-theme-custom">
                  <table className="ag-header">
                    <thead>
                      <tr>
                        {['lastUpdateTime', 'open', 'dayHigh', 'dayLow', 'previousClose', 'lastPrice', 'change', 'pChange', 'totalTradedVolume', 'yearHigh', 'yearLow', 'perChange365d', 'perChange30d'].map((column) => (
                          <th key={column} className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => requestSort(column)}> {column.replace(/([A-Z])/g, ' $1').toUpperCase()}  {sortConfig.key === column && (sortConfig.direction === 'ascending' ? ' ▲' : sortConfig.direction === 'descending' ? ' ▼' : '')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedData(filteredData || [])?.map((data, index) => (
                        <tr key={index}>
                          <td>{formatDate(data.lastUpdateTime)}</td>
                          <td>{data.open}</td>
                          <td>{data.dayHigh}</td>
                          <td>{data.dayLow}</td>
                          <td>{data.previousClose}</td>
                          <td>{data.lastPrice}</td>
                          <td>{data.change}</td>
                          <td>{data.pChange}%</td>
                          <td>{data.totalTradedVolume}</td>
                          <td>{data.yearHigh}</td>
                          <td>{data.yearLow}</td>
                          <td>{data.perChange365d}%</td>
                          <td>{data.perChange30d}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        <div className="page-container relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
          <div className="company-info-card">
            <div className="company-header">
              <h1 className="company-name">{companyData?.name} {symbol}</h1>
              <p className="company-symbol">{formatDate(companyData?.lastUpdateTime)}</p>
            </div>
            <QuickStats />
          </div>
          <div className="tabs-container">
            <div className="tabs">
              {['overview', 'chart', 'analysis'].map((tab) => (
                <button
                  key={tab}
                  className={`tab-button ${activeTab === tab ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {renderTabContent()}
            </div>
          </div>
        </div>
        <FooterAdmin />
      </div>
    </>
  );
};

export default CompanyDetailsPage;