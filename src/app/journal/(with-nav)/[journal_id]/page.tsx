export const dynamic = 'force-dynamic';

import React from 'react';
import Link from 'next/link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import { fetchEntries, fetchJournalId } from '@/src/lib/journals';
import { fetchDateIdeaSummary } from '@/src/lib/date-ideas';
import { createEntry } from '@/src/lib/actions/journals';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

const JournalDashboard = async (props: {
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
    <div className="mx-auto max-w-5xl p-2 md:p-4 mt-2">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">Journal Home</p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">{journal.title || 'Untitled'}</h1>
          <p className="mt-2 text-sm text-stone-600">
            Shared with {journal.shared_with_names.length > 0 ? journal.shared_with_names.map((user) => user.name).join(', ') : 'just you'}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PrimaryButton
            size="small"
            onClick={createEntry.bind(null, Number(journal_id), 'New Entry')}
          >
            New Entry
          </PrimaryButton>
          <Link href={`/journal/${journal_id}/dates`}>
            <PrimaryButton size="small">
              Add Date Idea
            </PrimaryButton>
          </Link>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <SummaryTile icon={<EditNoteOutlinedIcon fontSize="small" />} label="Entries" value={entries.length} />
        <SummaryTile icon={<LocalActivityOutlinedIcon fontSize="small" />} label="Date Ideas" value={dateSummary.idea} />
        <SummaryTile icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Planned" value={dateSummary.planned} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-stone-900">Recent Entries</h2>
            <Link href={`/journal/${journal_id}/entries`} className="text-sm font-semibold text-[#9A654B] no-underline hover:underline">
              View all
            </Link>
          </div>
          {recentEntries.length > 0 ? (
            <ul className="divide-y divide-stone-100">
              {recentEntries.map((entry) => (
                <li key={entry.id}>
                  <Link href={`/journal/${journal_id}/entries/${entry.id}`} className="flex items-center justify-between gap-3 rounded-md px-2 py-3 text-stone-900 no-underline transition hover:bg-stone-50">
                    <span className="min-w-0 truncate font-semibold">{entry.title || 'Untitled'}</span>
                    <span className="shrink-0 text-xs text-stone-500">
                      {new Date(entry.last_modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-lg bg-stone-50 px-4 py-8 text-center text-sm text-stone-500">
              No entries yet.
            </div>
          )}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <AutoAwesomeIcon fontSize="small" className="text-[#D49273]" />
            <h2 className="text-lg font-bold text-stone-900">Next Date</h2>
          </div>
          {dateSummary.plannedIdea ? (
            <div className="space-y-3">
              <div>
                <p className="text-xl font-bold text-stone-900">{dateSummary.plannedIdea.title}</p>
                <p className="mt-1 text-sm text-stone-600">{dateSummary.plannedIdea.description || 'Planned from your shared idea pool.'}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                <span className="rounded-full bg-[#D49273]/15 px-3 py-1 text-[#9A654B]">{dateSummary.plannedIdea.category}</span>
                <span className="rounded-full bg-stone-100 px-3 py-1">{dateSummary.plannedIdea.budget}</span>
              </div>
              <Link href={`/journal/${journal_id}/dates`} className="inline-flex rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 no-underline transition hover:bg-stone-50">
                Open planner
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-stone-600">No date is planned yet.</p>
              <Link href={`/journal/${journal_id}/dates`} className="inline-flex rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white no-underline transition hover:bg-stone-700">
                Pick one
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

function SummaryTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-700">{icon}</span>
        <span className="text-2xl font-bold text-stone-900">{value}</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-stone-600">{label}</p>
    </div>
  );
}

export default JournalDashboard;
