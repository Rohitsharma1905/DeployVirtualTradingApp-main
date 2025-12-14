import React from "react";
// import CardTable from "../../components/Common/CardTable";
import StockTable from "../../components/Common/StockTable";
import CardPageVisits from "../../components/User/Cards/CardPageVisits";
import CardSocialTraffic from "../../components/User/Cards/CardSocialTraffic";
import CardStats from "../../components/User/Cards/CardStats";
import { useSelector } from "react-redux";
import StatsSection from "../../components/User/Cards/StatsSection";

export default function etfTable() {
  const userData = useSelector((state) => state.user.auth.user);

  return (
    <>
        <StatsSection isDashboard={false} pageType="stocks" />

     <div className="flex flex-wrap -mt-1.5">
        <div className="w-full mb-12 px-4 mt-32">
          <StockTable userData={userData} />
        </div>
      </div>
    </>
  );
}