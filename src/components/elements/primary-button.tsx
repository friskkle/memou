'use client';

import { useRouter } from 'next/navigation';

interface PrimaryButtonProps {
  link?: string;
  apiLink?: string;
  action?: () => Promise<void>;
  apiBody?: Record<string, unknown>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
}

const sizeClasses = {
  small: 'p-[4px] text-md rounded-[8px]',
  medium: 'p-[4px] text-xl rounded-[16px]',
  large: 'p-[4px] rounded-[18px]',
};

const innerSizeClasses = {
  small: 'px-3 py-1 rounded-[5px]',
  medium: 'px-6 py-3 rounded-[13px]',
  large: 'px-8 py-4 rounded-[14px]',
};

export const PrimaryButton = ({
  link,
  apiLink,
  action,
  apiBody,
  disabled = false,
  type = 'button',
  size = 'medium',
  children,
  className = '',
}: PrimaryButtonProps) => {
  const handleClick = async () => {
    if (link) {
      push(link);
    } else if (apiLink) {
      try {
        const response = await fetch(apiLink, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(apiBody),
        });
        if (response.ok) {
          const data = await response.json();
          if (data.redirect_url) {
            push(data.redirect_url);
          }
        } else {
          console.error('API call failed with status:', response.status);
        }
      } catch (error) {
        console.error('Error in PrimaryButton API call:', error);
      }
    }
    else if (action) {
      console.log('Executing action');
      await action();
      console.log('Action executed')
    }
    else {
      console.log('Button clicked');
    }
  };
  const { push } = useRouter();
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type={type}
      className={`
        ${sizeClasses[size]}
        font-medium
        bg-gradient-to-b
        from-[#D49273] to-[#9A654B]
        text-white
        shadow-lg
        transition-all
        duration-200
        transform
        hover:scale-[1.02]
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:scale-100
        active:outline-none
        active:ring-2
        active:ring-[#D49273]
        active:ring-offset-2
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
