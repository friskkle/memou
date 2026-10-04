'use client';

import React from "react";
import CheckIcon from '@mui/icons-material/CheckTwoTone';
import CloseIcon from '@mui/icons-material/CloseTwoTone';

interface ApproveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({
  className = '',
  ...props
}: ApproveButtonProps) => {
  return (
    <button
      {...props}
      className={`p-1 rounded-md h-fit bg-jgreen hover:bg-jgreen-dark ${className}`}
    >
      <CheckIcon sx={{ color: "white" }} />
    </button>
  );
};

export const DeclineButton: React.FC<ApproveButtonProps> = ({
  className = '',
  ...props
}: ApproveButtonProps) => {
  return (
    <button
      {...props}
      className={`p-1 rounded-md h-fit bg-jred hover:bg-jred-dark ${className}`}
    >
      <CloseIcon sx={{ color: "white" }} />
    </button>
  );
};