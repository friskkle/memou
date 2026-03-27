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

const JournalFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  uuid: z.string(),
  shared_with: z.string().optional(),
});

export async function createEntry(
  journal_id: number,
  title: string,
): Promise<void> {
  console.log('Creating a new entry');
  let returning_id = 0;

  const session = await getSession();

  if (!session) {
    throw new Error('Unauthorized');
  }

  try {
    const entry = await createNewEntry(journal_id, title, session.user.id);
    returning_id = entry.id;
    revalidatePath(`/journal/${journal_id}`);
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  } finally {
    redirect(`/journal/${journal_id}/${returning_id}`);
  }
}

export async function updateEntry(
  entry_id: number,
  title: string,
  content: string,
): Promise<void> {
  // Get user ID from session
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  const userId = session.user.id;

  try {
    await editEntry(entry_id, title, content, userId);
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
}

export async function deleteEntry(entry_id: number): Promise<void> {
  try {
    // Get user ID from session
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }
    const userId = session.user.id;

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
  const validatedFields = JournalFormSchema.safeParse({
    title: formData.get('title'),
    uuid: formData.get('uuid'),
    shared_with: formData.get('shared_with'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields, failed to create journal.',
    };
  }

  const { title, uuid, shared_with } = validatedFields.data;
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
    const journal = await createNewJournal(uuid, title, shared_with_array);
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
  const validatedFields = JournalFormSchema.safeParse({
    title: formData.get('title'),
    uuid: formData.get('uuid'), // we will reuse the zod schema from journal creation but in this submission, the uuid is the journal ID
    shared_with: formData.get('shared_with'),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing fields, failed to create journal.',
    };
  }

  // authorization check, send the creator ID for authorization check in the server shared service layer
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  const creatorId = session.user.id;

  // get fields data
  const { title, uuid, shared_with } = validatedFields.data;

  // parse shared_with string into JSON array
  let shared_with_array: string[] = [];
  if (shared_with) {
    try {
      shared_with_array = JSON.parse(shared_with);
    } catch (e) {
      console.error('Failed to parse shared_with', e);
    }
  }

  // edit journal
  try {
    const journalId = await editJournalId(parseInt(uuid), creatorId, title, shared_with_array);

    revalidatePath(`/journal`);
    console.log(`Updated journal id: ${journalId}`);
  } catch (error) {
    console.error('Error creating journal:', error);
    return {
      message: 'Database error, failed to create journal, reason: ' + error,
    };
  }
  redirect(`/journal`);
}

export async function deleteJournal(id: number): Promise<void> {
  try {
    // Get user ID from session
    const session = await getSession();
    if (!session) {
      throw new Error('Unauthorized');
    }
    const userId = session.user.id;

    console.log('Deleting journal with ID:', id);
    const returning_id = await deleteJournalId(id, userId);

    console.log('Deleted journal with ID:', returning_id);
    revalidatePath(`/journal`);
  } catch (error) {
    console.error('Error deleting journal:', error);
    throw error;
  }
}
