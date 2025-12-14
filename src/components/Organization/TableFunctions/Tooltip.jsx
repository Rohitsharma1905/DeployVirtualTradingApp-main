import React from 'react';
import PropTypes from 'prop-types';

const Tooltip = ({ title, children }) => (
  <div className="relative flex items-center group">
    {children}
    <div className="absolute hidden group-hover:block top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white rounded-md shadow-md text-sm whitespace-nowrap">
      {title}
    </div>
  </div>
);

Tooltip.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;