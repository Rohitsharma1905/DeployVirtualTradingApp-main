import React from "react";
import StockMarket from "../../assets/stock-market.jpg";
import { motion } from "framer-motion";
import { FaChartLine, FaBookOpen, FaTools, FaUsers, FaShieldAlt, FaRocket, FaCogs, FaHandHoldingUsd } from "react-icons/fa";

const AboutPage = () => {
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
                  <span>Your Trusted Trading Companion</span>
                </h1>
                <motion.p 
                  className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed "
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  "Empowering Smarter Investment Decisions for Everyone."
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
      
      {/* About Us Section */}
     {/* About Us Section */}
<div className="mt-0 pt-0 py-16 mb-2 flex flex-col md:flex-row items-center justify-center px-6">
  <motion.div
    className="text-black md:w-1/2 px-6"
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blueGray-800">About Us</h1>
    <p className="text-lg leading-relaxed opacity-80">
      This project was created to empower individuals to make informed investment decisions and navigate the complexities of the stock market with confidence.
    </p>
    <p className="text-lg leading-relaxed opacity-80 mt-4">
      Our mission is to democratize access to financial information and provide tools and resources that enable investors of all levels to succeed in their financial goals.
    </p>
    <p className="text-lg leading-relaxed opacity-80 mt-4">
      This project offers{" "}
      <span className="text-blueGray-500 font-semibold">Comprehensive Market Analysis</span>,{" "}
      <span className="text-blueGray-500 font-semibold">Educational Resources</span>,{" "}
      <span className="text-blueGray-500 font-semibold">Powerful Tools</span>, and{" "}
      <span className="text-blueGray-500 font-semibold">Community Support</span>.
    </p>
  </motion.div>

  <motion.div
    className="md:w-1/2 px-6 !mt-20 md:mt-0"
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <img
      src={StockMarket}
      alt="Stock Market"
      className="w-full h-auto object-cover rounded-lg shadow-lg"
    />
  </motion.div>
</div>


    

      {/* Why Choose Us Section */}
      <div className="bg-white py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-blueGray-800">
          Why Choose Us?
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <FeatureCard icon={<FaShieldAlt />} title="Reliable Data" color="text-lightBlue-600" description="We source accurate and timely financial data." />
          <FeatureCard icon={<FaRocket />} title="Fast & Responsive" color="text-red-500" description="Optimized performance ensures a seamless experience." />
          <FeatureCard icon={<FaCogs />} title="Customizable Tools" color="text-yellow-500" description="Tailor features and insights to your personal strategy." />
          <FeatureCard icon={<FaHandHoldingUsd />} title="Financial Empowerment" color="text-green-600" description="We believe in creating wealth through smart decisions." />
        </div>
      </div>

      {/* Testimonial / Quote Section */}
      <div className="bg-blue-50 py-16 px-6 text-center">
        <p className="text-xl italic text-gray-700 max-w-3xl mx-auto">
          "In investing, what is comfortable is rarely profitable. Our platform is designed to help you step beyond comfort and into confidence."
        </p>
        <p className="mt-4 font-semibold text-blueGray-600">— The PGR - Virtual Tradind App Team</p>
      </div>
    </>
  );
};

// ✅ Reusable Feature Card component
const FeatureCard = ({ icon, title, color, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all text-center">
    <div className={`text-4xl ${color} mx-auto mb-4`}>{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);
export default AboutPage;
