import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiTrendingUp, FiCreditCard } from "react-icons/fi";
import LoginModal from "../../../views/auth/Login";

const PricingPage = () => {
  const [isUserLoginModalOpen, setUserLoginModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const subscriptionPlans = [
    {
      id: "gold",
      name: "Gold Plan",
      price: 999,
      duration: "1 Month",
      virtualAmount: 100000,
      features: [
        "Virtual trading amount of ₹1,00,000",
        "Real-time market data",
        "Basic analytics",
        "Email support",
        "Access to Nifty 50 stocks",
        "Basic trading tools",
      ],
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      highlight: false
    },
    {
      id: "platinum",
      name: "Platinum Plan",
      price: 2499,
      duration: "3 Months",
      virtualAmount: 500000,
      features: [
        "Virtual trading amount of ₹5,00,000",
        "Real-time market data",
        "Advanced analytics",
        "Priority support",
        "Access to Nifty 50 & 500 stocks",
        "Advanced trading tools",
        "Portfolio insights",
        "Technical indicators",
      ],
      color: "bg-blue-100",
      textColor: "text-blue-800",
      buttonColor: "bg-lightBlue-600 hover:bg-blue-700",
      highlight: true
    },
    {
      id: "diamond",
      name: "Diamond Plan",
      price: 4999,
      duration: "6 Months",
      virtualAmount: 1000000,
      features: [
        "Virtual trading amount of ₹10,00,000",
        "Real-time market data",
        "Premium analytics",
        "24/7 Priority support",
        "Access to all stocks & ETFs",
        "Advanced trading tools",
        "Portfolio insights",
        "Technical indicators",
        "API access",
        "Custom alerts",
        "Research reports",
      ],
      color: "bg-purple-100",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      highlight: false
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transparent <span className="text-lightBlue-600">Pricing</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan that suits your trading needs. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className={`rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all ${plan.color} ${plan.highlight ? 'ring-2 ring-yellow-500 transform scale-105' : ''}`}
            >
              <div className="p-6">
                {plan.highlight && (
                  <div className="bg-yellow-500 text-white text-sm font-medium py-1 px-3 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className={`text-2xl font-bold mb-2 ${plan.textColor}`}>
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                  <span className="text-lg"> / {plan.duration}</span>
                </div>

                {/* Virtual Trading Amount */}
                <div className="bg-white bg-opacity-50 p-3 rounded-lg mb-6 flex items-center justify-between">
                  <span className="text-sm font-medium">Virtual Trading Amount</span>
                  <FiTrendingUp className="text-green-600" />
                  <span className="text-lg font-bold">₹{plan.virtualAmount.toLocaleString()}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.slice(0, 6).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mt-0.5 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setUserLoginModalOpen(true);
                  }}
                  className={`w-full py-3 rounded-lg text-white font-medium transition ${plan.buttonColor}`}
                >
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center mb-4 sm:mb-0">
            <FiCreditCard className="text-gray-600 mr-2" />
            <span className="text-sm text-gray-600">Secure payment powered by Razorpay</span>
          </div>
          <Link to="/terms" className="text-sm text-lightBlue-600 hover:underline">
            Terms & Conditions
          </Link>
        </motion.div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isUserLoginModalOpen}
        onClose={() => setUserLoginModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </div>
  );
};

export default PricingPage;