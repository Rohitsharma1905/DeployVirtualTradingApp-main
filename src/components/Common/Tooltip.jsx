// import React from 'react';
// import PropTypes from 'prop-types';

// const Tooltip = ({ title, children, showTooltip }) => (
//   <div className="relative flex items-center group">
//     {children}
//     {showTooltip && (
//       <div className="absolute bottom-full transform -translate-x-1/2 whitespace-no-wrap bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//         {title}
//         <div className="absolute w-2 bg-gray-800 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
//       </div>
//     )}
//   </div>
// );

// Tooltip.propTypes = {
//   title: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   showTooltip: PropTypes.bool.isRequired,
// };

// export default Tooltip;

import React from "react";
import PropTypes from "prop-types";

const Tooltip = ({ title, children, isVisible }) => (
  <div className="relative flex items-center group">
    {children}
    {isVisible && (
      <div className="absolute bottom-full transform -translate-x-1/2 whitespace-no-wrap bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title}
        <div className="absolute w-2 bg-gray-800 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
      </div>
    )}
  </div>
);

Tooltip.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

export default Tooltip;