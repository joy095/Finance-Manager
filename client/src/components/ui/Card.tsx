/** @format */

import React from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
};
