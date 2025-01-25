import React from "react";
import PropTypes from "prop-types";
import classNames from 'classnames';

export const Card = ({ children, className, onClick }) => {
  return (
    <div onClick={onClick} className={`border rounded-lg shadow-sm p-4 bg-white ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  );
};

// Proptypes for validation
Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'p-4 border-b border-gray-200 bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h2
      className={classNames(
        'text-lg font-semibold text-gray-900',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};


