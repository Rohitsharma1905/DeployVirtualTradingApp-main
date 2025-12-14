import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiCheckCircle, 
  FiArrowRight, 
  FiClock, 
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiAward,
  FiDollarSign,
  FiUsers
} from "react-icons/fi";
import LoginModal from "../../views/auth/UnifiedLoginModal";
import subscriptionData from "../../data/subscriptionPlans.json";

const PricingPage = () => {
  const [selectedDuration, setSelectedDuration] = useState("monthly");
  const [showAllFeatures, setShowAllFeatures] = useState({});
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const subscriptionPlans = subscriptionData.plans;

  const getDurationLabel = (duration) => {
    switch (duration) {
      case "monthly": return "Monthly";
      case "quarterly": return "Quarterly";
      case "halfYearly": return "Half Yearly";
      default: return "";
    }
  };

  const getDiscountBadge = (duration) => {
    switch (duration) {
      case "quarterly": return { text: "Save 10%", color: "bg-green-100 text-green-800" };
      case "halfYearly": return { text: "Save 20%", color: "bg-green-100 text-green-800" };
      default: return null;
    }
  };

  const getPlanColor = (planId) => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return {
      border: "border-gray-200 hover:border-gray-300",
      button: "bg-gray-600 hover:bg-gray-700",
      badge: "bg-gray-100 text-gray-800",
      highlight: "bg-gray-50"
    };

    const colors = {
      silver: {
        border: "border-gray-200 hover:border-gray-300",
        button: "bg-gray-600 hover:bg-gray-700",
        badge: "bg-gray-100 text-gray-800",
        highlight: "bg-gray-50"
      },
      gold: {
        border: "border-yellow-400 hover:border-yellow-500",
        button: "bg-yellow-600 hover:bg-yellow-700",
        badge: "bg-yellow-100 text-yellow-800",
        highlight: "bg-yellow-50"
      },
      platinum: {
        border: "border-purple-200 hover:border-purple-300",
        button: "bg-purple-600 hover:bg-purple-700",
        badge: "bg-purple-100 text-purple-800",
        highlight: "bg-purple-50"
      },
      diamond: {
        border: "border-blue-200 hover:border-blue-300",
        button: "bg-lightBlue-600 hover:bg-blue-700",
        badge: "bg-blue-100 text-blue-800",
        highlight: "bg-blue-50"
      }
    };
    return colors[planId] || colors.silver;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
    hover: { x: 3 }
  };

  const DurationButton = ({ duration, isSelected, onClick }) => {
    const discount = getDiscountBadge(duration);
    
    return (
      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        className={`
          px-4 sm:px-6 py-2 rounded-full font-medium text-xs sm:text-sm
          ${isSelected 
            ? "bg-lightBlue-600 text-white shadow-md" 
            : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200"}
          transition-all duration-200 flex items-center
        `}
      >
        {duration === "monthly" && <FiClock className="mr-2" size={16} />}
        {duration === "quarterly" && <FiTrendingUp className="mr-2" size={16} />}
        {duration === "halfYearly" && <FiAward className="mr-2" size={16} />}
        <span>{getDurationLabel(duration)}</span>
        {discount && (
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${discount.color}`}>
            {discount.text}
          </span>
        )}
      </motion.button>
    );
  };

  const FeatureList = ({ features, planId }) => {
    const shouldShowToggle = features.length > 5;
    const isShowingAll = showAllFeatures[planId];
    const displayFeatures = isShowingAll ? features : features.slice(0, 5);
    
    return (
      <div className="space-y-2">
        <motion.ul 
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {displayFeatures.map((feature, index) => (
            <motion.li
              key={index}
              variants={featureVariants}
              whileHover="hover"
              className="flex items-start text-xs text-gray-600"
            >
              <FiCheckCircle className="mr-2 mt-0.5 text-green-500 flex-shrink-0 text-sm" />
              <span>{feature}</span>
            </motion.li>
          ))}
        </motion.ul>
        {shouldShowToggle && (
          <button
            onClick={() => setShowAllFeatures(prev => ({
              ...prev,
              [planId]: !prev[planId]
            }))}
            className="text-lightBlue-600 text-xs mt-1 flex items-center hover:underline"
          >
            {isShowingAll ? (
              <>
                <FiChevronUp className="mr-1" /> Show less
              </>
            ) : (
              <>
                <FiChevronDown className="mr-1" /> Show all {features.length} features
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  const stats = [
    {
      icon: <FiUsers className="text-green-600" size={18} />,
      title: "Active Subscribers",
      value: "10,000+",
      bg: "bg-green-50"
    },
    {
      icon: <FiAward className="text-yellow-600" size={18} />,
      title: "Premium Members",
      value: "2,500+",
      bg: "bg-yellow-50"
    },
    {
      icon: <FiDollarSign className="text-lightBlue-600" size={18} />,
      title: "Monthly Payouts",
      value: "₹5M+",
      bg: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="pt-16 md:pt-24 pb-12 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section - Full Width */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] my-6 sm:my-8 overflow-hidden bg-lightBlue-600 py-12  z-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
          </div>
          
          <div className="relative w-full mt-8 text-center z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-4xl  md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight pt-2">
                <span className="block">Choose Your Trading Journey</span>
              </h1>
              <motion.p 
                className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
  “Unlock premium features, boost profits, and trade smarter with flexible plans.”
              </motion.p>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
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

        {/* Stats Bar */}
        <div className="relative bg-white rounded-lg shadow-xs p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border border-gray-100 z-20 -mt-8 sm:-mt-14 mx-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`p-2 ${stat.bg} rounded-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-sm sm:text-base font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rest of content with side padding */}
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Duration Selector */}
          <div className="flex justify-center mb-8 sm:mb-10">
            <div className="bg-white rounded-full shadow-sm p-1 flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:space-x-2 border border-gray-200">
              {["monthly", "quarterly", "halfYearly"].map((duration) => (
                <DurationButton
                  key={duration}
                  duration={duration}
                  isSelected={selectedDuration === duration}
                  onClick={() => setSelectedDuration(duration)}
                />
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-white rounded-xl overflow-hidden border
                  ${getPlanColor(plan.id).border}
                  transition-all duration-300 hover:shadow-lg flex flex-col h-full
                `}
              >
                {/* Plan Badge */}
                {plan.badge && (
                  <div className={`
                    absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-semibold
                    ${getPlanColor(plan.id).badge}
                  `}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan Content */}
                <div className="p-4 sm:p-5 flex-grow flex flex-col">
                  {/* Plan Header */}
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{plan.tagline}</p>
                    
                    {/* Price */}
                    <div className="mt-3 sm:mt-4">
                      <div className="flex items-baseline">
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                          ₹{plan.price[selectedDuration].toLocaleString()}
                        </span>
                        <span className="ml-1 text-gray-500 text-xs sm:text-sm">
                          /{selectedDuration === "monthly" ? "mo" : selectedDuration === "quarterly" ? "qtr" : "6mo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Virtual Trading Amount */}
                  <motion.div 
                    className={`p-3 rounded-lg mb-4 ${getPlanColor(plan.id).highlight}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm sm:text-md font-bold text-gray-900">
                          ₹{plan.virtualAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Virtual Trading Capital</p>
                      </div>
                      <FiTrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-lightBlue-600" />
                    </div>
                  </motion.div>

                  {/* Trading Hours */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Trading Hours</h4>
                    {plan.tradingHours.map((hours, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center text-xs text-gray-600 mb-1"
                        whileHover="hover"
                        variants={featureVariants}
                      >
                        <FiClock className="mr-2 text-lightBlue-600 text-xs sm:text-sm" />
                        {hours}
                      </motion.div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="mb-4 flex-grow">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Key Features</h4>
                    <FeatureList 
                      features={plan.features}
                      planId={plan.id}
                    />
                  </div>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-2">Limitations</h4>
                      <ul className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <motion.li
                            key={index}
                            className="flex items-center text-xs text-gray-500"
                            whileHover="hover"
                            variants={featureVariants}
                          >
                            <span className="mr-1">•</span>
                            {limitation}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="p-4 bg-gray-50">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setIsLoginModalOpen(true)}
                    className={`
                      w-full py-2 px-4 rounded-lg font-medium text-white text-xs sm:text-sm
                      bg-lightBlue-600
                      transition-all duration-300
                      flex items-center justify-center
                    `}
                  >
                    Get Started
                    <motion.div
                      className="ml-2"
                      whileHover={{ x: 3 }}
                    >
                      <FiArrowRight size={14} className="sm:size-auto" />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-12 sm:mt-16">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Frequently Asked Questions</h2>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="font-medium flex items-center text-sm sm:text-base">
                  <FiCheckCircle className="text-lightBlue-600 mr-3" size={18} />
                  How do I upgrade or downgrade my plan?
                </h3>
                <p className="mt-2 text-gray-600 pl-7 sm:pl-8 text-xs sm:text-sm">
                  You can change your subscription plan at any time from your account settings. Any price differences will be prorated and applied to your next billing cycle.
                </p>
              </div>
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <h3 className="font-medium flex items-center text-sm sm:text-base">
                  <FiCheckCircle className="text-lightBlue-600 mr-3" size={18} />
                  Is there a free trial available?
                </h3>
                <p className="mt-2 text-gray-600 pl-7 sm:pl-8 text-xs sm:text-sm">
                  Yes! We offer a 7-day free trial for all new users on our Silver plan. No credit card required to start your trial.
                </p>
              </div>
              <div className="p-4 sm:p-6">
                <h3 className="font-medium flex items-center text-sm sm:text-base">
                  <FiCheckCircle className="text-lightBlue-600 mr-3" size={18} />
                  What payment methods do you accept?
                </h3>
                <p className="mt-2 text-gray-600 pl-7 sm:pl-8 text-xs sm:text-sm">
                  We accept all major credit cards, UPI payments, net banking, and select digital wallets. All payments are processed securely through our payment partners.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default PricingPage;