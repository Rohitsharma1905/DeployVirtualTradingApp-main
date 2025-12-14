import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../../utils/BaseUrl";
import { motion } from "framer-motion";
import { FiTrendingUp, FiBarChart2, FiPieChart, FiDatabase, FiLayers } from "react-icons/fi";
import CountUp from 'react-countup';

const NumberOfStocksCards = ({shouldRefetch}) => {

  const [nifty50Stocks, setNifty50Stocks] = useState(0);
  const [etfStocks, setEtfStocks] = useState(0);
  const [nifty500Stocks, setNifty500Stocks] = useState(0);
  const [totalStocks, setTotalStocks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("")

  const fetchNifty50Stocks = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(`${BASE_API_URL}/admin/nifty/data`);
      if (!response.ok) throw new Error("Failed to fetch Nifty50 Stocks");
  
      const data = await response.json();
  
      if (!data?.data?.[0]?.stocks) {
        throw new Error("Invalid API response format");
      }
  
      const totalVolume = data.data[0].stocks.reduce(
        (acc, item) => acc + (item.totalTradedVolume || 0), 
        0
      );
  
      setNifty50Stocks(totalVolume);
      setError("");
    } 
    catch (error) {
      setError(error.message);
    } 
    finally {
      setLoading(false); // Always stop loading
    }
  };  

  const fetchNifty500Stocks = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${BASE_API_URL}/admin/nifty500/company`);
      if (!response.ok) throw new Error("Failed to fetch Nifty500 Stocks");
  
      const data = await response.json();
  
      if (!data?.data?.[0]?.stocks) {
        throw new Error("Invalid API response format");
      }
  
      const totalVolume = data.data[0].stocks.reduce(
        (acc, item) => acc + (item.totalTradedVolume || 0), 
        0
      );
  
      setNifty500Stocks(totalVolume);
      setError("");
    } 
    catch (error) {
      setError(error.message);
    } 
    finally {
      setLoading(false); // Always stop loading
    }
  };

  const fetchEtfStocks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_API_URL}/admin/etfdata`);
      if (!response.ok) throw new Error("Failed to fetch ETF Stocks");

      const data = await response.json();

      // const stockCount = data.length;

      const totalVolume = data.reduce(
        (acc, item) => acc + (item.totalTradedVolume || 0), 
        0
      );
      setEtfStocks(totalVolume);
      setError("");
    } 
    catch (err) {
      setError(err.message);
    } 
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(shouldRefetch){
      fetchNifty50Stocks();
      fetchNifty500Stocks();
      fetchEtfStocks()
      setTotalStocks(nifty50Stocks+nifty500Stocks+etfStocks)
    }
  }, [shouldRefetch]);

  const stats = [
    { 
      id: 1, 
      title: "Nifty50 Stocks", 
      value: nifty50Stocks,
      icon: <FiTrendingUp className="w-8 h-8" />,  // Represents top stocks / growth
      color: "bg-blue-100 text-blue-700"
    },
    { 
      id: 2, 
      title: "ETF Stocks", 
      value: etfStocks,
      icon: <FiPieChart className="w-8 h-8" />,  // ETF represents diversified investment
      color: "bg-green-100 text-green-700"
    },
    { 
      id: 3, 
      title: "Nifty500 Stocks", 
      value: nifty500Stocks,
      icon: <FiBarChart2 className="w-8 h-8" />,  // Represents broad market overview
      color: "bg-purple-100 text-purple-700"
    },
    { 
      id: 4, 
      title: "Total Stocks", 
      value: totalStocks,
      icon: <FiDatabase className="w-8 h-8" />,  // Represents a collection/summary
      color: "bg-orange-100 text-orange-700"
    },
  ];  

  return (
    <section className="my-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div 
              key={stat.id}
              whileHover={{ y: -5 }}
              className="bg-white min-w-[260px] rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className={`flex items-center justify-center w-16 h-16 rounded-full ${stat.color} mb-4 mx-auto`}>
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                  {loading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                  ) : (
                    <CountUp 
                      end={stat.value} 
                      duration={2.5} 
                      separator=","
                      className="block"
                    />
                  )}
                </h3>
                <p className="text-lg text-center text-gray-600 font-medium">
                  {stat.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NumberOfStocksCards;