// views/user/niftyTable.jsx
import React from "react";
import { useSelector } from 'react-redux';
import CardTable from "../../components/Common/CardTable";
import CardStats from "../../components/User/Cards/CardStats";
import StatsSection from "../../components/User/Cards/StatsSection";

const NiftyTable = () => {
  // Get user data from Redux store
  const userData = useSelector((state) => state.user.auth.user);

  return (
    <>
      {/* <div className="mt-12 overflow-hidden">
        <div className="bg-lightBlue-600 md:pt-23 pb-20 pt-10">
          <div className="px-4 mx-auto w-full">
            <div>
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                  <CardStats
                    statSubtitle="TRAFFIC"
                    statTitle="350,897"
                    statArrow="up"
                    statPercent="3.48"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
                    statIconName="far fa-chart-bar"
                    statIconColor="bg-red-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                  <CardStats
                    statSubtitle="NEW USERS"
                    statTitle="2,356"
                    statArrow="down"
                    statPercent="3.48"
                    statPercentColor="text-red-500"
                    statDescripiron="Since last week"
                    statIconName="fas fa-chart-pie"
                    statIconColor="bg-orange-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                  <CardStats
                    statSubtitle="SALES"
                    statTitle="924"
                    statArrow="down"
                    statPercent="1.10"
                    statPercentColor="text-orange-500"
                    statDescripiron="Since yesterday"
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-3/12 px-4 mb-4">
                  <CardStats
                    statSubtitle="PERFORMANCE"
                    statTitle="49,65%"
                    statArrow="up"
                    statPercent="12"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
                    statIconName="fas fa-percent"
                    statIconColor="bg-lightBlue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
        <StatsSection isDashboard={false} pageType="stocks" />
      

      <div className="flex flex-wrap -mt-7">
        <div className="w-full mb-12 px-4 mt-8">

          <CardTable tableType="nifty500" userData={userData} />
        </div>
      </div>
    </>
  );
};

export default NiftyTable;