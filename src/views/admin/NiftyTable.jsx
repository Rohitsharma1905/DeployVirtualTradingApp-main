import React from "react";
import CardTable from "../../components/Common/CardTable";
import StatsSection from "../../components/Admin/Cards/StatsSection";

export default function NiftyTable() {
  return (
    <div className="px-4 md:px-10 mx-auto w-full -m-24"> {/* Added full width container */}
      <div className="mt-36 -mx-10 overflow-hidden">
        <StatsSection isDashboard={false} pageType="stocks" />
        <div className="flex flex-wrap ">
          <div className="w-full mb-12 px-4">
            <CardTable tableType="nifty50" />
          </div>
        </div>
      </div>
    </div>
  );
}