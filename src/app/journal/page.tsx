export const dynamic = 'force-dynamic';

import React from 'react';
import { fetchJournals } from '@/src/lib/data';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { JournalList } from '@/src/components/features/list/journal-list';

const Journals = async (): Promise<React.ReactElement> => {
  const journals = await fetchJournals();
  return (
    <div className="max-w-4xl mx-auto p-4 relative">
      <span className="flex flex-row justify-between items-center mb-4">
        <p className="text-3xl font-bold">Journals</p>
        <PrimaryButton size="small" link="/journal/new">
          New Journal
        </PrimaryButton>
      </span>
      <JournalList list={journals} />
    </div>
  );
};

export default Journals;
