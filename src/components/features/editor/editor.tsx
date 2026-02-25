"use client"

import StarterKit from "@tiptap/starter-kit"
import { SlashCommandsExtension } from './commands-list'
import { Editor, Extensions, useEditorState, useEditor, EditorContent } from '@tiptap/react'
import { useState, useEffect, useCallback } from 'react'
import SlashMenu from '@/src/components/features/editor/commands-menu'
import { MenuPosition, CommandRange } from '@/src/components/features/editor/types'
import { OptionButton, ButtonGroup } from '@/src/components/ui/EditorButton'
import styles from './EditorStyles.module.css'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCaret from '@tiptap/extension-collaboration-caret'
import { usePartyKitProvider } from '@/src/hooks/usePartyKitProvider'
import * as Y from 'yjs'
import YPartyKitProvider from 'y-partykit/provider'

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

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      }
    },
  })

  return (
    <div className="bg-white border-b border-gray-200">
      <ButtonGroup>
        <OptionButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          isActive={editorState.isBold}
        >
          Bold
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          isActive={editorState.isItalic}
        >
          Italic
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          isActive={editorState.isStrike}
        >
          Strike
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          isActive={editorState.isCode}
        >
          Code
        </OptionButton>

        <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

        <OptionButton onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </OptionButton>
        <OptionButton onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </OptionButton>

        <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

        <OptionButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editorState.isParagraph}
        >
          Paragraph
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editorState.isHeading1}
        >
          H1
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editorState.isHeading2}
        >
          H2
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editorState.isHeading3}
        >
          H3
        </OptionButton>

        <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

        <OptionButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editorState.isBulletList}
        >
          Bullet list
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editorState.isOrderedList}
        >
          Ordered list
        </OptionButton>

        <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

        <OptionButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editorState.isCodeBlock}
        >
          Code block
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editorState.isBlockquote}
        >
          Blockquote
        </OptionButton>
        <OptionButton onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </OptionButton>
        <OptionButton onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </OptionButton>

        <div className="w-px h-6 bg-gray-200 mx-2 self-center" />

        <OptionButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
        >
          Undo
        </OptionButton>
        <OptionButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
        >
          Redo
        </OptionButton>
      </ButtonGroup>
    </div>
  )
}

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
      <div className="mt-2 mb-2 bg-gray-500">
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
        <div>
          <div className="flex items-center gap-2 mt-1 mb-1">
            <div className={`h-2 w-2 rounded-full ${
              status === 'connected' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500 animate-pulse'
            }`} />
            <span className="text-xs text-gray-400">
              {status === 'connected' ? 'Synced' : status === 'error' ? 'Connection error' : 'Syncing...'}
            </span>
          </div>
          <div className="bg-white rounded-lg p-8 min-h-[300px] shadow-xl relative hover:cursor-text">
            Connecting to collaborative session...
          </div>
        </div>
      )}
    </div>
  )
}
