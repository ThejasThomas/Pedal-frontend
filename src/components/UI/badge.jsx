import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge = ({ children, className = "" }: BadgeProps) => {
  return (
    <span className={`badge ${className}`}>
      {children}
    </span>
  );
};
