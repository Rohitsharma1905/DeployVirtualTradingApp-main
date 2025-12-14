import React, { useState } from "react";
import { 
  FaChartLine, 
  FaExclamationTriangle, 
  FaUserShield, 
  FaRegCheckCircle,
  FaLock,
  FaRegClock,
  FaRegFileAlt,
  FaTimes
} from "react-icons/fa";
import { motion } from "framer-motion";

const StartScreenPopupModal = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!isOpen) return null;

  const guidelines = [
    {
      icon: <FaChartLine className="text-lightBlue-600 text-xl" />,
      title: "Educational Purpose Only",
      content: [
        "This is a virtual trading simulator designed exclusively for education and training.",
        "All transactions use simulated currency - no real money is involved.",
        "Practice trading strategies and market analysis in a completely risk-free environment."
      ],
      color: "border-blue-200 bg-blue-50",
      iconBg: "bg-blue-100"
    },
    {
      icon: <FaExclamationTriangle className="text-amber-500 text-xl" />,
      title: "Risk Disclosure",
      content: [
        "This is not a financial advisory service or real trading platform.",
        "All data, analysis, and suggestions are simulated using AI algorithms.",
        "Results shown are hypothetical and don't represent actual market performance.",
        "We assume no responsibility for real-world financial decisions made by users."
      ],
      color: "border-amber-200 bg-amber-50",
      iconBg: "bg-amber-100"
    },
    {
      icon: <FaLock className="text-red-500 text-xl" />,
      title: "No Liability",
      content: [
        "The app developers are not liable for any real-world trading outcomes.",
        "Always consult licensed financial professionals before making actual investments.",
        "You acknowledge that all trading here is purely simulated."
      ],
      color: "border-red-200 bg-red-50",
      iconBg: "bg-red-100"
    },
    {
      icon: <FaUserShield className="text-green-500 text-xl" />,
      title: "Code of Conduct",
      content: [
        "Use this platform ethically and responsibly at all times.",
        "System exploitation or unrealistic simulations may result in account termination.",
        "Comply with all applicable laws and platform guidelines."
      ],
      color: "border-green-200 bg-green-50",
      iconBg: "bg-green-100"
    },
    {
      icon: <FaRegClock className="text-indigo-500 text-xl" />,
      title: "Data Privacy",
      content: [
        "We collect anonymized usage data to enhance your experience.",
        "No personal financial information is required or stored.",
        "Your privacy is protected under our comprehensive Privacy Policy."
      ],
      color: "border-indigo-200 bg-indigo-50",
      iconBg: "bg-indigo-100"
    },
    {
      icon: <FaRegFileAlt className="text-purple-500 text-xl" />,
      title: "Platform Usage",
      content: [
        "We may modify or discontinue features without prior notice.",
        "Access may be terminated for violations of our Terms of Service.",
        "Content is provided 'as is' without warranties of any kind."
      ],
      color: "border-purple-200 bg-purple-50",
      iconBg: "bg-purple-100"
    }
  ];

  const handleAccept = () => {
    if (acceptedTerms) {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black transition-opacity duration-300 z-40"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >


        {/* Header - Logo on left */}
        <div className="pt-6 pb-4 px-6 bg-white border-b border-gray-100">
        <div className="flex justify-center">
    <div className="flex items-center gap-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img
          src="https://media.licdn.com/dms/image/v2/C510BAQE1pPlwgZETKw/company-logo_200_200/company-logo_200_200/0/1630605647519/praedico_global_research_pvt_ltd_logo?e=2147483647&v=beta&t=8hAhEoZ7nj9gKxuh6iA-q10402A-rxdAP4GeUOAnFdQ"
          alt="PGR Logo"
          className="h-20 w-20 rounded-full bg-white p-1 shadow-sm border border-gray-200"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Praedico Global Research
        </h1>
        <h2 className="text-lg text-lightBlue-600 font-semibold">
          PGR - Virtual Trading App
        </h2>
      </div>
    </div>
  </div>

          {/* Warning banner below */}
          <div className="w-full bg-lightBlue-600 text-white p-3 rounded-lg text-center mt-4 shadow-sm">
            <p className="font-medium text-sm">
              Please review these terms carefully before proceeding
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1" style={{ paddingBottom: '1.5rem' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {guidelines.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, type: "spring" }}
                className={`rounded-lg p-4 hover:shadow-md transition-all duration-300 border ${item.color} flex flex-col h-full`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`${item.iconBg} p-2.5 rounded-lg shadow-sm flex-shrink-0`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-800 text-base">
                    {item.title}
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 flex-grow">
                  {item.content.map((text, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mr-2 mt-1 text-xs text-gray-400">•</span>
                      <span className="leading-relaxed">{text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FaRegFileAlt className="text-lightBlue-600" />
              Additional Terms & Conditions
            </h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                By using this PGR platform, you acknowledge that all trading is simulated and that no actual securities transactions are being executed. You understand that the results shown are hypothetical and that hypothetical performance results have certain inherent limitations.
              </p>
              <p>
                PGR may collect usage data to improve services, but will never collect or store sensitive personal financial information. You agree to use the platform only for lawful purposes and in accordance with these Terms of Use.
              </p>
              <p>
                PGR reserves the right to modify or discontinue any features at any time without notice. We may terminate or suspend access to the platform immediately, without prior notice or liability, for any reason whatsoever.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center w-full max-w-lg">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={() => setAcceptedTerms(!acceptedTerms)}
                className="h-4 w-4 text-lightBlue-600 rounded focus:ring-lightBlue-600 border-gray-300"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-700">
                I have read, understood, and agree to all the terms and conditions above
              </label>
            </div>

            <div className="flex gap-3 w-full max-w-md">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                disabled={!acceptedTerms}
                className={`px-4 py-2 rounded-lg transition-colors duration-300 font-medium shadow-sm hover:shadow-md flex items-center gap-2 justify-center flex-1 text-sm ${
                  acceptedTerms 
                    ? 'bg-lightBlue-600 text-white hover:from-lightBlue-700 hover:to-blue-700' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaRegCheckCircle />
                Accept & Continue
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Praedico Global Research Pvt Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StartScreenPopupModal;