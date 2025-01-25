import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


export const Label = ({ children, className, ...props }) => {
  return (
    <span
      className={classNames(
        'text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

Label.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default { Label };
