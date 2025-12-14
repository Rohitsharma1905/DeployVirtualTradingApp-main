import React from "react";
import StockTable from '../../components/Common/StockTable';
import { motion } from 'framer-motion';

const Show_ETFData_Page = () => {
  return (
    <>
  <div className="relative overflow-hidden bg-lightBlue-600 py-12 mt-32 z-10"> 
  {/* Background noise texture */}
  <div className="absolute inset-0 opacity-20 z-0">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
  </div>
  
  {/* Content Container */}
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight flex justify-center items-center">
        <span>ETF Market Data</span>
      </h1>
      <motion.p 
        className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        "Real-time stock market information with advanced analytics."
      </motion.p>
    </motion.div>
  </div>

  {/* Floating bubbles decoration */}
  <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
    {[...Array(15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white opacity-10 z-10"
        style={{
          width: Math.random() * 120 + 30,
          height: Math.random() * 120 + 30,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, Math.random() * 60 - 30],
          x: [0, Math.random() * 60 - 30],
          opacity: [0.05, 0.2, 0.05],
        }}
        transition={{
          duration: Math.random() * 15 + 15,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
</div>


  {/* Main Section */}
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl -mt-17"
  >
    {/* Card Table Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="bg-white pt-50 rounded-xl shadow-lg overflow-hidden border border-gray-100 relative z-10"
    >
      <StockTable isGuestUser={true} />
    </motion.div>

    {/* Footer Section */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="mt-8 text-center text-gray-500 text-sm"
    >
      <p>Data updates every 5 minutes. Last updated: {new Date().toLocaleString()}</p>
    </motion.div>
  </motion.div>
</>

  );
};

export default Show_ETFData_Page;
