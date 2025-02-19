/** @format */

import React from "react";

export const Alert = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "warning" | "success";
  className?: string;
}) => {
  const variants = {
    default: "bg-blue-50 border-blue-200 text-blue-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`border rounded-md p-4 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
export const AlertDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};
