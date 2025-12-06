export const dynamic = "force-dynamic"

import { TextEditor } from '@/src/components/features/editor/editor'
import { updateEntry } from '@/src/lib/actions/journals'
import { fetchEntryId } from '@/src/lib/data'
import React from 'react'

const Journal = async (props: { params: Promise<{ entry_id: string }> }): Promise<React.ReactElement> => {
  const entry = await fetchEntryId((await props.params).entry_id)
  const {
    id,
    title: entryTitle,
    content: entryContent
  } = entry

  const title = entryTitle ?? "Untitled"
  const content = entryContent ?? ""

  const saveEntry = async (newTitle: string = title, newContent: string): Promise<void> => {
    'use server'
    updateEntry(id, newTitle, newContent)
  }

  return (
    <div className="max-w-4xl mx-auto md:p-4 relative">
      <TextEditor title={title} initialContent={content} saveEntry={saveEntry}/>
      
      {/* Helper text */}
      <div className='hidden width-full md:flex justify-between'>
        <p className="text-sm text-gray-600 mt-4">
          💡 Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to open formatting options
        </p>
      </div>
    </div>
  )
}

export default Journal;