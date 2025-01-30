import React from 'react';

export const Popover = ({ open, onOpenChange, children }) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, onOpenChange })
      )}
    </div>
  );
};

export const PopoverTrigger = ({ children, onOpenChange }) => {
  return (
    <button onClick={() => onOpenChange((prev) => !prev)} className="p-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
};

export const PopoverContent = ({ open, children }) => {
  return open ? (
    <div className="absolute mt-2 p-4 border rounded shadow-md bg-white">
      {children}
    </div>
  ) : null;
};
