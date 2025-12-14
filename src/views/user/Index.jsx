import React, { useEffect, useState } from "react";
import IndexNavbar from "../../components/User/Navbars/IndexNavbar";
import Footer from "../../components/User/Footers/Footer";
import { Link } from "react-router-dom";
import Stock from "../../assets/stock.jpg";

export default function Index() {
 
  return (
    <>
      <IndexNavbar fixed />

      {/* Homepage Section */}
      <div className=" min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-20">
        {/* Left - Content */}
        <div className="text-black md:w-1/2 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blueGray-800">
            Track Stock Trends in Real Time
          </h1>
          <p className="text-lg leading-relaxed opacity-80">
            Stay updated with the latest stock market trends and data with StockSphere.
            Never miss a beat with our real-time updates.
          </p>
          <div className="flex gap-4 mt-6">
            <Link to="/learn">
              <button className="bg-lightBlue-600 text-white hover:from-lightBlue-600 hover:to-indigo-700  px-6 py-3 font-bold rounded-md text-sm md:text-lg shadow-lg">
                LEARN MORE
              </button>
            </Link>
          </div>
        </div>

        {/* Right - Image */}
        <div className="md:w-1/2 px-6 mt-12 md:mt-0">
          <img
            src={Stock}
            alt="Stock Market"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <Footer />
    </>
  );
}
