import React from "react";
import IndexNavbar from "../Navbars/IndexNavbar";
import Footer from "../Footers/Footer";
import StockMarket from "../../../assets/stock-market.jpg"
const AboutHero = () => {
  return (
    <>
      <IndexNavbar />

      {/* About Us hell Section */}
      <div className=" min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-20">
        {/* Left - Content */}
        <div className="text-black md:w-1/2 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blueGray-800">
            About Us
          </h1>
          <p className="text-lg leading-relaxed opacity-80">
            This project was created to empower individuals to make informed
            investment decisions and navigate the complexities of the stock
            market with confidence.
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-4">
            Our mission is to democratize access to financial information and
            provide tools and resources that enable investors of all levels to
            succeed in their financial goals.
          </p>
          <p className="text-lg leading-relaxed opacity-80 mt-4">
            This project offers <span className="text-blueGray-500 font-semibold">Comprehensive Market Analysis</span>,{" "}
            <span className="text-blueGray-500 font-semibold">Educational Resources</span>,{" "}
            <span className="text-blueGray-500 font-semibold">Powerful Tools</span>, and{" "}
            <span className="text-blueGray-500 font-semibold">Community Support</span>.
          </p>
        </div>

        {/* Right - Image */}
        <div className="md:w-1/2 px-6 mt-12 md:mt-0">
          <img
            src={StockMarket}
            alt="Stock Market"
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AboutHero;
