import { completeDateIdea, planDateIdea, returnDateIdeaToPool, deleteDateIdea } from '@/src/lib/actions/date-ideas';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import type { DateIdea } from '@/src/lib/definitions';
import type { TransitionStartFunction, ReactNode, ButtonHTMLAttributes } from 'react';

export function DateIdeaList({
  ideas,
  journalId,
  isPending,
  onEdit,
  startTransition,
}: {
  ideas: DateIdea[];
  journalId: number;
  isPending: boolean;
  onEdit: (idea: DateIdea) => void;
  startTransition: TransitionStartFunction;
}) {
  if (ideas.length === 0) {
    return (
      <div className="flex h-full min-h-[300px] lg:max-h-[480px] items-center justify-center rounded-lg border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-sm">
        No date ideas match this view.
      </div>
    );
  }

  return (
    <div className="min-h-0 lg:h-full overflow-y-auto rounded-lg border border-stone-200 bg-white shadow-sm">
      {ideas.map((idea, i) => (
        <article
          key={idea.id}
          className={i > 0 ? 'border-t border-stone-100 px-5 py-4' : 'px-5 py-4'}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-bold text-stone-900">
                  {idea.title}
                </h2>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold capitalize text-stone-600">
                  {idea.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-stone-600">
                {idea.description || 'No description yet.'}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
                <span className="rounded-full bg-jbrown/15 px-3 py-1 text-[#9A654B]">
                  {idea.category}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1">
                  {idea.budget}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1">
                  Added by {idea.added_by_name}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-1">
              <IconButton
                label="Edit"
                onClick={() => onEdit(idea)}
                disabled={isPending}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              {idea.status === 'idea' ? (
                <IconButton
                  label="Plan"
                  onClick={() =>
                    startTransition(() => {
                      void planDateIdea(idea.id, journalId);
                    })
                  }
                  disabled={isPending}
                >
                  <CheckCircleOutlineIcon fontSize="small" />
                </IconButton>
              ) : null}
              {idea.status === 'planned' ? (
                <>
                  <form action={completeDateIdea.bind(null, idea.id)}>
                    <input type="hidden" name="journal_id" value={journalId} />
                    <IconButton
                      label="Complete"
                      type="submit"
                      disabled={isPending}
                    >
                      <CheckCircleOutlineIcon fontSize="small" />
                    </IconButton>
                  </form>
                  <IconButton
                    label="Return"
                    onClick={() =>
                      startTransition(() => {
                        void returnDateIdeaToPool(idea.id, journalId);
                      })
                    }
                    disabled={isPending}
                  >
                    <ReplayOutlinedIcon fontSize="small" />
                  </IconButton>
                </>
              ) : null}
              <form action={deleteDateIdea.bind(null, idea.id)}>
                <IconButton
                  label="Delete"
                  type="submit"
                  danger
                  disabled={isPending}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function IconButton({
  label,
  children,
  danger = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      {...props}
      title={label}
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm transition disabled:cursor-not-allowed disabled:opacity-50 ${
        danger
          ? 'border-jred-light bg-jred-lightest text-jred hover:bg-jred-light'
          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:text-stone-900'
      }`}
    >
      {children}
    </button>
  );
}