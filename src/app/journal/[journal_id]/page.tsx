export const dynamic = "force-dynamic"

import React from 'react'
import Link from 'next/link'
import { fetchEntries } from '@/src/lib/data'
import { List } from '@/src/components/features/list/list'
import { PrimaryButton } from '@/src/components/elements/primary-button'

const Entries = async (props: { params: Promise<{ journal_id: string }> }): Promise<React.ReactElement> => {
  const params = await props.params
  const journal_id = params.journal_id
  const entries = await fetchEntries(journal_id)
  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      Entries of the journal go here, journal ID: {journal_id}
      <List list={entries} />
      <div>
        <Link href={`/journal/${journal_id}/new`}>
          <PrimaryButton size='small'>New Entry</PrimaryButton>
        </Link>
      </div>
    </div>
  )
}

export default Entries;