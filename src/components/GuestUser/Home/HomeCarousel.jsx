import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import img1 from "../../../assets/GuestUserPageTradingImages/tradingImg1.jpg";
import img3 from "../../../assets/GuestUserPageTradingImages/tradingImg3.jpg";
import img4 from "../../../assets/GuestUserPageTradingImages/tradingImg4.jpg";

const HomeCarousel = () => {
  const slides = [
    { id: 1, image: img1, title: "Stock Market Insights" },
    { id: 3, image: img3, title: "Forex Trading Tips" },
    { id: 4, image: img4, title: "Market Analysis" },
  ];

  return (
    <div className="w-full mx-auto p-4 sm:mt-18">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="rounded-xl overflow-hidden shadow-2xl"
      >
        <style>
          {`
            .swiper-button-next, .swiper-button-prev {
              color: rgba(180, 180, 180, 0.8) !important;
              background-color: rgba(0, 0, 0, 0.3);
              width: 40px !important;
              height: 40px !important;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.3s ease;
            }
            
            .swiper-button-next:hover, .swiper-button-prev:hover {
              color: rgba(255, 255, 255, 0.9) !important;
              background-color: rgba(0, 0, 0, 0.5);
            }
            
            .swiper-button-next:after, .swiper-button-prev:after {
              font-size: 18px !important;
              font-weight: bold;
            }
            
            .swiper-pagination-bullet {
              width: 10px;
              height: 10px;
              background-color: rgba(255, 255, 255, 0.7);
              opacity: 0.7;
              transition: all 0.3s ease;
            }
            
            .swiper-pagination-bullet-active {
              background-color: white;
              opacity: 1;
              width: 12px;
              height: 12px;
            }
          `}
        </style>
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              style={{ width: "100%", height: "400px", position: "relative" }}
              className="overflow-hidden"
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  transform: "scale(1.02)" // Slight zoom for better appearance
                }}
                className="transition-transform duration-300 hover:scale-105"
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  padding: "30px",
                }}
                className="transition-opacity duration-300"
              >
                <div className="text-container">
                  <h3 
                    className="text-white text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      letterSpacing: "0.5px"
                    }}
                  >
                    {slide.title}
                  </h3>
                  <div 
                    className="w-20 h-1 bg-lightBlue-600 rounded-full mb-4"
                    style={{ boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
                  ></div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeCarousel;