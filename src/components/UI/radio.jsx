import React from 'react';
import classNames from 'classnames';

/**
 * A group of radio buttons allowing the user to select one option.
 */
export const RadioGroup = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames('flex flex-col space-y-2', className)}
      role="radiogroup"
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * A single radio button item.
 */
export const RadioGroupItem = ({ label, id, className, ...props }) => {
  return (
    <div className={classNames('flex items-center space-x-2', className)}>
      <input
        type="radio"
        id={id}
        className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out border-gray-300 focus:ring focus:ring-offset-0 focus:ring-blue-500"
        {...props}
      />
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-900">
          {label}
        </label>
      )}
    </div>
  );
};
