'use server';

import { prisma } from './prisma';
import { Journal, Entry } from './definitions';

// Journals
export async function fetchJournals(uid: string): Promise<Journal[]> {
  try {
    const journals = await prisma.journals.findMany({
      where: {
        OR: [{ uuid: uid }, { shared_with: { has: uid } }],
      },
      orderBy: {
        id: 'desc',
      },
    });

    return journals.map((journal: Journal) => ({
      id: journal.id,
      uuid: journal.uuid,
      title: journal.title || '',
      shared_with: journal.shared_with,
    }));
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
}

export async function createNewJournal(
  uid: string,
  title: string,
): Promise<Journal> {
  try {
    const journal = await prisma.journals.create({
      data: {
        uuid: uid,
        title: title,
        shared_with: [],
      },
    });
    return journal;
  } catch (error) {
    console.error('Error creating journal:', error);
    throw error;
  }
}

export async function deleteJournalId(
  id: number,
  userId: string,
): Promise<number> {
  try {
    const deletedJournal = await prisma.journals.delete({
      where: {
        id,
        OR: [{ uuid: userId }, { shared_with: { has: userId } }],
      },
      select: {
        id: true,
      },
    });
    return deletedJournal.id;
  } catch (error) {
    console.error('Error deleting journal:', error);
    throw error;
  }
}

// Entries
export async function fetchEntryId(
  entry_id: string,
  userId: string,
): Promise<Entry> {
  try {
    const entry = await prisma.journal_entries.findUnique({
      where: {
        id: parseInt(entry_id),
      },
      include: {
        journals: true,
      },
    });

    if (!entry) {
      return {
        id: 0,
        journal_id: 0,
        title: 'Untitled',
        content: '',
        created_date: new Date(),
        last_modified: new Date(),
        editors: [],
        creator: '',
      };
    }

    // Authorization check: user must be creator, editor, or in the journal's shared_with list
    if (userId) {
      const isCreator = entry.creator === userId;
      const isEditor = entry.editors.includes(userId);
      const isSharedWith = entry.journals.shared_with.includes(userId);

      if (!isCreator && !isEditor && !isSharedWith) {
        throw new Error('Unauthorized: You do not have access to this entry');
      }
    }

    return {
      id: entry.id,
      journal_id: entry.journal_id,
      title: entry.title || 'Untitled',
      content: entry.content || '',
      created_date: entry.created_date,
      last_modified: entry.last_modified,
      editors: entry.editors,
      creator: entry.creator,
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    throw error;
  }
}

export async function fetchEntries(
  journal_id: string,
  userId: string = '',
): Promise<Entry[]> {
  try {
    const entries = await prisma.journal_entries.findMany({
      where: {
        journal_id: parseInt(journal_id),
        OR: [{ creator: userId }, { editors: { has: userId } }],
      },
      orderBy: {
        last_modified: 'desc',
      },
    });

    return entries.map((entry) => ({
      id: entry.id,
      journal_id: entry.journal_id,
      title: entry.title || 'Untitled',
      content: entry.content || '',
      created_date: entry.created_date,
      last_modified: entry.last_modified,
      editors: entry.editors,
      creator: entry.creator,
    }));
  } catch (error) {
    console.error('Error fetching entries:', error);
    throw error;
  }
}

export async function createNewEntry(
  journal_id: number,
  title: string,
  creator: string,
) {
  try {
    const entry = await prisma.journal_entries.create({
      data: {
        journal_id,
        title,
        content: '',
        created_date: new Date(),
        last_modified: new Date(),
        creator,
        editors: [],
      },
    });
    return entry;
  } catch (error) {
    console.error('Error creating entry:', error);
    throw error;
  }
}

export async function editEntry(
  entry_id: number,
  title: string,
  content: string,
  userId: string,
) {
  try {
    const entry = await prisma.journal_entries.update({
      where: {
        id: entry_id,
        OR: [{ creator: userId }, { editors: { has: userId } }],
      },
      data: {
        title,
        content,
        last_modified: new Date(),
      },
    });
    return entry;
  } catch (error) {
    console.error('Error editing entry:', error);
    throw error;
  }
}

export async function deleteJournalEntry(entry_id: number, userId: string) {
  try {
    const deletedEntry = await prisma.journal_entries.delete({
      where: {
        id: entry_id,
        OR: [{ creator: userId }, { editors: { has: userId } }],
      },
      select: {
        journal_id: true,
      },
    });
    return deletedEntry.journal_id;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
}
