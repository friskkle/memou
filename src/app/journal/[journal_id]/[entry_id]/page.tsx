export const dynamic = "force-dynamic"

import { CollaborativeEditor } from '@/src/components/features/editor/editor'
import { auth } from '@/src/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const Journal = async (props: { params: Promise<{ entry_id: string }> }): Promise<React.ReactElement> => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    redirect('/signin')
  }

  const { entry_id } = await props.params

/*   // Fetch with user authorization check
  const entry = await fetchEntryId(entry_id, session.user.id)

  if (entry.id === 0) {
    redirect('/journal')
  } */

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-4 relative">
      <CollaborativeEditor entryId={entry_id} userName={session.user.name || session.user.email} />
      
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
