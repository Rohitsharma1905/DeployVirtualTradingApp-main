import React from "react";
import { Link } from "react-router-dom";
import { FiTrendingUp, FiPieChart, FiDollarSign, FiAlertCircle, FiBarChart2, FiBookOpen } from "react-icons/fi";
import { motion } from 'framer-motion';

const ServicesPage = () => {
  const services = [
    {
      icon: <FiTrendingUp className="text-2xl" />,
      title: "Stock Analysis",
      description: "Get in-depth technical and fundamental analysis of stocks before investing.",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <FiPieChart className="text-2xl" />,
      title: "Investment Strategies",
      description: "Tailored investment plans to maximize your returns safely.",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <FiDollarSign className="text-2xl" />,
      title: "Portfolio Management",
      description: "Professional management and optimization of your stock portfolio.",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: <FiAlertCircle className="text-2xl" />,
      title: "Live Market Updates",
      description: "Real-time stock market movements and breaking news alerts.",
      color: "bg-blue-100 text-lightBlue-600"
    },
    {
      icon: <FiBarChart2 className="text-2xl" />,
      title: "Trading Signals",
      description: "AI-powered trading signals for better decision-making.",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <FiBookOpen className="text-2xl" />,
      title: "Market Education",
      description: "Learn stock trading from basics to advanced strategies.",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  return (
    
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-lightBlue-600 py-12 mt-12 z-10">
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight">
              <span className="block">Our Premium Services</span>

            </h1>
            <motion.p 
              className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Professional stock market tools and services to help you invest smarter
            </motion.p>
          </motion.div>
        </div>
        
        {/* Enhanced decorative elements */}
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
    </div>
      {/* Services Grid */}
      <div className="max-w-7xl mx-auto -mt-134 px-4 py-10 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
              <div className="px-6 pb-4">
                <button className="text-lightBlue-600 hover:text-lightBlue-700 font-medium text-sm flex items-center">
                  Learn more
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default ServicesPage;