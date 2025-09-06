export const dynamic = "force-dynamic"

import { TextEditor } from '@/src/components/editor/editor'
import { updateEntry } from '@/src/lib/actions'
import { fetchEntry } from '@/src/lib/data'
import React from 'react'

export default async function Journal(): Promise<React.ReactElement> {
  const {
    id,
    title,
    content
  } = await fetchEntry('1')

  const saveEntry = async (newContent: string): Promise<void> => {
    'use server'
    updateEntry(id, title, newContent)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <TextEditor title={title} initialContent={content} updateEntry={saveEntry}/>
      
      {/* Helper text */}
      <div className='width-full flex justify-between'>
        <p className="text-sm text-gray-600 mt-4">
          💡 Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to open formatting options
        </p>
      </div>
    </div>
  )
}
