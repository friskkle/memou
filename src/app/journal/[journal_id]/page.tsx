export const dynamic = 'force-dynamic';

import React from 'react';
import { fetchEntries } from '@/src/lib/journals';
import { createEntry } from '@/src/lib/actions/journals';
import { EntryList } from '@/src/components/features/list/entry-list';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { auth } from '@/src/lib/auth';
import { headers } from 'next/headers';

const Entries = async (props: {
  params: Promise<{ journal_id: string }>;
}): Promise<React.ReactElement> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const params = await props.params;
  const journal_id = params.journal_id;
  const entries = await fetchEntries(journal_id, session!.user.id);

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
      <span className="flex flex-row justify-between items-center mb-4">
        <p className="text-3xl font-bold">Entries</p>
        <PrimaryButton
          size="small"
          onClick={createEntry.bind(null, Number(journal_id), 'New Entry')}
        >
          New Entry
        </PrimaryButton>
      </span>
      <EntryList list={entries} />
    </div>
  );
};

export default Entries;
