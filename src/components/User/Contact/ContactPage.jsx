import React, { useState } from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";
import StockP from "../../../assets/p-stock.jpg";
import "./ContactPage.css"; // Import custom CSS file

import { BASE_API_URL } from "../../../utils/BaseUrl";
const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <IndexNavbar />

      {/* Contact Section */}
      <div className=" min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-20 relative">
        {/* Left - Content */}
        <div className="text-black md:w-1/2 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blueGray-800">
            Get in Touch with StockSphere
          </h1>
          <p className="text-lg leading-relaxed opacity-80">
            Have questions or need support? Contact us today, and we’ll be happy to help!
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-4">
            Email us at:
            <Link to="mailto:support@stocksphere.com" className="text-blueGray-500 font-semibold">
              {" "}
              support@stocksphere.com{" "}
            </Link>
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-2">
            Call us at: <span className="text-blueGray-500 font-semibold">+1 (800) 123-4567</span>
          </p>

          {/* Contact Us Button */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-indigo-700  px-6 py-3 font-bold rounded-md text-sm md:text-lg shadow-lg"
            >
              CONTACT US
            </button>
          </div>
        </div>

        {/* Right - Image */}
        <div className="md:w-1/2 px-6 mt-12 md:mt-0">
          <img src={StockP} alt="Stock Market" className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
      </div>

      {/* Contact Modal */}
      {isModalOpen && <ContactModal onClose={() => setIsModalOpen(false)} />}

      <Footer />
    </>
  );
};

const ContactModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    type: "General Inquiry",
    desc: "",
  });

  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${BASE_API_URL}/contact/createContact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Your message has been sent successfully!");
        setFormData({ name: "", email: "", mobile: "", type: "General Inquiry", desc: "" });
      } else {
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
  <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
  <div style={{ width: "100%", maxWidth: "90%" }} className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
    <div className="flex justify-between items-center p-6 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
          <i className="fas fa-envelope text-white"></i>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200">
        <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
      </button>
    </div>
    <div className="p-6 overflow-y-auto max-h-[80vh]">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200">
            <option>General Inquiry</option>
            <option>Technical Support</option>
            <option>Billing Issue</option>
            <option>Feedback</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200" rows="3" required></textarea>
        </div>
        <div className="col-span-2 flex justify-end items-center space-x-4 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200">Cancel</button>
          <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200">Submit</button>
        </div>
      </form>
    </div>
  </div>
</div>


    </>
  );
};

export default ContactPage;
