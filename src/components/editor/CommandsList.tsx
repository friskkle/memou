import { Extension } from '@tiptap/core'
import { EditorState, PluginKey } from '@tiptap/pm/state'
import { Plugin } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'
import { CommandItem } from './types'

export const slashCommands: CommandItem[] = [
  {
    title: 'Heading 1',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    },
    icon: 'H1'
  },
  {
    title: 'Heading 2',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    },
    icon: 'H2'
  },
  {
    title: 'Heading 3',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    },
    icon: 'H3'
  },
  {
    title: 'Bold Text',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBold()
        .run()
    },
    icon: 'B'
  },
  {
    title: 'Italic Text',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleItalic()
        .run()
    },
    icon: 'I'
  },
  {
    title: 'Bullet List',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run()
    },
    icon: '•'
  },
  {
    title: 'Numbered List',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run()
    },
    icon: '1.'
  },
  {
    title: 'Quote',
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run()
    },
    icon: '"'
  }
]

interface SlashMenuEvent extends CustomEvent {
  detail: {
    from: number
    to: number
  }
}

declare global {
  interface DocumentEventMap {
    showSlashMenu: SlashMenuEvent
  }
}

export const SlashCommandsExtension = Extension.create({
  name: 'slashCommands',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('slashCommands'),
        view: () => ({
          update: (view: EditorView, prevState: EditorState) => {
            // console.log(prevState)
            const { state } = view
            const { selection } = state
            const { from } = selection

            // Check if we're in an empty paragraph and typed '/'
            const textBefore = state.doc.textBetween(Math.max(0, from - 10), from, '\n')
            
            if (textBefore.endsWith('/')) {
              // Trigger slash menu - you'll handle this in the component
              const event: SlashMenuEvent = new CustomEvent('showSlashMenu', {
                detail: { from: from - 1, to: from }
              }) as SlashMenuEvent
              document.dispatchEvent(event)
            }
          }
        })
      })
    ]
  }
})