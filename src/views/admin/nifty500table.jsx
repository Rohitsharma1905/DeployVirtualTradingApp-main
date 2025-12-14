import React from "react";
import CardTable from "../../components/Common/CardTable";
import StatsSection from "../../components/Admin/Cards/StatsSection";

export default function Nifty500Table() {
  return (
    <div className="mt-12 overflow-hidden">
      <StatsSection isDashboard={false} pageType="stocks" />
      <div className="flex flex-wrap ">
        <div className="w-full mb-12 px-4 ">
          <CardTable tableType="nifty500" />
        </div>
      </div>
    </div>
  );
}