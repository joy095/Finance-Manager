import React from 'react';

export const Input = ({ 
  id,
  name,
  type = 'text',
  className = '',
  value,
  onChange,
  required = false,
  placeholder = '',
  step
}: {
  id: string;
  name: string;
  type?: string;
  className?: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  step?: string | number;
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      step={step}
    />
  );
};