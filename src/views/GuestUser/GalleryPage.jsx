import React from 'react';
import ShowGalleryImages from '../../components/GuestUser/Gallery/ShowGalleryImages';
import { motion } from 'framer-motion';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-lightBlue-600 py-20 mt-24 -mb-24 z-10">
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
              <span className="block">Explore Our Visual Journey</span>
              {/* <motion.span 
                className="block text-blue-200 mt-4 text-2xl md:text-3xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Where Every Image Tells a Story
              </motion.span> */}
            </h1>
            <motion.p 
              className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
             “Explore our vibrant moments and memories captured through the lens.”
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

      {/* Enhanced Main Content */}
      <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <ShowGalleryImages />
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;