// ScrollToTopLink.js
import { Link } from 'react-router-dom';
import React from 'react';
const ScrollToTopLink = ({ to, children, ...props }) => (
  <Link 
    to={to} 
    {...props}
    // onClick={() => window.scrollTo(0, 0)}
    onClick={() => window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })}
  >
    {children}
  </Link>
);

export default ScrollToTopLink;