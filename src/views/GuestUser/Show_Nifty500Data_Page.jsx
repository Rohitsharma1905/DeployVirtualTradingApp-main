import React from 'react';
import CardTable from '../../components/Common/CardTable';
import { motion } from 'framer-motion';

const Show_Nifty500Data_Page = () => {
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
                <span>Nifty 500 Market Data</span>
              </h1>
              <motion.p 
                className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed pb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                "Comprehensive stock market information covering the top 500 companies."
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

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl -mt-12"
    >
      {/* Header Section */}
      {/* <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-8 relative z-20 bg-lightBlue-600 rounded-xl p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-white flex items-center">
          <span>Nifty 500 Market Data</span>
        </h1>
        <p className="mt-2 text-lg text-indigo-100">
          Comprehensive stock market information covering the top 500 companies.
        </p>
      </motion.div> */}

      {/* Card Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white rounded-xl -mt-5 pt-20 shadow-lg overflow-hidden border border-gray-100 relative z-10"
      >
        <CardTable tableType="nifty500" isGuestUser={true} />
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

export default Show_Nifty500Data_Page;