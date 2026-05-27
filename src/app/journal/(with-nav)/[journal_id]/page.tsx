export const dynamic = 'force-dynamic';

import React from 'react';
import { JournalDashboard } from '@/src/components/features/journal/dashboard/journal-dashboard';
import { fetchEntries, fetchJournalId } from '@/src/lib/journals';
import { fetchDateIdeaSummary } from '@/src/lib/date-ideas';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

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

  const [entries, dateSummary] = await Promise.all([
    fetchEntries(journal_id, session.user.id),
    fetchDateIdeaSummary(Number(journal_id), session.user.id),
  ]);
  const recentEntries = entries.slice(0, 4);

  return (
    <JournalDashboard
      journal={journal}
      journalId={journal_id}
      recentEntries={recentEntries}
      entryCount={entries.length}
      dateSummary={dateSummary}
    />
  );
};

export default JournalDashboardPage;
