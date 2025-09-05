"use client"

import { useRouter } from "next/navigation";

interface PrimaryButtonProps {
  link?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  className?: string
}

export const PrimaryButton = ({
  link,
  disabled = false,
  type = 'button',
  children,
  className = '',
}: PrimaryButtonProps) => {
    const { push } = useRouter();
  return (
    <button
      onClick={() => {push(link ?? "")}}
      disabled={disabled}
      type={type}
      className={`
        rounded-[16px]
        p-[4px]
        font-medium
        text-2xl
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
        focus:outline-none
        focus:ring-2
        focus:ring-[#D49273]
        focus:ring-offset-2
        ${className}
      `}
    >
        <div className="border-dashed border-2 order-white hover:border-transparent hover:scale-[1.02] rounded-[13px] px-8 py-5 transition-all duration-200 transform">
            {children}
        </div>
    </button>
  )
}