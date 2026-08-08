export const dynamic = 'force-dynamic';

import React from 'react';
import { fetchJournals } from '@/src/lib/journals';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { JournalList } from '@/src/components/features/list/journal-list';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { SearchInput } from '@/src/components/ui/search-input';
import { Pagination } from '@/src/components/ui/pagination';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journals',
  description: 'Browse and manage your collaborative journals. Create new journals and share memories with your loved ones.',
  keywords: ['memou', 'journals', 'collaborative journaling', 'free journal app', 'memories', 'secure diary'],
  alternates: {
    canonical: 'https://memou.me/journal',
  },
  openGraph: {
    title: 'Memou | Journals',
    description: 'Browse and manage your collaborative journals. Create new journals and share memories with your loved ones.',
    url: 'https://memou.me/journal',
    type: 'website',
  },
};

const Journals = async (props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    sort?: string;
    dir?: string;
  }>;
}): Promise<React.ReactElement> => {
  const session = await getSession();
  if (!session) {
    redirect('/signin');
  }

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const page = Number(searchParams?.page) || 1;
  const sortBy = (searchParams?.sort as 'name' | 'creator') || 'name';
  const sortDir = (searchParams?.dir as 'asc' | 'desc') || 'asc';

  const { journals, totalCount } = await fetchJournals(session.user.id, {
    query,
    page,
    limit: 10,
    sortBy,
    sortDir,
  });

  return (
    <div className="max-w-5xl mx-auto p-2 md:p-4 mt-2 relative">
      <header className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Journals</h1>
        <Link href="/journal/new">
          <PrimaryButton size="small">New Journal</PrimaryButton>
        </Link>
      </header>
      <div className="mb-4">
        <SearchInput placeholder="Search journal by name..." />
      </div>
      <JournalList list={journals} />
      <Pagination totalCount={totalCount} itemsPerPage={10} />
    </div>
  );
};

export default Journals;
