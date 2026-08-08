import React from 'react';
import { fetchEntries, fetchJournalId } from '@/src/lib/journals';
import { createEntry } from '@/src/lib/actions/journals';
import { EntryList } from '@/src/components/features/list/entry-list';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { Metadata } from 'next';

export async function generateMetadata(props: {
  params: Promise<{ journal_id: string }>;
}): Promise<Metadata> {
  const { journal_id } = await props.params;

  try {
    const journal = await fetchJournalId(journal_id, '');
    const journalName = journal.title || 'Journal';
    return {
      title: `${journalName} | Entries`,
      description: `Browse and manage entries in the ${journalName} journal.`,
      alternates: {
        canonical: `https://memou.me/journal/${journal_id}/entries`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: 'Entries',
      robots: { index: false, follow: false },
    };
  }
}

const Entries = async (props: {
  params: Promise<{ journal_id: string }>;
  searchParams?: Promise<{
    query?: string;
    page?: string;
    sort?: string;
    dir?: string;
  }>
}): Promise<React.ReactElement> => {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  const params = await props.params;
  const journal_id = params.journal_id;
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;
  const sortBy = (searchParams?.sort as 'name' | 'created' | 'modified') || 'modified';
  const sortDir = (searchParams?.dir as 'asc' | 'desc') || 'desc';

  const journal = await fetchJournalId(journal_id, session.user.id);
  if (!journal.id) {
    redirect('/journal');
  }

  const { entries, totalCount } = await fetchEntries(journal_id, session.user.id, {
    query,
    page,
    limit: 10,
    sortBy,
    sortDir,
  });

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-4 mt-2 relative">
      <span className="flex flex-row justify-between items-center mb-4">
        <div>
          <p className='text-md font-medium text-gray-500'>{journal.title}</p>
          <p className="text-3xl font-bold">Entries</p>
        </div>
        <PrimaryButton
          size="small"
          onClick={createEntry.bind(null, Number(journal_id), 'New Entry')}
        >
          New Entry
        </PrimaryButton>
      </span>
      <div className="mb-4">
        <SearchInput placeholder='Search an Entry by Title...' />
      </div>
      <EntryList list={entries} />
      <Pagination totalCount={totalCount} itemsPerPage={10} />
    </div>
  );
};

export default Entries;
