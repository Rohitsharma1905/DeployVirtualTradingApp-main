
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import ScrollToTopLink from "../../Common/ScrollToTopLink";
import StartScreenPopupModal from "../Home/StartScreenPopupModal";

export default function Footer() {
  const [showModal, setShowModal] = useState(false);

  const handleLegalLinkClick = () => {
    setShowModal(true);
  };
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-0">
      <div className="container mx-auto px-4">
        {/* Main Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Company Info & Social */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-bold mb-3">
                PGR - Virtual Trading App
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering traders with cutting-edge tools and insights for
                smarter investment decisions.
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="text-gray-300 font-semibold my-4">Follow Us</h5>
              <div className="flex space-x-3">
                <a
                  href="https://x.com/GlobalPraedico/status/1654331946049339393"
                  target="blank"
                  className="bg-gray-800 hover:bg-lightBlue-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="https://www.facebook.com/praedicoglobalresearch/"
                  target="blank"
                  aria-label="Facebook"
                  className="bg-gray-800 hover:bg-blue-700 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/praedicoglobalresearch_/"
                  aria-label="Instagram"
                  target="blank"
                  className="bg-gray-800 hover:bg-pink-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/praedico-global-research-pvt-ltd/posts/?feedView=all"
                  target="blank"
                  aria-label="LinkedIn"
                  className="bg-gray-800 hover:bg-lightBlue-600 text-white h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h5 className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider">
              Useful Links
            </h5>
            <ul className="space-y-3">
              <li>
                <ScrollToTopLink
                  to="/about"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  About Us
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Contact Us
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink
                  to="/services"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Services
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink
                  to="/event"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Events
                </ScrollToTopLink>
              </li>
              <li>
                <ScrollToTopLink
                  to="/gallery"
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Gallery
                </ScrollToTopLink>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider">
              Legal & Resources
            </h5>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => handleLegalLinkClick()}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalLinkClick()}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalLinkClick()}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalLinkClick()}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  Risk Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLegalLinkClick()}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm flex items-center w-full text-left"
                  >
                  <i className="fas fa-chevron-right text-xs mr-2 text-lightBlue-500"></i>
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Modal Component */}
          {showModal && (
            <StartScreenPopupModal onClose={() => setShowModal(false)} />
          )}

          {/* Column 4: Contact Info */}
          <div>
            <h5 className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider">
              Contact Us
            </h5>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-lightBlue-500"></i>
                <span>
                  First Floor, Garima Arcade, Shinde Ki Chhawani Gwalior, Madhya
                  Pradesh (474001)
                  <br />
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-volume mr-3 text-lightBlue-500" ></i>
                <a
                  href="tel:+1234567890"
                  className="hover:text-white transition-colors duration-300"
                  >
                  + 91 83193 35916
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-lightBlue-500"></i>
                <a
                  href="mailto:guptapriyank87@gmail.com"
                  className="hover:text-white transition-colors duration-300"
                  >
                  guptapriyank87@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-3 text-lightBlue-500"></i>
                <span>Mon-Fri: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        {/* <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
          <h4 className="text-lg font-bold mb-2">Subscribe to our Newsletter</h4>
          <p className="text-gray-400 text-sm">Get the latest updates and news</p>
          </div>
          <div className="w-full md:w-auto flex">
          <input 
          type="email" 
          placeholder="Your email address" 
          className="px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-lightBlue-600 text-gray-900 w-full"
          />
          <button className="bg-lightBlue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors duration-300">
          Subscribe
          </button>
          </div>
          </div>
          </div> */}

        {/* Copyright Section */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Praedico Global Research Pvt Ltd. All
              rights reserved.
            </div>
            {/* <div className="flex space-x-6">
              <a href="#privacy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
              <a href="#terms" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
              <a href="#cookies" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">Cookies</a>
              </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
