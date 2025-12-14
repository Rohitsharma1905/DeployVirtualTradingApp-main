// // roshni code---

// import React from "react";
// import PropTypes from "prop-types";

// export default function CardStats({
//   statSubtitle = "Traffic",
//   statTitle = "350,897",
//   statArrow = "up",
//   statPercent = "3.48",
//   statPercentColor = "text-emerald-500",
//   statDescription = "Since last month",
//   statIconName = "far fa-chart-bar",
//   statIconColor = "bg-red-500",
//   statItems = [],
//   showDetails = false  
// }) {
//   return (
//     <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
//       {/* <div className="flex-auto px-8 py-6 md:px-12 md:py-6"> */}
//       <div className="flex-auto p-4">
      
//         <div className="flex flex-wrap">
//         <div className="relative w-auto pr-4 flex-initial">
//             <div
//               className={`text-white p-2 text-center inline-flex items-center justify-center w-8 h-8 shadow-lg rounded-full ${statIconColor}`}
//             >
//               <i className={statIconName}></i>
//             </div>
//           </div>
//           <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
//             <h5 className="text-blueGray-400 uppercase font-bold text-base">
//               {statSubtitle}
//             </h5>
          
//             <span className="font-semibold text-sm text-blueGray-700 flex flex-col">
//               {/* <div>
//               Total Users :  {totalUsers} 
//               </div>
//               <div>
//               Total Male :  {totalMaleUsers} 
//               </div>
//               <div>
//               Total Female :  {totalFemaleUsers} 
//               </div>
         
//               <div>
//               Total Active :  {totalActive} 
//               </div>
//               <div>

//               Total Inactive :  {totalInactive} 
//               </div>
//           */}
//           {/* working  */}
//              {/* {statItems.length > 0 && (
//               <div className="mt-2">
//                 {statItems.map((item, index) => (
//                   <div key={index} className="text-sm text-blueGray-600">
//                     <span className="font-medium">{item.label}:</span> {item.value}
//                   </div>
//                 ))}
//               </div>
//             )} */}

// {showDetails && statItems.length > 0 && (
//               <div className="mt-2">
//                 {statItems.map((item, index) => (
//                   <div key={index} className="text-sm text-blueGray-600">
//                     <span className="font-medium">{item.label}:</span> {item.value}
//                   </div>
//                 ))}
//               </div>
//             )}

         
//             </span>
//           </div>
//           {/* <div className="relative w-auto pl-4 flex-initial">
//             <div
//               className={`text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full ${statIconColor}`}
//             >
//               <i className={statIconName}></i>
//             </div>
//           </div> */}
//         </div>
//         {/* <p className="text-sm text-blueGray-400 mt-4">
//           <span className={`${statPercentColor} mr-2`}>
//             <i
//               className={
//                 statArrow === "up"
//                   ? "fas fa-arrow-up"
//                   : statArrow === "down"
//                   ? "fas fa-arrow-down"
//                   : ""
//               }
//             ></i>{" "}
//             {statPercent}%
//           </span>
//           <span className="whitespace-nowrap">{statDescription}</span>
//         </p> */}
//       </div>
//     </div>
//   );
// }

// CardStats.propTypes = {
//   statSubtitle: PropTypes.string,
//   statTitle: PropTypes.string,
//   statArrow: PropTypes.oneOf(["up", "down"]),
//   statPercent: PropTypes.string,
//   statPercentColor: PropTypes.string,
//   statDescription: PropTypes.string,
//   statIconName: PropTypes.string,
//   statIconColor: PropTypes.string,
//   statItems: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string,
//       value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//     })
//   ),
//   showDetails: PropTypes.bool  
// };




// current code - working
// import React from "react";
// import PropTypes from "prop-types";

// export default function CardStats({
//   statSubtitle = "Traffic",
//   statTitle = "350,897",
//   statArrow = "up",
//   statPercent = "3.48",
//   statPercentColor = "text-emerald-500",
//   statDescription = "Since last month",
//   statIconName = "far fa-chart-bar",
//   statIconColor = "bg-red-500",
//   statItems = [],
//   showDetails = false  
// }) {
//   return (
//     <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
//       <div className="flex-auto p-4">
//         <div className="flex flex-wrap">
//           <div className="relative w-auto pr-4 flex-initial">
//             <div
//               className={`text-white p-2 text-center inline-flex items-center justify-center w-6 h-6 shadow-lg rounded-full ${statIconColor}`}
//             >
//               <i className={statIconName}></i>
//             </div>
//           </div>
//           <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
//             <h5 className="text-blueGray-400 uppercase font-bold text-base">
//               {statSubtitle}
//             </h5>
//             <span className="font-semibold text-xl text-blueGray-700">
//               {statTitle}
//             </span>
            
//             {showDetails && statItems.length > 0 && (
//               <div className="mt-2">
//                 <div className="flex flex-row">
//                 {statItems.map((item, index) => (
//                   <div key={index} className="text-sm text-blueGray-600">
//                     <span className="list-circle font-medium">-{item.label}:</span> 
//                     <span className="list-circle font-medium">-{item.value}</span>
//                   </div>
//                 ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// CardStats.propTypes = {
//   statSubtitle: PropTypes.string,
//   statTitle: PropTypes.string,
//   statArrow: PropTypes.oneOf(["up", "down"]),
//   statPercent: PropTypes.string,
//   statPercentColor: PropTypes.string,
//   statDescription: PropTypes.string,
//   statIconName: PropTypes.string,
//   statIconColor: PropTypes.string,
//   statItems: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string,
//       value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
//     })
//   ),
//   showDetails: PropTypes.bool  
// };




// deepsekk code --- current working

import React from "react";
import PropTypes from "prop-types";

export default function CardStats({
  statSubtitle = "Traffic",
  statTitle = "350,897",
  statArrow = "up",
  statPercent = "3.48",
  statPercentColor = "text-emerald-500",
  statDescription = "Since last month",
  statIconName = "far fa-chart-bar",
  statIconColor = "bg-red-500",
  statItems = [],
  showDetails = false ,
  onClick,
  clickable = false
}) {
  return (
    // <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
    <div 
    className={`relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg ${clickable ? 'cursor-pointer hover:shadow-xl transition-shadow duration-200' : ''}`}
    onClick={onClick}
  >
      <div className="flex-auto p-4">
        <div className="flex flex-wrap">
          <div className="relative w-auto pr-4 flex-initial">
            <div
              className={`text-white p-2 text-center inline-flex items-center justify-center w-6 h-6 shadow-lg rounded-full ${statIconColor} transition-all duration-200 hover:scale-105 cursor-pointer`}
            >
              <i className={statIconName}></i>
            </div>
          </div>
          <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
            <h5 className="text-blueGray-400 uppercase font-bold text-base">
              {statSubtitle}
            </h5>
            <span className="font-semibold text-xl text-blueGray-700">
              {statTitle}
            </span>
            
            {showDetails && statItems.length > 0 && (
              <div className="mt-2" style={{ marginLeft: '-2.4rem' }}> {/* Adjust this value if needed */}
                <div className="flex flex-row flex-wrap">
                {statItems.map((item, index) => (
                  <div key={index} className="text-sm text-blueGray-600 flex items-baseline mr-4 mb-1 font-semibold">
                     <span className="mr-1 text-lg text-lightBlue-600">•</span> 
                    <span className="">{item.label}</span>
                    <span className="">: {item.value}</span>
                  </div>
                ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

CardStats.propTypes = {
  statSubtitle: PropTypes.string,
  statTitle: PropTypes.string,
  statArrow: PropTypes.oneOf(["up", "down"]),
  statPercent: PropTypes.string,
  statPercentColor: PropTypes.string,
  statDescription: PropTypes.string,
  statIconName: PropTypes.string,
  statIconColor: PropTypes.string,
  statItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  showDetails: PropTypes.bool  
};

