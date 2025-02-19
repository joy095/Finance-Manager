import React from 'react';

export const Label = ({ htmlFor, children, className = '' }: { htmlFor: string; children: React.ReactNode; className?: string }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
};