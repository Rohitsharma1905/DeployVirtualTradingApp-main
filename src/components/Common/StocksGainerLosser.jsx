// working ----
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNiftyData } from "../../redux/Common/nifty50Slice";
import { fetchNifty500Data } from "../../redux/Common/nifty500Slice";
import { fetchStockData } from "../../redux/Common/etfSlice";
import Loader from '../Common/Loader';
// import CardSocialTraffic from "../Admin/Cards/CardSocialTraffic";
import CardSocialTraffic from "./CardSocialTraffic";

const StocksGainerLosser = ({ showHeader = true }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Select data from all slices
  const nifty50Data = useSelector((state) => state.common.nifty50.data);
  const nifty500Data = useSelector((state) => state.common.nifty500.data);
  const etfData = useSelector((state) => state.common.etf.stockData);

  // Helper function to get top gainers and losers
  const getTopStocks = (data, count = 5, removeFirst = false) => {
    if (!Array.isArray(data) || data.length === 0) return [[], []];
    
    const filteredData = removeFirst ? data.slice(1) : [...data];
    
    const sorted = filteredData.sort((a, b) => {
      const aChange = parseFloat(a.changePercent) || 0;
      const bChange = parseFloat(b.changePercent) || 0;
      return bChange - aChange;
    });

    return [
      sorted.slice(0, count),
      sorted.slice(-count).reverse()
    ];
  };

  // Get top stocks for each category
  const [nifty50Gainers, nifty50Losers] = getTopStocks(nifty50Data, 5, true);
  const [nifty500Gainers, nifty500Losers] = getTopStocks(nifty500Data, 5, true);
  const [etfGainers, etfLosers] = getTopStocks(etfData, 5, false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await Promise.all([
          dispatch(fetchNiftyData({ page: 1, limit: 20, search: "" })),
          dispatch(fetchNifty500Data({ page: 1, limit: 20, search: "" })),
          dispatch(fetchStockData())
        ]);
        
        if (isMounted) setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError("Failed to load market data. Please try again.");
          setLoading(false);
          console.error("Market data fetch error:", err);
        }
      }
    };

    fetchAllData();
    return () => { isMounted = false; };
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mx-auto">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
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
    <div className="px-2 sm:px-4 mx-auto w-full -mt-8 sm:-mt-12">
      {/* Top Gainers Section */}
      <div className="mb-8">
        {showHeader && <h2 className="text-xl font-bold text-blueGray-700 mb-4">Top Gainers</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="Nifty 50 Gainers" 
              data={nifty50Gainers} 
              isGainer={true} 
              destination="admin/niftytable"
            />
          </div>
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="Nifty 500 Gainers" 
              data={nifty500Gainers} 
              isGainer={true} 
              destination="admin/nifty500table"
            />
          </div>
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="ETF Gainers" 
              data={etfGainers} 
              isGainer={true} 
              destination="admin/etftable"
            />
          </div>
        </div>
      </div>

      {/* Top Losers Section */}
      <div className="mt-4 sm:mt-0">
        {showHeader && <h2 className="text-xl font-bold text-blueGray-700 mb-4">Top Losers</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="Nifty 50 Losers" 
              data={nifty50Losers} 
              isGainer={false} 
              destination="admin/niftytable"
            />
          </div>
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="Nifty 500 Losers" 
              data={nifty500Losers} 
              isGainer={false} 
              destination="admin/nifty500table"
            />
          </div>
          <div className="overflow-hidden">
            <CardSocialTraffic 
              title="ETF Losers" 
              data={etfLosers} 
              isGainer={false} 
              destination="admin/etftable"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StocksGainerLosser;


// lazy loading and usememo
// import React, { useEffect, useState, useMemo, lazy, Suspense } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchNiftyData } from "../../redux/Common/nifty50Slice";
// import { fetchNifty500Data } from "../../redux/Common/nifty500Slice";
// import { fetchStockData } from "../../redux/Common/etfSlice";

// // Lazy load the CardSocialTraffic component
// const CardSocialTrafficLazy = lazy(() => import("../Admin/Cards/CardSocialTraffic"));

// const StocksGainerLosser = ({ showHeader = true }) => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Select data from all slices
//   const nifty50Data = useSelector((state) => state.common.nifty50.data);
//   const nifty500Data = useSelector((state) => state.common.nifty500.data);
//   const etfData = useSelector((state) => state.common.etf.stockData);

//   // Memoized helper function to get top gainers and losers
//   const getTopStocks = useMemo(() => {
//     return (data, count = 5, removeFirst = false) => {
//       if (!Array.isArray(data) || data.length === 0) return [[], []];
      
//       const filteredData = removeFirst ? data.slice(1) : [...data];
      
//       const sorted = filteredData.sort((a, b) => {
//         const aChange = parseFloat(a.changePercent) || 0;
//         const bChange = parseFloat(b.changePercent) || 0;
//         return bChange - aChange;
//       });

//       return [
//         sorted.slice(0, count),
//         sorted.slice(-count).reverse()
//       ];
//     };
//   }, []);

//   // Memoized top stocks calculations
//   const [nifty50Gainers, nifty50Losers] = useMemo(
//     () => getTopStocks(nifty50Data, 5, true),
//     [nifty50Data, getTopStocks]
//   );
  
//   const [nifty500Gainers, nifty500Losers] = useMemo(
//     () => getTopStocks(nifty500Data, 5, true),
//     [nifty500Data, getTopStocks]
//   );
  
//   const [etfGainers, etfLosers] = useMemo(
//     () => getTopStocks(etfData, 5, false),
//     [etfData, getTopStocks]
//   );

//   useEffect(() => {
//     let isMounted = true;
    
//     const fetchAllData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
        
//         await Promise.all([
//           dispatch(fetchNiftyData({ page: 1, limit: 20, search: "" })),
//           dispatch(fetchNifty500Data({ page: 1, limit: 20, search: "" })),
//           dispatch(fetchStockData())
//         ]);
        
//         if (isMounted) setLoading(false);
//       } catch (err) {
//         if (isMounted) {
//           setError("Failed to load market data. Please try again.");
//           setLoading(false);
//           console.error("Market data fetch error:", err);
//         }
//       }
//     };

//     fetchAllData();
//     return () => { isMounted = false; };
//   }, [dispatch]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64 mx-auto">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightBlue-600">Loading...</div>
//       </div>
//     );
//   }

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

//   // Render card with Suspense fallback
//   const renderCard = (title, data, isGainer, destination) => (
//     <Suspense fallback={<div className="w-full h-40 bg-gray-100 animate-pulse rounded"></div>}>
//       <CardSocialTrafficLazy 
//         title={title}
//         data={data}
//         isGainer={isGainer}
//         destination={destination}
//       />
//     </Suspense>
//   );

//   return (
//     <div className="px-4 mx-auto w-full -mt-12">
//       {/* Top Gainers Section */}
//       <div className="mb-8">
//         {showHeader && <h2 className="text-xl font-bold text-blueGray-700 mb-4">Top Gainers</h2>}
//         <div className="flex flex-wrap justify-between">
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("Nifty 50 Gainers", nifty50Gainers, true, "admin/niftytable")}
//           </div>
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("Nifty 500 Gainers", nifty500Gainers, true, "admin/nifty500table")}
//           </div>
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("ETF Gainers", etfGainers, true, "admin/etftable")}
//           </div>
//         </div>
//       </div>

//       {/* Top Losers Section */}
//       <div className="-mt-16">
//         {showHeader && <h2 className="text-xl font-bold text-blueGray-700 mb-4">Top Losers</h2>}
//         <div className="flex flex-wrap justify-between">
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("Nifty 50 Losers", nifty50Losers, false, "admin/niftytable")}
//           </div>
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("Nifty 500 Losers", nifty500Losers, false, "admin/nifty500table")}
//           </div>
//           <div className="w-full xl:w-4/12 px-4 mb-4">
//             {renderCard("ETF Losers", etfLosers, false, "admin/etftable")}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Memoize the entire component to prevent unnecessary re-renders
// export default React.memo(StocksGainerLosser);



// // ultra optmise version 

