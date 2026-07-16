'use client';

import type {
  ButtonHTMLAttributes,
  ReactNode,
  TransitionStartFunction,
} from 'react';
import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import {
  completeDateIdea,
  createDateIdea,
  deleteDateIdea,
  planDateIdea,
  returnDateIdeaToPool,
  updateDateIdea,
} from '@/src/lib/actions/date-ideas';
import {
  DATE_IDEA_BUDGETS,
  DATE_IDEA_CATEGORIES,
  DateIdea,
  DateIdeaStatus,
} from '@/src/lib/definitions';
import { PrimaryButton } from '../../elements/primary-button';
import { Spinner } from './spinner';

const statusLabels: Record<DateIdeaStatus | 'all', string> = {
  all: 'All',
  idea: 'Ideas',
  planned: 'Planned',
  completed: 'Done',
};

export function DatePlannerClient({
  journalId,
  ideas,
  filters,
}: {
  journalId: number;
  ideas: DateIdea[];
  filters: {
    category?: string;
    budget?: string;
    status: DateIdeaStatus | 'all';
  };
}) {
  const [editingIdea, setEditingIdea] = useState<DateIdea | null>(null);
  const [isPending, startTransition] = useTransition();
  const eligibleIdeas = useMemo(
    () => ideas.filter((idea) => idea.status === 'idea'),
    [ideas],
  );

  return (
    <div className="mx-auto max-w-6xl p-2 md:p-4 mt-2">
      <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-stone-500">
            Date Planner
          </p>
          <h1 className="mt-1 text-3xl font-bold text-stone-900">Date Ideas</h1>
        </div>
        <PrimaryButton
          type="button"
          onClick={() => setEditingIdea({} as DateIdea)}
          size="small"
        >
          <AddIcon fontSize="small" />
          Add Idea
        </PrimaryButton>
      </header>

      <DateIdeaFilters filters={filters} />

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <Spinner
          ideas={eligibleIdeas}
          onSpin={() => {}}
          onPlan={(idea) => {
            startTransition(() => {
              void planDateIdea(idea.id, journalId);
            });
          }}
          disabled={isPending}
        />

        <DateIdeaList
          ideas={ideas}
          journalId={journalId}
          isPending={isPending}
          onEdit={setEditingIdea}
          startTransition={startTransition}
        />
      </section>

      {editingIdea ? (
        <DateIdeaModal
          journalId={journalId}
          idea={editingIdea.id ? editingIdea : null}
          onClose={() => setEditingIdea(null)}
        />
      ) : null}
    </div>
  );
}

function DateIdeaFilters({
  filters,
}: {
  filters: {
    category?: string;
    budget?: string;
    status: DateIdeaStatus | 'all';
  };
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-2 rounded-lg border border-stone-200 bg-white p-3 shadow-sm sm:grid-cols-3">
      <FilterSelect
        label="Status"
        value={filters.status}
        onChange={(value) => updateFilter('status', value)}
      >
        {Object.entries(statusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        label="Category"
        value={filters.category || 'all'}
        onChange={(value) => updateFilter('category', value)}
      >
        <option value="all">All</option>
        {DATE_IDEA_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </FilterSelect>
      <FilterSelect
        label="Budget"
        value={filters.budget || 'all'}
        onChange={(value) => updateFilter('budget', value)}
      >
        <option value="all">All</option>
        {DATE_IDEA_BUDGETS.map((budget) => (
          <option key={budget} value={budget}>
            {budget}
          </option>
        ))}
      </FilterSelect>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="text-xs font-semibold uppercase tracking-[0.08em] text-stone-500">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold normal-case tracking-normal text-stone-800 outline-none transition focus:border-jbrown focus:bg-white"
      >
        {children}
      </select>
    </label>
  );
}

function DateIdeaList({
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
      <div className="rounded-lg border border-stone-200 bg-white p-8 text-center text-sm text-stone-500 shadow-sm">
        No date ideas match this view.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ideas.map((idea) => (
        <article
          key={idea.id}
          className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-stone-600">
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

function DateIdeaModal({
  journalId,
  idea,
  onClose,
}: {
  journalId: number;
  idea: DateIdea | null;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const action = idea ? updateDateIdea.bind(null, idea.id) : createDateIdea;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await action(formData);
        onClose();
      } catch (error) {
        console.error(error);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/35 p-4 backdrop-blur-sm">
      <form
        action={handleSubmit}
        className="w-full max-w-xl rounded-lg bg-white p-5 shadow-2xl"
      >
        <input type="hidden" name="journal_id" value={journalId} />
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-stone-900">
            {idea ? 'Edit Idea' : 'Add Idea'}
          </h2>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-stone-700">
            Title
            <input
              name="title"
              required
              maxLength={96}
              defaultValue={idea?.title || ''}
              className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base font-medium text-stone-900 outline-none transition focus:border-jbrown focus:bg-white"
            />
          </label>

          <label className="block text-sm font-semibold text-stone-700">
            Description
            <textarea
              name="description"
              maxLength={500}
              defaultValue={idea?.description || ''}
              rows={3}
              className="mt-1 block w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base text-stone-900 outline-none transition focus:border-jbrown focus:bg-white"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-stone-700">
              Category
              <select
                name="category"
                defaultValue={idea?.category || DATE_IDEA_CATEGORIES[0]}
                className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base text-stone-900 outline-none transition focus:border-jbrown focus:bg-white"
              >
                {DATE_IDEA_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-stone-700">
              Budget
              <select
                name="budget"
                defaultValue={idea?.budget || DATE_IDEA_BUDGETS[0]}
                className="mt-1 block w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-base text-stone-900 outline-none transition focus:border-jbrown focus:bg-white"
              >
                {DATE_IDEA_BUDGETS.map((budget) => (
                  <option key={budget} value={budget}>
                    {budget}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
