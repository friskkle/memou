"use client"

import StarterKit from "@tiptap/starter-kit"
import { SlashCommandsExtension } from './commands-list'
import { Editor, Extensions, useEditorState, useEditor, EditorContent } from '@tiptap/react'
import { useState, useEffect, useCallback, useRef } from 'react'
import SlashMenu from '@/src/components/features/editor/commands-menu'
import { MenuPosition, CommandRange } from '@/src/components/features/editor/types'
import { OptionButton, ButtonGroup } from '@/src/components/ui/EditorButton'
import styles from './EditorStyles.module.css'

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

export const TextEditor = ({ title, initialContent, saveEntry }: { title: string, initialContent: string, saveEntry: (newTitle: string, newContent: string) => Promise<void> }) => {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null)

  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false)
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({ x: 0, y: 0 })
  const [slashRange, setSlashRange] = useState<CommandRange | null>(null)
  const [saved, setSaved] = useState<string>('Saved')
  const [curTitle, setCurTitle] = useState<string>(title)

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

      // Clear any timeouts and set a new one to save content after 3 seconds of inactivity
      setSaved('Saving...')
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current)
      }

      saveTimeout.current = setTimeout(() => {
        const html = editor.getHTML()
        saveEntry(curTitle, html)
        setSaved('Saved')
      }, 3000)
    }
  })

  const focusEditor = () => {
    if (editor && !editor.isFocused) {
      const endPos = editor.state.doc.content.size
      editor.commands.focus(endPos)
    }
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setCurTitle(e.target.value)
  }

  const handleUpdate = (): void => {
    saveEntry(curTitle, editor ? editor.getHTML() : '')
  }

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
    <div>
      <input
        type="text"
        size={Math.max(curTitle.length - 1, 1)}
        value={curTitle}
        onChange={handleChangeInput}
        onBlur={handleUpdate}
        className="font-serif font-bold text-3xl w-auto rounded hover:border-gray-400 border-transparent border-solid border-2 p-1 transition-all duration-200"
      />
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
        <div className="absolute bottom-2 right-4 text-sm text-gray-400 select-none">{saved}</div>
      </div>
    </div>
  )
}
