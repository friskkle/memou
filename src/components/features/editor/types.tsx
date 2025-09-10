import { Editor } from '@tiptap/core'

export interface CommandItem {
  title: string;
  description?: string;
  command: ({ editor, range }: { editor: Editor; range: CommandRange }) => void;
  icon?: string;
}

export interface CommandRange {
  from: number;
  to: number;
}

export interface MenuPosition {
  x: number;
  y: number;
}

export interface SlashMenuProps {
  editor: Editor | null
  isVisible: boolean
  position: MenuPosition
  onClose: () => void
  range: CommandRange | null
}