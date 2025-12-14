

// import React from "react";
// import CardStats from "../../components/User/Cards/CardStats";
// import StocksGainerLosser from "../../components/Common/StocksGainerLosser";
// export default function userDashboard() {
//   return (
//     <>
//       <div className="mt-12 overflow-hidden">
//         <div className="bg-lightBlue-600 md:pt-23 pb-20 pt-10">
//           <div className="px-4 mx-auto w-full">
//             <div>
//               {/* Card stats */}
//               <div className="flex flex-wrap">
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="TRAFFIC"
//                     statTitle="350,897"
//                     statArrow="up"
//                     statPercent="3.48"
//                     statPercentColor="text-emerald-500"
//                     statDescripiron="Since last month"
//                     statIconName="far fa-chart-bar"
//                     statIconColor="bg-red-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="NEW USERS"
//                     statTitle="2,356"
//                     statArrow="down"
//                     statPercent="3.48"
//                     statPercentColor="text-red-500"
//                     statDescripiron="Since last week"
//                     statIconName="fas fa-chart-pie"
//                     statIconColor="bg-orange-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="SALES"
//                     statTitle="924"
//                     statArrow="down"
//                     statPercent="1.10"
//                     statPercentColor="text-orange-500"
//                     statDescripiron="Since yesterday"
//                     statIconName="fas fa-users"
//                     statIconColor="bg-pink-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="PERFORMANCE"
//                     statTitle="49,65%"
//                     statArrow="up"
//                     statPercent="12"
//                     statPercentColor="text-emerald-500"
//                     statDescripiron="Since last month"
//                     statIconName="fas fa-percent"
//                     statIconColor="bg-lightBlue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="px-4 mx-auto w-full">
//             <div>
//               {/* Card stats */}
//               <div className="flex flex-wrap">
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="TRAFFIC"
//                     statTitle="350,897"
//                     statArrow="up"
//                     statPercent="3.48"
//                     statPercentColor="text-emerald-500"
//                     statDescripiron="Since last month"
//                     statIconName="far fa-chart-bar"
//                     statIconColor="bg-red-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="NEW USERS"
//                     statTitle="2,356"
//                     statArrow="down"
//                     statPercent="3.48"
//                     statPercentColor="text-red-500"
//                     statDescripiron="Since last week"
//                     statIconName="fas fa-chart-pie"
//                     statIconColor="bg-orange-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="SALES"
//                     statTitle="924"
//                     statArrow="down"
//                     statPercent="1.10"
//                     statPercentColor="text-orange-500"
//                     statDescripiron="Since yesterday"
//                     statIconName="fas fa-users"
//                     statIconColor="bg-pink-500"
//                   />
//                 </div>
//                 <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
//                   <CardStats
//                     statSubtitle="PERFORMANCE"
//                     statTitle="49,65%"
//                     statArrow="up"
//                     statPercent="12"
//                     statPercentColor="text-emerald-500"
//                     statDescripiron="Since last month"
//                     statIconName="fas fa-percent"
//                     statIconColor="bg-lightBlue-500"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="px-4 mx-auto w-full -mt-12">
//         <div className="flex flex-wrap mt-12">
//         <StocksGainerLosser showHeader={false}/>
//         </div>
//         </div>
//       </div>
//     </>
//   );
// }







// adminstats rhrme 


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatsSection from "../../components/User/Cards/StatsSection";
import StocksGainerLosser from "../../components/Common/StocksGainerLosser";
import { useUserStats } from "../../hooks/userUserStats";
export default function Dashboard() {
  useUserStats();
  return (
    <div className=" overflow-hidden">
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