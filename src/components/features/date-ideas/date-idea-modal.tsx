'use client';

import type { DateIdea } from "@/src/lib/definitions";
import { DATE_IDEA_BUDGETS, DATE_IDEA_CATEGORIES } from "@/src/lib/definitions";
import { createDateIdea, updateDateIdea } from "@/src/lib/actions/date-ideas";
import { useTransition } from "react";

export function DateIdeaModal({
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
