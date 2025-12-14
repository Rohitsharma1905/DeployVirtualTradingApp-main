// import React, { useState, useEffect } from 'react';
// import { FaArrowUp } from 'react-icons/fa';
// import { useLocation } from 'react-router-dom';

// const ScrollToTopButton = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const location = useLocation();
//   const isHomePage = location.pathname === '/';

//   useEffect(() => {
//     const handleScroll = () => {
//       if (isHomePage) {
//         // For home page with snap-scroll, we need to check the scroll container
//         const container = document.querySelector('.snap-y');
//         if (container) {
//           // Show button if we're not at the very top
//           setIsVisible(container.scrollTop > 100);
//         }
//       } else {
//         // For normal pages
//         setIsVisible(window.scrollY > 300);
//       }
//     };

//     // Use different event targets for home page vs normal pages
//     const scrollTarget = isHomePage 
//       ? document.querySelector('.snap-y')
//       : window;

//     if (scrollTarget) {
//       scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
//       // Initial check
//       handleScroll();
//     }

//     return () => {
//       if (scrollTarget) {
//         scrollTarget.removeEventListener('scroll', handleScroll);
//       }
//     };
//   }, [isHomePage, location.pathname]);

//   const scrollToTop = () => {
//     if (isHomePage) {
//       // For snap-scroll pages
//       const container = document.querySelector('.snap-y');
//       if (container) {
//         container.scrollTo({
//           top: 0,
//           behavior: 'smooth'
//         });
//       }
//       // Also scroll the first section into view
//       const firstSection = document.querySelector('.snap-start');
//       if (firstSection) {
//         firstSection.scrollIntoView({ behavior: 'smooth' });
//       }
//     } else {
//       // Normal scroll to top
//       window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//       });
//     }
//   };

//   return (
//     <button
//       onClick={scrollToTop}
//       className={`fixed bottom-6 right-6 p-3 bg-lightBlue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-lightBlue-700 focus:outline-none transform ${
//         isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
//       } z-[100]`}
//       aria-label="Scroll to top"
//     >
//       <FaArrowUp className="text-xl" />
//     </button>
//   );
// };

// export default ScrollToTopButton;

import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        // For home page with snap-scroll
        const container = document.querySelector('.snap-y');
        if (container) {
          setIsVisible(container.scrollTop > 100);
        }
      } else {
        // For normal pages
        setIsVisible(window.scrollY > 300);
      }
    };

    let scrollTarget;
    
    if (isHomePage) {
      // Wait for the container to be available
      const checkContainer = setInterval(() => {
        const container = document.querySelector('.snap-y');
        if (container) {
          clearInterval(checkContainer);
          scrollTarget = container;
          scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
          handleScroll(); // Initial check
        }
      }, 100);
    } else {
      scrollTarget = window;
      scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    return () => {
      if (scrollTarget) {
        scrollTarget.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isHomePage, location.pathname]);

  const scrollToTop = () => {
    if (isHomePage) {
      const container = document.querySelector('.snap-y');
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 bg-lightBlue-600 text-white rounded-full shadow-lg transition-all duration-300 hover:bg-lightBlue-700 focus:outline-none transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      } z-[100]`}
      aria-label="Scroll to top"
    >
      <FaArrowUp className="text-xl" />
    </button>
  );
};


export default ScrollToTopButton;