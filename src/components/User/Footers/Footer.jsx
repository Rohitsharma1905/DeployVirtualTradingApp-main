import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-blueGray-800 pt-8 pb-6">
        <div className="bottom-auto top-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden -mt-20 h-20" style={{ transform: "translateZ(0)" }}>
          <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
            <polygon className="text-blueGray-800 fill-current" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap text-center lg:text-left">
            {/* Left Section: Keep in Touch */}
            <div className="w-full lg:w-4/12 px-4 mb-6 lg:mb-0">
              <h4 className="text-3xl font-semibold text-white">Let's Keep in Touch!</h4>
              <p className="text-lg mt-0 mb-2 text-blueGray-300">
                We're here to help and answer any questions you might have. Reach out to us via our social platforms.
              </p>
              <div className="mt-6 lg:mb-0 mb-6">
                <button className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                  <i className="fab fa-facebook-square"></i>
                </button>
                <button className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                  <i className="fab fa-dribbble"></i>
                </button>
                <button className="bg-white text-blueGray-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2">
                  <i className="fab fa-github"></i>
                </button>
              </div>
            </div>

            {/* Right Section: Quick Links */}
            <div className="w-full lg:w-4/12 px-4">
              <span className="block uppercase text-blueGray-500 text-sm font-semibold mb-2 text-white">
                Quick Links
              </span>
              <ul className="list-unstyled text-blueGray-300">
                <li>
                  <a className="text-white hover:text-blueGray-400 font-semibold block pb-2 text-sm" href="#about">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="text-white hover:text-blueGray-400 font-semibold block pb-2 text-sm" href="#services">
                    Services
                  </a>
                </li>
                <li>
                  <a className="text-white hover:text-blueGray-400 font-semibold block pb-2 text-sm" href="#contact">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="my-6 border-blueGray-300" />
          <div className="flex flex-wrap items-center md:justify-between justify-center">
            <div className="w-full md:w-4/12 px-4 mx-auto text-center">
              <div className="text-sm text-blueGray-500 font-semibold py-1">
                Copyright © {new Date().getFullYear()} All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}