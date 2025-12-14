








// new one latest deepseek--

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchOrganizationDashboardData, resetDashboardState } from '../../../redux/Organization/dashboard/organizationDashboardSlice';
// import { fetchNiftyData } from "../../../redux/Common/nifty50Slice";
// import { fetchNifty500Data } from "../../../redux/Common/nifty500Slice";
// import { fetchStockData } from "../../../redux/Common/etfSlice";
// import StatsSection from '../../Organization/Cards/StatsSection';
// import CardSocialTraffic from '../../Organization/Cards/CardSocialTraffic';
// import StocksGainerLosser from '../../../components/Common/StocksGainerLosser';
// import Loader from '../../Common/Loader';

// export default function OrganizationDashboard({ type, showAllCards, showCardsTable }) {
//   const dispatch = useDispatch();
//   const orgName = localStorage.getItem('orgName');
  
//   const {
//     loading,
//     error
//   } = useSelector((state) => state.organization.dashboard);

//   // Fetch all data
//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         // Fetch organization data
//         if (orgName) {
//           await dispatch(fetchOrganizationDashboardData(orgName));
//         }

//         // Fetch market data in parallel
//         await Promise.all([
//           dispatch(fetchNiftyData({ page: 1, limit: 20, search: "" })),
//           dispatch(fetchNifty500Data({ page: 1, limit: 20, search: "" })),
//           dispatch(fetchStockData())
//         ]);
//       } catch (err) {
//         console.error("Dashboard data fetch error:", err);
//       }
//     };

//     fetchAllData();

//     return () => {
//       dispatch(resetDashboardState());
//     };
//   }, [dispatch, orgName]);

//   // Loading state
//   if (loading) {
//     return ( <div className='my-40 mx-auto'>
// <Loader />
//     </div> );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="text-center py-8 text-red-500">
//         {error}
//         <button 
//           onClick={() => window.location.reload()} 
//           className="ml-2 bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className='mt-18'>  
//       {/* Dashboard header */}
//       <div>
//         <StatsSection isDashboard={true} pageType="dashboard" />
//       </div>

//       {/* Market Data Section */}
//       {showCardsTable && (
//         <div className="px-4 mx-auto w-full -mt-12">
//           {/* Top Gainers Section */}
//           <div className="mb-8">
//             <div className="flex flex-wrap justify-between mt-12">
//               <StocksGainerLosser showHeader={false} />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }





import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  fetchOrganizationDashboardData,
  resetDashboardState 
} from '../../../redux/Organization/dashboard/organizationDashboardSlice';
import { fetchStockData } from "../../../redux/Common/etfSlice";
import StatsSection from '../../Organization/Cards/StatsSection';
import StocksGainerLosser from '../../../components/Common/StocksGainerLosser';
import Loader from '../../Common/Loader';

export default function OrganizationDashboard({ type, showAllCards, showCardsTable }) {
  const dispatch = useDispatch();
  const orgName = localStorage.getItem('orgName');
  
  // Custom loading state
  const [loadingState, setLoadingState] = useState({
    statsLoading: true,
    stocksLoading: true,
    error: null
  });

  // Fetch all data in parallel
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoadingState({
          statsLoading: true,
          stocksLoading: true,
          error: null
        });

        await Promise.all([
          dispatch(fetchOrganizationDashboardData(orgName))
            .then(() => {
              setLoadingState(prev => ({ ...prev, statsLoading: false }));
            }),
          dispatch(fetchStockData())
            .then(() => {
              setLoadingState(prev => ({ ...prev, stocksLoading: false }));
            })
        ]);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setLoadingState({
          statsLoading: false,
          stocksLoading: false,
          error: err.message || "Failed to fetch dashboard data"
        });
      }
    };

    if (orgName) {
      fetchAllData();
    }

    return () => {
      dispatch(resetDashboardState());
    };
  }, [dispatch, orgName]);

  // Error state
  if (loadingState.error) {
    return (
      <div className="text-center py-8 text-red-500">
        {loadingState.error}
        <button 
          onClick={() => window.location.reload()} 
          className="ml-2 bg-lightBlue-600 text-white px-4 py-2 rounded hover:bg-lightBlue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className='mt-18'>
      {/* Stats Section with its own loader */}
      <div>
        {loadingState.statsLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader message="Loading dashboard statistics..." />
          </div>
        ) : (
          <StatsSection isDashboard={true} pageType="dashboard" />
        )}
      </div>

      {/* Stocks Section with its own loader */}
      {showCardsTable && (
        <div className="px-4 mx-auto w-full -mt-12">
          <div className="mb-8">
            <div className="flex flex-wrap justify-between mt-12">
              {loadingState.stocksLoading ? (
                <div className="flex justify-center items-center h-64 w-full">
                  <Loader message="Loading stock data..." />
                </div>
              ) : (
                <StocksGainerLosser showHeader={false} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}