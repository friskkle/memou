import Link from 'next/link';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { DateIdea } from '@/src/lib/definitions';

export function NextDatePanel({
  journalId,
  plannedIdea,
}: {
  journalId: string;
  plannedIdea: DateIdea | null;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <AutoAwesomeIcon fontSize="small" className="text-[#D49273]" />
        <h2 className="text-lg font-bold text-stone-900">Next Date</h2>
      </div>
      {plannedIdea ? (
        <div className="space-y-3">
          <div>
            <p className="text-xl font-bold text-stone-900">{plannedIdea.title}</p>
            <p className="mt-1 text-sm text-stone-600">
              {plannedIdea.description || 'Planned from your shared idea pool.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
            <span className="rounded-full bg-[#D49273]/15 px-3 py-1 text-[#9A654B]">{plannedIdea.category}</span>
            <span className="rounded-full bg-stone-100 px-3 py-1">{plannedIdea.budget}</span>
          </div>
          <Link
            href={`/journal/${journalId}/dates`}
            className="inline-flex rounded-lg border border-stone-200 px-3 py-2 text-sm font-semibold text-stone-700 no-underline transition hover:bg-stone-50"
          >
            Open planner
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-stone-600">No date is planned yet.</p>
          <Link
            href={`/journal/${journalId}/dates`}
            className="inline-flex rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white no-underline transition hover:bg-stone-700"
          >
            Pick one
          </Link>
        </div>
      )}
    </div>
  );
}
