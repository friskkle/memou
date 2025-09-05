interface EditorButtonProps {
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  children: React.ReactNode
  className?: string
}

export const EditorButton = ({ 
  onClick, 
  disabled = false, 
  isActive = false,
  children,
  className = ''
}: EditorButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-2 py-1 text-sm rounded-md
        transition-colors duration-200
        ${isActive 
          ? 'bg-purple-100 text-purple-900 hover:bg-purple-200' 
          : 'hover:bg-gray-100 text-gray-700'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export const EditorButtonGroup = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-wrap gap-1 p-2">
      {children}
    </div>
  )
}
