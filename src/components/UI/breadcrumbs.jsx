import React from 'react';

const Breadcrumb = ({ children }) => {
  return <nav aria-label="breadcrumb">{children}</nav>;
};

const BreadcrumbItem = ({ children, isCurrentPage }) => {
  return (
    <li className={`breadcrumb-item ${isCurrentPage ? 'active' : ''}`} aria-current={isCurrentPage ? 'page' : undefined}>
      {children}
    </li>
  );
};

const BreadcrumbLink = ({ href, children }) => {
  return <a href={href} className="breadcrumb-link">{children}</a>;
};

const BreadcrumbPage = ({ children }) => {
  return <span className="breadcrumb-page">{children}</span>;
};

const BreadcrumbSeparator = ({ children }) => {
  return <span className="breadcrumb-separator">{children}</span>;
};

const BreadcrumbList = ({ children }) => {
  return <ol className="breadcrumb-list">{children}</ol>;
};

const BreadcrumbEllipsis = () => {
  return <span className="breadcrumb-ellipsis">...</span>;
};

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbEllipsis,
};
