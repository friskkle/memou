export const dynamic = 'force-dynamic';

import React from 'react';
import { JournalDashboard } from '@/src/components/features/journal/dashboard/journal-dashboard';
import { fetchEntries, fetchJournalId } from '@/src/lib/journals';
import { fetchDateIdeaSummary } from '@/src/lib/date-ideas';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Memou | Journal',
  description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
  keywords: ['memou', 'journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary', 'date planner'],
  openGraph: {
    title: 'Memou | Journal',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    type: 'website',
  }
};

const JournalDashboardPage = async (props: {
  params: Promise<{ journal_id: string }>;
}): Promise<React.ReactElement> => {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  const params = await props.params;
  const journal_id = params.journal_id;
  const journal = await fetchJournalId(journal_id, session.user.id);

  if (!journal.id) {
    redirect('/journal');
  }

  const [entriesData, dateSummary] = await Promise.all([
    fetchEntries(journal_id, session.user.id, {
      limit: 4,
      sortBy: 'modified',
      sortDir: 'desc'
    }),
    fetchDateIdeaSummary(Number(journal_id), session.user.id),
  ]);

  return (
    <JournalDashboard
      journal={journal}
      journalId={journal_id}
      recentEntries={entriesData.entries}
      entryCount={entriesData.totalCount}
      dateSummary={dateSummary}
    />
  );
};

export default JournalDashboardPage;
