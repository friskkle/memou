export const dynamic = "force-dynamic"

import React from 'react'
import { fetchEntries } from '@/src/lib/data'
import { EntryList } from '@/src/components/features/list/entry-list'
import { PrimaryButton } from '@/src/components/elements/primary-button'
import { createEntry } from '@/src/lib/actions/journals'

const Entries = async (props: { params: Promise<{ journal_id: string }> }): Promise<React.ReactElement> => {
  const params = await props.params
  const journal_id = params.journal_id
  const entries = await fetchEntries(journal_id)
  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <span className='flex flex-row justify-between items-center mb-4'>
        <p className="text-3xl font-bold">Entries</p>
        <PrimaryButton
          size='small'
          action={createEntry.bind(null, Number(journal_id), 'New Entry')}>
            New Entry
        </PrimaryButton>
      </span>
      <EntryList list={entries} />
    </div>
  )
}

export default Entries;