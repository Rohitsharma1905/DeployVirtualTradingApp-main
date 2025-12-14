import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

const SubscriptionPage = [
  {
    id: "silver",
    name: "Silver Plan",
    price: 300,
    duration: "1 Month",
    virtualAmount: 500000,
    features: [
      "Virtual trading amount of ₹5,00,000",
      "Real-time market data",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "gold",
    name: "Gold Plan",
    price: 500,
    duration: "1 Month",
    virtualAmount: 1000000,
    features: [
      "Virtual trading amount of ₹10,00,000",
      "Real-time market data",
      "Advanced analytics",
      "Priority support",
    ],
  },
  {
    id: "platinum",
    name: "Platinum Plan",
    price: 1000,
    duration: "3 Months",
    virtualAmount: 2000000,
    features: [
      "Virtual trading amount of ₹20,00,000",
      "Real-time market data",
      "Premium analytics",
      "24/7 Priority support",
    ],
  },
  {
    id: "diamond",
    name: "Diamond Plan",
    price: 2000,
    duration: "6 Months",
    virtualAmount: 5000000,
    features: [
      "Virtual trading amount of ₹50,00,000",
      "Real-time market data",
      "Premium analytics",
      "24/7 Priority support",
      "API access",
    ],
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Trading Plan
          </h2>
          <p className="text-lg text-gray-600">
            Select the perfect plan that suits your needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {subscriptionPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className="border p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="text-lg font-semibold text-center mb-2">
                {plan.name}
              </h4>
              <p className="text-center text-gray-700">
                ₹{plan.price.toLocaleString()} / {plan.duration}
              </p>
              <p className="text-lg font-bold text-blue-800 text-center mt-1">
                ₹{plan.virtualAmount.toLocaleString()}
              </p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <button className="w-full mt-4 py-2 rounded text-white bg-lightBlue-600 hover:bg-blue-700 transition-colors duration-300">
                  Subscribe Now
                  <FiArrowRight className="inline ml-2" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default SubscriptionPage;
