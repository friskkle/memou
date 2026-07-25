'use client';

import { useMemo, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import { planDateIdea } from '@/src/lib/actions/date-ideas';
import {
  DATE_IDEA_BUDGETS,
  DATE_IDEA_CATEGORIES,
  DateIdea,
  DateIdeaStatus,
} from '@/src/lib/definitions';
import { DateIdeaList } from './date-list';
import { DateIdeaModal } from './date-idea-modal';
import { FilterSelect } from '@/src/components/elements/filter-select';
import { PrimaryButton } from '@/src/components/elements/primary-button';
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
    <div className="mx-auto max-w-[85%] p-2 md:p-4 mt-2">
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

      <section className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:h-120">
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
