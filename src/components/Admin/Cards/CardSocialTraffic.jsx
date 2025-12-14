// import React from "react";

// // components

// export default function CardSocialTraffic() {
//   return (
//     <>
//       <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
//         <div className="rounded-t mb-0 px-4 py-3 border-0">
//           <div className="flex flex-wrap items-center">
//             <div className="relative w-full px-4 max-w-full flex-grow flex-1">
//               <h3 className="font-semibold text-base text-blueGray-700">
//                 Social traffic
//               </h3>
//             </div>
//             <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
//               <button
//                 className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
//                 type="button"
//               >
//                 See all
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="block w-full overflow-x-auto">
//           {/* Projects table */}
//           <table className="items-center w-full bg-transparent border-collapse">
//             <thead className="thead-light">
//               <tr>
//                 <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                   Referral
//                 </th>
//                 <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
//                   Visitors
//                 </th>
//                 <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px"></th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
//                   Facebook
//                 </th>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   1,480
//                 </td>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   <div className="flex items-center">
//                     <span className="mr-2">60%</span>
//                     <div className="relative w-full">
//                       <div className="overflow-hidden h-2 text-xs flex rounded bg-red-200">
//                         <div
//                           style={{ width: "60%" }}
//                           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
//                   Facebook
//                 </th>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   5,480
//                 </td>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   <div className="flex items-center">
//                     <span className="mr-2">70%</span>
//                     <div className="relative w-full">
//                       <div className="overflow-hidden h-2 text-xs flex rounded bg-emerald-200">
//                         <div
//                           style={{ width: "70%" }}
//                           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
//                   Google
//                 </th>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   4,807
//                 </td>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   <div className="flex items-center">
//                     <span className="mr-2">80%</span>
//                     <div className="relative w-full">
//                       <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
//                         <div
//                           style={{ width: "80%" }}
//                           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
//                   Instagram
//                 </th>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   3,678
//                 </td>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   <div className="flex items-center">
//                     <span className="mr-2">75%</span>
//                     <div className="relative w-full">
//                       <div className="overflow-hidden h-2 text-xs flex rounded bg-lightBlue-200">
//                         <div
//                           style={{ width: "75%" }}
//                           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-lightBlue-500"
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//               <tr>
//                 <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
//                   twitter
//                 </th>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   2,645
//                 </td>
//                 <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
//                   <div className="flex items-center">
//                     <span className="mr-2">30%</span>
//                     <div className="relative w-full">
//                       <div className="overflow-hidden h-2 text-xs flex rounded bg-orange-200">
//                         <div
//                           style={{ width: "30%" }}
//                           className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// }


import React from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/solid";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function CardSocialTraffic({ title, data, isGainer, destination }) {
  const navigate = useNavigate();
  // Determine color based on gainer/loser
  const textColor = isGainer ? "text-green-500" : "text-red-500";
  const bgColor = isGainer ? "bg-green-500" : "bg-red-500";
  const progressBg = isGainer ? "bg-green-200" : "bg-red-200";

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleClick = () => {
    // Use absolute path starting with '/'
    navigate(`/${destination}`);
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded cursor-pointer" onClick={handleClick}>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                {title}
              </h3>
            </div>
            {/* <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <span className="text-xs text-blueGray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div> */}
              <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              <div className="flex flex-col items-end">
                <span className="text-xs text-blueGray-500">
                  {formattedDate}
                </span>
                <span className="text-xs text-blueGray-400">
                  {formattedTime}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead className="thead-light">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Company
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Change %
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left min-w-140-px">
                 30 Day Change
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((stock, index) => (
                <tr key={index}>
                  <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left font-medium">
                    {stock.symbol || stock.companyName || "N/A"}
                  </th>
                  <td className={`border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 ${textColor}`}>
                    <div className="flex items-center">
                      {isGainer ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                      )}
                      {stock.pChange + "%" || "N/A"}
                    </div>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <div className="flex items-center">
                      <span className="mr-2">{stock.perChange30d || "N/A"}%</span>
                      <div className="relative w-full">
                        <div className={`overflow-hidden h-2 text-xs flex rounded ${progressBg}`}>
                          <div
                            style={{ width: `${Math.min(Math.abs(stock. perChange30d || 0), 100)}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${bgColor}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}