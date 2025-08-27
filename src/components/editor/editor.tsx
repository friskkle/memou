import StarterKit from "@tiptap/starter-kit"
import { SlashCommandsExtension } from './CommandsList'
import { Extensions } from '@tiptap/react'

export const editorExtensions: Extensions = [
  StarterKit,
  SlashCommandsExtension
]

export const editorProps = {
  attributes: {
    class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
  }
} as const

export const initialContent: string = '<p>Hello World! 🌎️</p>'