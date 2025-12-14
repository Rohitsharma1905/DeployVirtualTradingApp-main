import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "../../redux/User/userSlice";
import { fetchOrganizations } from "../../redux/Organization/auth/organizationAuthSlice";
import StockTable from "../../components/Common/StockTable";
import StatsSection from "../../components/Admin/Cards/StatsSection";

export default function ETfTable() {
return (
<div className="mt-12 overflow-hidden">
<StatsSection isDashboard={false} pageType="stocks" />


  {/* Etf Table Section */}
  <div className="flex flex-wrap ">
    <div className="w-full mb-12 px-4 mt-32">
      <StockTable />
    </div>
  </div>
</div>
);
}