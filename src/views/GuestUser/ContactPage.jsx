import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import StockP from "../../assets/p-stock.jpg";
import "../../components/GuestUser/Contact/ContactPage.css"; 
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";

import { BASE_API_URL } from "../../utils/BaseUrl";

const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
     {/* Hero Section */}
     {/* <div className="relative overflow-hidden bg-lightBlue-600 !mt-10 py-16 z-10 mb-0 ">
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
            <h1 className="text-4xl md:text-5xl pt-16 pb-0 font-extrabold text-white tracking-tight leading-snug">
              <span className="block">Contact Us</span>
              <motion.span
                className="block text-blue-200 mt-2 text-xl md:text-2xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                 We'd love to hear from you! Get in touch with our team today.
              </motion.span>
            </h1>
           
          </motion.div>
        </div>
      </div> */}
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
                        <span>We're Here to Help</span>
                      </h1>
                      <motion.p 
                        className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      >
                        "We'd love to hear from you! Get in touch with our team today."
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

      {/* Contact Section */}
      
<div className="mt-0 pt-0 py-16 mb-2 flex flex-col md:flex-row items-center justify-center px-6">
  {/* Left - Content */}
  <motion.div
    className="text-black md:w-1/2 px-6 "
    initial={{ opacity: 0, x: -50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blueGray-800">
      Get in Touch with StockSphere
    </h1>
    <p className="text-lg leading-relaxed opacity-80">
      Have questions or need support? Contact us today, and we’ll be happy to help!
    </p>
    <p className="text-lg leading-relaxed opacity-80 mt-4">
      Email us at:
      <Link
        to="mailto:support@stocksphere.com"
        className="text-blueGray-500 font-semibold"
      >
        {" "}guptapriyank87@gmail.com{" "}
      </Link>
    </p>
    <p className="text-lg leading-relaxed opacity-80 mt-2">
      Call us at:{" "}
      <span className="text-blueGray-500 font-semibold">
      + 91 83193 35916
      </span>
    </p>

    <motion.div
  className="flex gap-4 mt-6"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  style={{ display: 'inline-block' }} // Ensure it's inline so that the layout doesn't shift
>
  <button
    onClick={() => setIsModalOpen(true)}
    className="bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-indigo-700 px-6 py-3 font-bold rounded-md text-sm md:text-lg shadow-lg"
  >
    CONTACT US
  </button>
</motion.div>

  </motion.div>

  {/* Right - Image */}
  <motion.div
    className="md:w-1/2 px-6 !mt-20 md:mt-0"
    initial={{ opacity: 0, x: 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
  >
    <img
      src={StockP}
      alt="Stock Market"
      className="w-full h-auto object-cover rounded-lg shadow-lg"
    />
  </motion.div>
</div>


      {/* Contact Info Cards */}

<div className="px-6 py-12 !mt-0 !mb-25 bg-gradient-to-b from-blue-50 to-white">
  <h2 className="text-3xl font-bold text-center text-blueGray-800 mb-10">
    Our Contact Info
  </h2>
  <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
    {/* Card 1 - Email & Call Combined */}
    <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
      <div className="flex justify-center gap-6 mb-4">
        <div className="w-14 h-14 rounded-full bg-lightBlue-100 flex items-center justify-center text-lightBlue-600 text-2xl">
        <i className="fas fa-comments"></i>
        </div>
        
      </div>
      <h3 className="text-xl font-semibold mb-2">Email & Call</h3>
      <p className="text-gray-600">guptapriyank87@gmail.com</p>
      <Link to="mailto:support@stocksphere.com" className="text-lightBlue-600 underline text-sm block mb-2">
        Send a Message
      </Link>
      <p className="text-gray-600">+ 91 83193 35916</p>
      <a href="tel:+18001234567" className="text-lightBlue-600 underline text-sm">
        Call Now
      </a>
    </div>

    {/* Card 2 - Address */}
    <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-lightBlue-100 flex items-center justify-center text-lightBlue-600 text-2xl">
        <i className="fas fa-map-marker-alt"></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">Our Address</h3>
      <p className="text-gray-600">First Floor, Garima Arcade, Shinde Ki Chhawani</p>
      <p className="text-gray-600">Gwalior, Madhya Pradesh (474001)</p>
    </div>

    {/* Card 3 - Office Hours */}
    <div className="bg-white shadow-xl rounded-xl p-6 text-center hover:shadow-2xl transition">
      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-lightBlue-100 flex items-center justify-center text-lightBlue-600 text-2xl">
        <i className="fas fa-clock"></i>
      </div>
      <h3 className="text-xl font-semibold mb-2">Support Hours</h3>
      <p className="text-gray-600">Mon - Fri: 9am - 6pm</p>
      <p className="text-gray-600">Sat - Sun: 10am - 4pm</p>
    </div>
  </div>
</div>


      {/* Contact Modal */}
      {isModalOpen && <ContactModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

const ContactModal = ({ onClose }) => {
  const contactValidationSchema = Yup.object().shape({
    name: Yup.string()
  .required("Name is required")
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be less than 50 characters").matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobile: Yup.string()
    .matches(/^[9876]\d{9}$/ , 'Mobile number must start with 9, 8, 7, or 6 and contain 10 digits')
    .required("Mobile number is required"),
    type: Yup.string().required("Type is required"),
    desc: Yup.string().required("Description is required").min(5, "Description must be at least 5 characters")
    .max(200, "Description must be less than 200 characters"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile: "",
      type: "General Inquiry",
      desc: "",
    },
    validationSchema: contactValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(`${BASE_API_URL}/user/contact/createContact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        if (response.ok) {
          toast.success("Your message has been sent successfully!");
          resetForm();
          onClose();
        } else {
          toast.error(data.error || "Something went wrong. Please try again.");
        }
      } catch (error) {
        toast.error("Failed to connect to the server. Please try again later.");
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
    <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
    <div
      style={{ width: "100%", maxWidth: "90%" }}
      className="relative w-full sm:mx-auto my-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-envelope text-white"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Contact Us</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
          <i className="fas fa-times text-gray-400 hover:text-gray-600"></i>
        </button>
      </div>
  
      {/* Form starts */}
      <form onSubmit={formik.handleSubmit} className="relative max-h-[80vh] flex flex-col">
  
        {/* Scrollable fields */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>
  
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 !rounded-xl border !border-gray-200 
               bg-white text-gray-900 
               focus:!border-lightBlue-600 focus:ring-2 focus:!ring-lightBlue-600/20 
               focus:outline-none transition-all duration-200"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
  
            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter your mobile number"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20 focus:outline-none transition-all duration-200"
              />
              {formik.touched.mobile && formik.errors.mobile && (
                <p className="text-red-500 text-sm">{formik.errors.mobile}</p>
              )}
            </div>
  
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
              >
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Issue</option>
                <option>Feedback</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-sm">{formik.errors.type}</p>
              )}
            </div>
            
  
            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="desc"
                placeholder="Write your query"
                value={formik.values.desc}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-600 focus:ring-2 focus:ring-lightBlue-600/20"
                rows="3"
              />
              {formik.touched.desc && formik.errors.desc && (
                <p className="text-red-500 text-sm">{formik.errors.desc}</p>
              )}
            </div>
          </div>
        </div>
  
        {/* Fixed Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end items-center space-x-4 rounded-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r bg-lightBlue-600 text-white hover:bg-lightBlue-500 focus:ring-2 focus:ring-lightBlue-600/20 transition-all duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
  
  );
};

export default ContactPage;
