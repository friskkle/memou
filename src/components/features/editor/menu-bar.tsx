import { Editor } from '@tiptap/react'
import { useEditorState } from '@tiptap/react'
import { OptionButton, ButtonGroup } from '@/src/components/ui/EditorButton'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS'
import CodeIcon from '@mui/icons-material/Code'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import TerminalIcon from '@mui/icons-material/Terminal'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import WrapTextIcon from '@mui/icons-material/WrapText'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'

// Divider component
const Divider = () => <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

export function MenuBar({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor.isActive('bold'),
      canBold: ctx.editor.can().chain().toggleBold().run(),
      isItalic: ctx.editor.isActive('italic'),
      canItalic: ctx.editor.can().chain().toggleItalic().run(),
      isStrike: ctx.editor.isActive('strike'),
      canStrike: ctx.editor.can().chain().toggleStrike().run(),
      isCode: ctx.editor.isActive('code'),
      canCode: ctx.editor.can().chain().toggleCode().run(),
      isParagraph: ctx.editor.isActive('paragraph'),
      isHeading1: ctx.editor.isActive('heading', { level: 1 }),
      isHeading2: ctx.editor.isActive('heading', { level: 2 }),
      isHeading3: ctx.editor.isActive('heading', { level: 3 }),
      isBulletList: ctx.editor.isActive('bulletList'),
      isOrderedList: ctx.editor.isActive('orderedList'),
      isCodeBlock: ctx.editor.isActive('codeBlock'),
      isBlockquote: ctx.editor.isActive('blockquote'),
      canUndo: ctx.editor.can().chain().undo().run(),
      canRedo: ctx.editor.can().chain().redo().run(),
    }),
  })

  // Avoid crash during initial render
  if (!editor || !editorState) {
    return null
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden transition-all duration-200 sticky top-0 z-10 p-1 w-full flex items-center flex-wrap gap-1">
      <OptionButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editorState.canBold}
        isActive={editorState.isBold}
        title="Bold"
      >
        <FormatBoldIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editorState.canItalic}
        isActive={editorState.isItalic}
        title="Italic"
      >
        <FormatItalicIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editorState.canStrike}
        isActive={editorState.isStrike}
        title="Strikethrough"
      >
        <StrikethroughSIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editorState.canCode}
        isActive={editorState.isCode}
        title="Inline Code"
      >
        <CodeIcon fontSize="small" />
      </OptionButton>
      
      <Divider />

      <OptionButton 
        onClick={() => editor.chain().focus().unsetAllMarks().run()} 
        title="Clear Marks"
      >
        <FormatClearIcon fontSize="small" />
      </OptionButton>

      <Divider />

      <OptionButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editorState.isParagraph}
        className="font-medium px-3"
      >
        P
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editorState.isHeading1}
        className="font-bold px-3"
      >
        H1
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editorState.isHeading2}
        className="font-semibold px-3"
      >
        H2
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editorState.isHeading3}
        className="font-medium px-3 text-sm"
      >
        H3
      </OptionButton>

      <Divider />

      <OptionButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editorState.isBulletList}
        title="Bullet List"
      >
        <FormatListBulletedIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editorState.isOrderedList}
        title="Ordered List"
      >
        <FormatListNumberedIcon fontSize="small" />
      </OptionButton>

      <Divider />

      <OptionButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editorState.isCodeBlock}
        title="Code Block"
      >
        <TerminalIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editorState.isBlockquote}
        title="Blockquote"
      >
        <FormatQuoteIcon fontSize="small" />
      </OptionButton>
      <OptionButton 
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <HorizontalRuleIcon fontSize="small" />
      </OptionButton>
      <OptionButton 
        onClick={() => editor.chain().focus().setHardBreak().run()}
        title="Hard Break"
      >
        <WrapTextIcon fontSize="small" />
      </OptionButton>

      <div className="grow" />

      <OptionButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        title="Undo"
      >
        <UndoIcon fontSize="small" />
      </OptionButton>
      <OptionButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        title="Redo"
      >
        <RedoIcon fontSize="small" />
      </OptionButton>
    </div>
  )
}
