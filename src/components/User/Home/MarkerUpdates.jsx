import React from "react";
import Table from "../Cards/CardTable.jsx"; // Ensure the import path is correct
import { Link } from "react-router-dom";

const MarketUpdates = ({ isAuthenticated }) => {
  return (
    <div className="container mx-auto items-center flex flex-wrap pt-32">
      <div className="w-full px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-bold">
            Stay ahead of the curve
          </h1>
          <p className="my-7 text-sm md:text-lg lg:text-xl">
            StockSphere is the fastest way to track the stock market and trends
            that matter to you.
          </p>

          {/* Buttons for navigation */}
          <div className="flex justify-center gap-5 mb-8">
            <Link to="/learn">
              <button className="ml-10 bg-gray-300 text-black text-sm px-4 py-3 font-bold rounded-md">
                LEARN MORE
              </button>
            </Link>
            <Link to="/crypto-tracker">
              <button className="text-gray-100 border border-gray-500 text-sm px-4 py-3 font-bold rounded-md">
                CRYPTO TRACKER
              </button>
            </Link>
          </div>

          {/* Show the Table only if the user is logged in */}
          {isAuthenticated ? (
            <div className="mt-8">
              <Table color="light" />
            </div>
          ) : (
            <p className="text-red-500 text-lg mt-4">
              Please log in to view Nifty Data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketUpdates;