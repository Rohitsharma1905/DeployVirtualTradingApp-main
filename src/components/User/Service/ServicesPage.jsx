// import React from "react";
// import { Link } from "react-router-dom";
// import IndexNavbar from "../Navbars/IndexNavbar";
// import Footer from "../Footers/Footer";

// const ServicesPage = () => {
//   return (
//     <>
//       <IndexNavbar />
//       <div className="bg-gray-100 min-h-screen pt-20">
//         <div className="container mx-auto px-4 mt-10">
//           <h1 className="text-4xl font-bold text-center text-blueGray-800 mb-10">
//             Our Stock Market Services
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Service 1 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Stock Analysis</h2>
//               <p className="text-gray-600 mt-2">
//                 Get in-depth technical and fundamental analysis of stocks before investing.
//               </p>
//             </div>

//             {/* Service 2 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Investment Strategies</h2>
//               <p className="text-gray-600 mt-2">
//                 We provide tailored investment plans to maximize your returns safely.
//               </p>
//             </div>

//             {/* Service 3 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Portfolio Management</h2>
//               <p className="text-gray-600 mt-2">
//                 Manage and optimize your stock portfolio for better performance.
//               </p>
//             </div>

//             {/* Service 4 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Live Market Updates</h2>
//               <p className="text-gray-600 mt-2">
//                 Stay updated with real-time stock market movements and news.
//               </p>
//             </div>

//             {/* Service 5 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Trading Signals</h2>
//               <p className="text-gray-600 mt-2">
//                 Receive AI-powered trading signals for better decision-making.
//               </p>
//             </div>

//             {/* Service 6 */}
//             <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
//               <h2 className="text-2xl font-semibold text-blueGray-800">Stock Market Education</h2>
//               <p className="text-gray-600 mt-2">
//                 Learn the basics and advanced strategies of stock trading.
//               </p>
//             </div>
//           </div>

//           <div className="text-center mt-10">
//             <Link
//               to="/contact"
//               className="bg-blueGray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition duration-300"
//             >
//               Contact Us
//             </Link>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default ServicesPage;
import React from "react";
import { Link } from "react-router-dom";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";

const ServicesPage = () => {
  return (
    <>
      <IndexNavbar />
      <div className="bg-gray-100 min-h-screen pt-20">
        <div className="container mx-auto px-4 mt-10">
          <h1 className="text-4xl font-bold text-center text-blueGray-800 mb-10">
            Our Stock Market Services
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Stock Analysis</h2>
              <p className="text-gray-600 mt-2">
                Get in-depth technical and fundamental analysis of stocks before investing.
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Investment Strategies</h2>
              <p className="text-gray-600 mt-2">
                We provide tailored investment plans to maximize your returns safely.
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Portfolio Management</h2>
              <p className="text-gray-600 mt-2">
                Manage and optimize your stock portfolio for better performance.
              </p>
            </div>

            {/* Service 4 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Live Market Updates</h2>
              <p className="text-gray-600 mt-2">
                Stay updated with real-time stock market movements and news.
              </p>
            </div>

            {/* Service 5 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Trading Signals</h2>
              <p className="text-gray-600 mt-2">
                Receive AI-powered trading signals for better decision-making.
              </p>
            </div>

            {/* Service 6 */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
              <h2 className="text-2xl font-semibold text-blueGray-800">Stock Market Education</h2>
              <p className="text-gray-600 mt-2">
                Learn the basics and advanced strategies of stock trading.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/contact"
              className="bg-blueGray-800 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-800 transition duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServicesPage;
