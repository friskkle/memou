export const dynamic = "force-dynamic"

import React from 'react'
import { fetchEntries } from '@/src/lib/data'

const EntryList = async (props: { params: Promise<{ journal_id: string }> }): Promise<React.ReactElement> => {
  const params = await props.params
  const journal_id = params.journal_id
  const entries = await fetchEntries(journal_id)
  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      Entries of the journal go here, journal ID: {journal_id}
      <ul>
        {entries.map(entry => (
          <li key={entry.id} className='mb-2 p-2 border rounded'>
            <h3 className='font-bold'>{entry.title}</h3>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EntryList;