export const dynamic = "force-dynamic"

import { CollaborativeEditor } from '@/src/components/features/editor/editor'
import { getSession } from '@/src/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const JournalEntry = async (props: { params: Promise<{ entry_id: string }> }): Promise<React.ReactElement> => {
  const session = await getSession()

  if (!session) {
    redirect('/signin')
  }

  const { entry_id } = await props.params

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
      <CollaborativeEditor entryId={entry_id} userName={session.user.name || session.user.email} />

      <div className='hidden width-full md:flex justify-between'>
        <p className="text-sm text-gray-600 mt-4">
          Type <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">/</kbd> to open formatting options
        </p>
      </div>
    </div>
  )
}

export default JournalEntry;
