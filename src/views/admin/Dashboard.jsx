import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNiftyData } from "../../redux/Common/nifty50Slice";
import { fetchNifty500Data } from "../../redux/Common/nifty500Slice";
import { fetchStockData } from "../../redux/Common/etfSlice";
import StatsSection from "../../components/Admin/Cards/StatsSection";
import CardSocialTraffic from "../../components/Admin/Cards/CardSocialTraffic";
import StocksGainerLosser from "../../components/Common/StocksGainerLosser";
import Loader from '../../components/Common/Loader';
export default function Dashboard() {
  return (
    <div className="mt-12 overflow-hidden">
      <StatsSection isDashboard={true} pageType="dashboard" />
      <div className="px-4 mx-auto w-full -mt-12">
        {/* Top Gainers Section */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between mt-12">
          <StocksGainerLosser  showHeader={false}/>
          </div>
        </div>

      </div>
    </div>
  );
}