

import React from "react";

export default function FooterAdmin() {
  return (
    <footer className="footer block py-4">
      <div className="container mx-auto">
        <hr className="mb-4 border-b-1 border-blueGray-200" />
        <div className="flex items-center justify-center">
          <div className="w-full">
            <div className="text-[0.8rem] text-blueGray-500 font-semibold py-1 text-center">
            © 2025 Praedico Global Research Pvt Ltd. All rights reserved.
              
              {/* <a
                href="https://www.creative-tim.com?ref=nr-footer-admin"
                className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
              >
                Creative Tim
              </a> */}
            </div>
          </div>
          {/* <div className="w-full md:w-8/12 px-4">
            <ul className="flex flex-wrap list-none md:justify-end justify-center">
              <li>
                <a
                  href="https://www.creative-tim.com?ref=nr-footer-admin"
                  className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                >
                  Creative Tim
                </a>
              </li>
              <li>
                <a
                  href="https://www.creative-tim.com/presentation?ref=nr-footer-admin"
                  className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="http://blog.creative-tim.com?ref=nr-footer-admin"
                  className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/creativetimofficial/notus-react/blob/main/LICENSE.md?ref=nr-footer-admin"
                  className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                >
                  MIT License
                </a>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </footer>
  );
}