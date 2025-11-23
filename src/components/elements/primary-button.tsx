"use client";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  small: "p-[4px] text-md rounded-[8px]",
  medium: "p-[4px] text-xl rounded-[16px]",
  large: "p-[4px] rounded-[18px]",
};

const innerSizeClasses = {
  small: "px-3 py-1 rounded-[5px]",
  medium: "px-6 py-3 rounded-[13px]",
  large: "px-8 py-4 rounded-[14px]",
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  size = "medium",
  children,
  className = "",
  ...props
}: PrimaryButtonProps) => {
  return (
    <button
      {...props}
      className={`
          ${sizeClasses[size]}
          font-medium text-white
          bg-linear-to-b from-[#D49273] to-[#9A654B] shadow-lg
          transition-all duration-200 transform
          hover:scale-[1.02]
          active:scale-[0.98]
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          active:outline-none active:ring-2 active:ring-[#D49273] active:ring-offset-2
          select-none
          ${className}
        `}
    >
      <div
        className={`${innerSizeClasses[size]} border-dashed border-2 order-white hover:border-transparent hover:scale-[1.02] transition-all duration-200 transform`}
      >
        {children}
      </div>
    </button>
  );
};
