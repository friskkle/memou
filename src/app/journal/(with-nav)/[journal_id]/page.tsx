export const dynamic = 'force-dynamic';

import React from 'react';
import { JournalDashboard } from '@/src/components/features/journal/dashboard/journal-dashboard';
import { fetchEntries, fetchJournalId } from '@/src/lib/journals';
import { fetchDateIdeaSummary } from '@/src/lib/date-ideas';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ journal_id: string }>;
}): Promise<Metadata> {
  const { journal_id } = await props.params;

  try {
    const journal = await fetchJournalId(journal_id, '');
    const journalName = journal.title || 'Journal';
    return {
      title: journalName,
      description: `View the ${journalName} journal dashboard. Track recent entries and date plans.`,
      alternates: {
        canonical: `https://memou.me/journal/${journal_id}`,
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: 'Journal',
      robots: { index: false, follow: false },
    };
  }
}

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
