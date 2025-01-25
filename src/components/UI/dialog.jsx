import React from "react";

// Dialog Component
export const Dialog = ({ children }: { children: React.ReactNode }) => {
  return <div className="dialog">{children}</div>;
};

// DialogContent Component
export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="dialog-content">{children}</div>;
};

// DialogHeader Component
export const DialogHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="dialog-header">{children}</div>;
};

// DialogTitle Component
export const DialogTitle = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="dialog-title">{children}</h2>;
};
