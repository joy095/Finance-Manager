/** @format */

import React from "react";

export const Button = ({
  children,
  type = "button",
  className = "",
  variant = "primary",
  disabled = false,
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary" | "danger" | "link";
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    link: "bg-transparent text-blue-600 hover:underline p-0",
  };

  return (
    <button
      type={type}
      className={`px-4 py-2 rounded font-medium transition-colors ${
        variants[variant]
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
