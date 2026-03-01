"use client"

import StarterKit from "@tiptap/starter-kit"
import { SlashCommandsExtension } from './commands-list'
import { Editor, Extensions, useEditorState, useEditor, EditorContent } from '@tiptap/react'
import { useState, useEffect, useCallback } from 'react'
import SlashMenu from '@/src/components/features/editor/commands-menu'
import { MenuPosition, CommandRange } from '@/src/components/features/editor/types'
import { MenuBar } from './menu-bar'
import styles from './EditorStyles.module.css'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { usePartyKitProvider } from '@/src/hooks/usePartyKitProvider'
import * as Y from 'yjs'
import YPartyKitProvider from 'y-partykit/provider'
import { EditorSkeleton, ListSkeleton } from "../../elements/skeletons"

export const editorExtensions: Extensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc'
      }
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal'
      }
    }
  }),
  SlashCommandsExtension
]

export const editorProps = {
  attributes: {
    class: `${styles.tiptap} focus:outline-none`
  }
} as const


// --- Collaborative Title (synced via Yjs shared text) ---
const CollaborativeTitle = ({ ydoc }: { ydoc: Y.Doc }) => {
  const [title, setTitle] = useState("")
  const yText = ydoc.getText("title")

  useEffect(() => {
    setTitle(yText.toString())
    const observer = () => {
      setTitle(yText.toString())
    }
    yText.observe(observer)
    return () => yText.unobserve(observer)
  }, [yText])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    ydoc.transact(() => {
      yText.delete(0, yText.length)
      yText.insert(0, newTitle)
    })
  }

  return (
    <input
      type="text"
      value={title}
      onChange={handleChange}
      placeholder="Untitled"
      size={Math.max(title.length - 1, 1)}
      className="font-serif font-bold text-3xl w-auto rounded hover:border-gray-400 border-transparent border-solid border-2 p-1 transition-all duration-200"
    />
  )
}

// --- Collaborative TipTap Editor (synced via Yjs + PartyKit) ---
const CollaborativeTiptapEditor = ({ provider, ydoc, userName, userColor }: {
  provider: YPartyKitProvider
  ydoc: Y.Doc
  userName: string
  userColor: string
}) => {
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const [slashRange, setSlashRange] = useState<CommandRange | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // @ts-expect-error tiptap types are not updated yet
        history: false, // Disable history for collaboration
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal'
          }
        }
      }),
      SlashCommandsExtension,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCaret.configure({
        provider,
        user: {
          name: userName,
          color: userColor,
        },
      }),
    ],
    editorProps: {
      ...editorProps,
      handleKeyDown: (view, event): boolean => {
        if (event.key === '/' && view.state.selection.empty) {
          const { from } = view.state.selection
          const coords = view.coordsAtPos(from)

          setMenuPosition({
            x: coords.left,
            y: coords.bottom + 5
          })
          setSlashRange({ from, to: from + 1 })

          setTimeout(() => {
            setShowSlashMenu(true)
          }, 10)

          return false
        }

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
      const { selection } = editor.state
      if (slashRange && (selection.from < slashRange.from || selection.from > slashRange.to + 10)) {
        setShowSlashMenu(false)
      }
    }
  })

  const focusEditor = () => {
    if (editor && !editor.isFocused) {
      const endPos = editor.state.doc.content.size
      editor.commands.focus(endPos)
    }
  }

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
    if (editor) {
      editor.commands.focus()
    }
  }, [editor])

  return (
    <>
      <div className="mt-2 mb-2 sticky top-2 z-10 w-full">
        {editor && <MenuBar editor={editor} />}
      </div>
      <div
        className="bg-white rounded-lg p-8 min-h-[300px] shadow-xl relative hover:cursor-text"
        onClick={focusEditor}
      >
        <EditorContent editor={editor} />
        <SlashMenu
          editor={editor}
          isVisible={showSlashMenu}
          position={menuPosition}
          range={slashRange}
          onClose={closeSlashMenu}
        />
      </div>
    </>
  )
}

// --- Main Collaborative Editor (entry point) ---
export const CollaborativeEditor = ({ entryId, userName }: { entryId: string, userName: string }) => {
  const { ydoc, provider, status } = usePartyKitProvider(entryId)

  // Generate a consistent color from the username
  const userColor = '#' + Math.abs(
    userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * 2654435761
  ).toString(16).slice(0, 6).padStart(6, '0')

  return (
    <div>
      {provider ? (
        <>
          <div className="flex">
            <CollaborativeTitle ydoc={ydoc} />
            <div className="flex items-center gap-2 mt-1 mb-1 ml-auto">
              <div className={`h-2 w-2 rounded-full ${
                status === 'connected' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
              }`} />
              <span className="text-xs text-gray-400">
                {status === 'connected' ? 'Synced' : status === 'error' ? 'Connection error' : 'Syncing...'}
              </span>
            </div>
          </div>
          <CollaborativeTiptapEditor
            provider={provider}
            ydoc={ydoc}
            userName={userName}
            userColor={userColor}
          />
        </>
      ) : (
        <EditorSkeleton />
      )}
    </div>
  )
}
