export const dynamic = "force-dynamic"

import React from 'react'

const EntryList = async (props: { params: Promise<{ journal_id: string }> }): Promise<React.ReactElement> => {

  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      Entries of the journal go here, journal ID: {(await props.params).journal_id}
    </div>
  )
}

export default EntryList;