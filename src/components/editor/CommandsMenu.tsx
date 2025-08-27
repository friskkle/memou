'use client'
import { useState, useEffect, useRef } from 'react'
import { slashCommands } from './CommandsList'
import { SlashMenuProps, CommandItem } from './types'

export default function SlashMenu({ 
  editor, 
  isVisible, 
  position, 
  onClose, 
  range 
}: SlashMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [filteredCommands, setFilteredCommands] = useState<CommandItem[]>(slashCommands)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && menuRef.current) {
      menuRef.current.focus()
    }
  }, [isVisible])

  useEffect(() => {
    if (searchQuery) {
      const filtered = slashCommands.filter((command: CommandItem) =>
        command.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        command.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCommands(filtered)
      setSelectedIndex(0)
    } else {
      setFilteredCommands(slashCommands)
    }
  }, [searchQuery])

  const executeCommand = (command: CommandItem): void => {
    if (command && editor && range) {
      command.command({ editor, range })
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
      default:
        // Handle typing to filter commands
        if (e.key.length === 1) {
          setSearchQuery(prev => prev + e.key)
        } else if (e.key === 'Backspace') {
          setSearchQuery(prev => prev.slice(0, -1))
        }
    }
  }

  const handleCommandClick = (command: CommandItem): void => {
    executeCommand(command)
  }

  if (!isVisible) return null

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-100 py-2 min-w-64 max-h-80 overflow-y-auto transition duration-100"
      style={{
        left: position.x,
        top: position.y,
      }}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      data-slash-menu
    >
      {searchQuery && (
        <div className="px-3 py-2 text-xs text-gray-500 border-b">
          Searching: "{searchQuery}"
        </div>
      )}
      
      {filteredCommands.length === 0 ? (
        <div className="px-3 py-2 text-gray-500 text-sm">
          No commands found
        </div>
      ) : (
        filteredCommands.map((command: CommandItem, index: number) => (
          <div
            key={command.title}
            className={`px-3 py-2 cursor-pointer flex items-center space-x-3 ${
              index === selectedIndex 
                ? 'bg-blue-50 text-blue-700' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handleCommandClick(command)}
          >
            <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium">
              {command.icon}
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">{command.title}</div>
              <div className="text-xs text-gray-500">{command.description}</div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}