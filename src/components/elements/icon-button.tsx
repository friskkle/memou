'use client';

import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  className = '',
  children,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      className={`rounded-md w-fit h-fit hover:bg-gray-100 ${className}`}
    >
      {children}
    </button>
  );
};