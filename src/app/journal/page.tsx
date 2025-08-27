'use client'

import React from 'react'
import { useEditor, EditorContent } from "@tiptap/react"
import { useState, useEffect, useCallback } from 'react'
import SlashMenu from '@/src/components/editor/CommandsMenu'
import { editorExtensions, editorProps, initialContent } from '@/src/components/editor/editor'
import { MenuPosition, CommandRange } from '@/src/components/editor/types'

export default function Journal(): React.ReactElement {
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const [slashRange, setSlashRange] = useState<CommandRange | null>(null)

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    editorProps: {
      ...editorProps,
      handleKeyDown: (view, event): boolean => {
        // Handle slash command trigger
        if (event.key === '/' && view.state.selection.empty) {
          const { from } = view.state.selection
          const coords = view.coordsAtPos(from)
          
          setMenuPosition({
            x: coords.left,
            y: coords.bottom + 5
          })
          setSlashRange({ from, to: from + 1 })
          
          // Small delay to ensure the '/' character is inserted first
          setTimeout(() => {
            setShowSlashMenu(true)
          }, 10)
          
          return false // Allow the '/' to be typed
        }
        
        // Hide menu on other keystrokes
        if (showSlashMenu && event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter') {
          if (event.key === 'Escape') {
            setShowSlashMenu(false)
            return true
          }
        }
        
        return false
      }
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      // Hide slash menu if selection changes or content changes significantly
      const { selection } = editor.state
      if (slashRange && (selection.from < slashRange.from || selection.from > slashRange.to + 10)) {
        setShowSlashMenu(false)
      }
    }
  })

  // Handle clicks outside the slash menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element
      if (showSlashMenu && !target.closest('[data-slash-menu]')) {
        setShowSlashMenu(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showSlashMenu])

  const closeSlashMenu = useCallback((): void => {
    setShowSlashMenu(false)
    setSlashRange(null)
    // Return focus to editor
    if (editor) {
      editor.commands.focus()
    }
  }, [editor])

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <h1 className="font-serif text-3xl mb-6">Journal</h1>
      <div className="bg-cream-100 border-gray-100 border-2 rounded-lg p-8 min-h-[400px] shadow-xl relative">
        <EditorContent editor={editor} />
        
        <SlashMenu
          editor={editor}
          isVisible={showSlashMenu}
          position={menuPosition}
          range={slashRange}
          onClose={closeSlashMenu}
        />
      </div>
      
      {/* Helper text */}
      <p className="text-sm text-gray-600 mt-4">
        💡 Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to open formatting options
      </p>
    </div>
  )
}