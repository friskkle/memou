'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  createNewEntry,
  createNewJournal,
  deleteJournalEntry,
  deleteJournalId,
  editEntry,
  editJournalId,
} from '../journals';
import { getSession } from '../auth';

// State for journal creation and editing form validation
export type State = {
  message?: string | null;
  errors?: {
    title?: string[];
  };
};

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }
  return session.user.id;
}

const CreateJournalSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  shared_with: z.string().optional(),
});

const EditJournalSchema = CreateJournalSchema.extend({
  journalId: z.coerce.number().int().positive(),
});

export async function createEntry(
  journal_id: number,
  title: string,
): Promise<void> {
  const userId = await requireUserId();
  let returning_id = 0;

  try {
    const entry = await createNewEntry(journal_id, title, userId);
    returning_id = entry.id;
    revalidatePath(`/journal/${journal_id}`);
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }

  redirect(`/journal/${journal_id}/entries/${returning_id}`);
}

export async function updateEntry(
  entry_id: number,
  title: string,
  content: string,
): Promise<void> {
  const userId = await requireUserId();

  try {
    await editEntry(entry_id, title, content, userId);
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
}

export async function deleteEntry(entry_id: number): Promise<void> {
  const userId = await requireUserId();

  try {
    console.log('Deleting entry with ID:', entry_id);
    const returning_id = await deleteJournalEntry(entry_id, userId);

    console.log(
      'Deleted entry with ID:',
      entry_id,
      'from journal ID:',
      returning_id,
    );
    revalidatePath(`/journal/${returning_id}`);
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}

// Journal actions
export async function createJournal(prevState: State, formData: FormData) {
  const userId = await requireUserId();

  const validatedFields = CreateJournalSchema.safeParse({
    title: formData.get('title'),
    shared_with: formData.get('shared_with'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields, failed to create journal.',
    };
  }

  const { title, shared_with } = validatedFields.data;
  let shared_with_array: string[] = [];

  if (shared_with) {
    try {
      shared_with_array = JSON.parse(shared_with);
    } catch (e) {
      console.error('Failed to parse shared_with', e);
    }
  }

  let returning_id = 0;

  try {
    const journal = await createNewJournal(userId, title, shared_with_array);
    returning_id = journal.id;
    revalidatePath(`/journal`);
  } catch (error) {
    console.error('Error creating journal:', error);
    return {
      message: 'Database error, failed to create journal.',
    };
  }

  redirect(`/journal/${returning_id}`);
}

export async function editJournal(prevState: State, formData: FormData) {
  const userId = await requireUserId();

  const validatedFields = EditJournalSchema.safeParse({
    title: formData.get('title'),
    journalId: formData.get('uuid'),
    shared_with: formData.get('shared_with'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields, failed to edit journal.',
    };
  }

  const { title, journalId, shared_with } = validatedFields.data;

  let shared_with_array: string[] = [];
  if (shared_with) {
    try {
      shared_with_array = JSON.parse(shared_with);
    } catch (e) {
      console.error('Failed to parse shared_with', e);
    }
  }

  try {
    await editJournalId(journalId, userId, title, shared_with_array);
    revalidatePath(`/journal`);
    console.log(`Updated journal id: ${journalId}`);
  } catch (error) {
    console.error('Error editing journal:', error);
    return {
      message: 'Database error, failed to update journal.',
    };
  }

  redirect(`/journal`);
}

export async function deleteJournal(id: number): Promise<void> {
  const userId = await requireUserId();

  try {
    console.log('Deleting journal with ID:', id);
    const returning_id = await deleteJournalId(id, userId);

    console.log('Deleted journal with ID:', returning_id);
    revalidatePath(`/journal`);
  } catch (error) {
    console.error('Error deleting journal:', error);
    throw error;
  }
}
