import Link from 'next/link';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import LocalActivityOutlinedIcon from '@mui/icons-material/LocalActivityOutlined';
import { PrimaryButton } from '@/src/components/elements/primary-button';
import { createEntry } from '@/src/lib/actions/journals';
import type { DateIdeaSummary, Entry, Journal } from '@/src/lib/definitions';
import { NextDatePanel } from './next-date-panel';
import { RecentEntriesPanel } from './recent-entries-panel';
import { SummaryTile } from './summary-tile';

export function JournalDashboard({
  journal,
  journalId,
  recentEntries,
  entryCount,
  dateSummary,
}: {
  journal: Journal;
  journalId: string;
  recentEntries: Entry[];
  entryCount: number;
  dateSummary: DateIdeaSummary;
}) {
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
            onClick={createEntry.bind(null, Number(journalId), 'New Entry')}
          >
            New Entry
          </PrimaryButton>
          <Link href={`/journal/${journalId}/dates`}>
            <PrimaryButton size="small">
              Add Date Idea
            </PrimaryButton>
          </Link>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <SummaryTile icon={<EditNoteOutlinedIcon fontSize="small" />} label="Entries" value={entryCount} />
        <SummaryTile icon={<LocalActivityOutlinedIcon fontSize="small" />} label="Date Ideas" value={dateSummary.idea} />
        <SummaryTile icon={<CalendarMonthOutlinedIcon fontSize="small" />} label="Planned" value={dateSummary.planned} />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <RecentEntriesPanel journalId={journalId} entries={recentEntries} />
        <NextDatePanel journalId={journalId} plannedIdea={dateSummary.plannedIdea} />
      </section>
    </div>
  );
}
