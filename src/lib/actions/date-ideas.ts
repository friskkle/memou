'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getSession } from '../auth';
import {
  createDateIdeaRecord,
  deleteDateIdeaRecord,
  setDateIdeaStatus,
  updateDateIdeaRecord,
} from '../date-ideas';

const DateIdeaFormSchema = z.object({
  journal_id: z.coerce.number().int().positive(),
  title: z.string().trim().min(1, 'Title is required').max(96, 'Title must be under 96 characters'),
  description: z.string().trim().max(500, 'Description must be under 500 characters').optional(),
  category: z.string().trim().min(1, 'Category is required').max(32),
  budget: z.string().trim().min(1, 'Budget is required').max(32),
});

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  return session.user.id;
}

function revalidateJournalDateViews(journalId: number) {
  revalidatePath(`/journal/${journalId}`);
  revalidatePath(`/journal/${journalId}/dates`);
}

export async function createDateIdea(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const parsed = DateIdeaFormSchema.parse({
    journal_id: formData.get('journal_id'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    category: formData.get('category'),
    budget: formData.get('budget'),
  });

  await createDateIdeaRecord(parsed.journal_id, userId, parsed);
  revalidateJournalDateViews(parsed.journal_id);
}

export async function updateDateIdea(ideaId: number, formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const parsed = DateIdeaFormSchema.parse({
    journal_id: formData.get('journal_id'),
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    category: formData.get('category'),
    budget: formData.get('budget'),
  });

  await updateDateIdeaRecord(ideaId, userId, parsed);
  revalidateJournalDateViews(parsed.journal_id);
}

export async function planDateIdea(ideaId: number, journalId: number): Promise<void> {
  const userId = await requireUserId();
  await setDateIdeaStatus(ideaId, userId, 'planned');
  revalidateJournalDateViews(journalId);
}

export async function returnDateIdeaToPool(ideaId: number, journalId: number): Promise<void> {
  const userId = await requireUserId();
  await setDateIdeaStatus(ideaId, userId, 'idea');
  revalidateJournalDateViews(journalId);
}

export async function completeDateIdea(ideaId: number, formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const journalId = z.coerce.number().int().positive().parse(formData.get('journal_id'));
  const completedNote = z.string().trim().max(500).optional().parse(formData.get('completed_note') || undefined);

  await setDateIdeaStatus(ideaId, userId, 'completed', completedNote);
  revalidateJournalDateViews(journalId);
}

export async function deleteDateIdea(ideaId: number): Promise<void> {
  const userId = await requireUserId();
  const journalId = await deleteDateIdeaRecord(ideaId, userId);
  revalidateJournalDateViews(journalId);
}
