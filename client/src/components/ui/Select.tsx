/** @format */

import React from "react";

export const Select = ({
  children,
  name,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </div>
    </div>
  );
};
export const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return <option value={value}>{children}</option>;
};
export const SelectTrigger = ({ children }: { children: React.ReactNode }) =>
  children;
export const SelectContent = ({ children }: { children: React.ReactNode }) =>
  children;
export const SelectValue = ({ placeholder }: { placeholder: string }) =>
  placeholder;
