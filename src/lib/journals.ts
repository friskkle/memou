'use server';

import { prisma } from './prisma';
import { Journal, Entry } from './definitions';

// Journals
export async function fetchJournals(uid: string, query: string = ''): Promise<Journal[]> {
  try {
    const journals = await prisma.journals.findMany({
      where: {
        AND: [{ title: {contains: query, mode: "insensitive"}}, { OR: [{ uuid: uid }, { shared_with: { has: uid } }] }],
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Collect all unique user IDs (owners + shared_with) across all journals
    const allUserIds = Array.from(
      new Set([
        ...journals.map((j) => j.uuid),
        ...journals.flatMap((j) => j.shared_with),
      ])
    );

    // Batch-resolve user names and emails
    let userMap: Record<string, { id: string; name: string; email: string }> = {};
    if (allUserIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: allUserIds } },
        select: { id: true, name: true, email: true },
      });
      userMap = Object.fromEntries(
        users.map((u) => [u.id, { id: u.id, name: u.name, email: u.email }])
      );
    }

    return journals.map((journal) => ({
      id: journal.id,
      uuid: journal.uuid,
      title: journal.title || '',
      shared_with: journal.shared_with,
      shared_with_names: journal.shared_with
        .filter((id) => id !== uid)
        .map((id) => userMap[id] || { id: id, name: 'Unknown', email: '' }),
      creator_name: userMap[journal.uuid]?.name || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
}

export async function fetchJournalId(
  journal_id: string,
  userId: string,
): Promise<Journal> {
  try {
    const journal = await prisma.journals.findUnique({
      where: {
        id: parseInt(journal_id),
      },
    });

    if (!journal) {
      return {
        id: 0,
        uuid: '',
        title: 'Untitled',
        shared_with: [],
        shared_with_names: [],
        creator_name: '',
      };
    }

    // Authorization check: user must be creator, editor, or in the journal's shared_with list
    if (userId) {
      const isCreator = journal.uuid === userId;
      const isSharedWith = journal.shared_with.includes(userId);

      if (!isCreator && !isSharedWith) {
        throw new Error('Unauthorized: You do not have access to this journal');
      }
    }

    const allUserIds = Array.from(
      new Set([journal.uuid, ...journal.shared_with])
    );

    let userMap: Record<string, { id: string; name: string; email: string }> = {};
    if (allUserIds.length > 0) {
      const users = await prisma.user.findMany({
        where: { id: { in: allUserIds } },
        select: { id: true, name: true, email: true },
      });
      userMap = Object.fromEntries(
        users.map((u) => [u.id, { id: u.id, name: u.name, email: u.email }])
      );
    }

    return {
      id: journal.id,
      uuid: journal.uuid,
      title: journal.title || '',
      shared_with: journal.shared_with,
      shared_with_names: journal.shared_with
        .filter((id) => id !== userId)
        .map((id) => userMap[id] || { id: '', name: 'Unknown', email: '' }),
      creator_name: userMap[journal.uuid]?.name || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching journal:', error);
    throw error;
  }
}

export async function createNewJournal(
  uid: string,
  title: string,
  shared_with: string[] = [],
): Promise<Journal> {
  try {
    const journal = await prisma.journals.create({
      data: {
        uuid: uid,
        title: title,
        shared_with: shared_with,
      },
    });
    return {...journal, shared_with_names: [], creator_name: ''};
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

export async function editJournalId(
  id: number,
  uuid: string,
  title: string,
  shared_with: string[],
): Promise<number> {
  try {
    const journal = await prisma.journals.update({
      where: {
        id: id,
        uuid: uuid,
      },
      data: {
        title,
        shared_with,
      },
    });
    return journal.id;
  } catch (error) {
    console.error('Error editing journal:', error);
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
  query: string = '',
): Promise<Entry[]> {
  try {
    const entries = await prisma.journal_entries.findMany({
      where: {
        journal_id: parseInt(journal_id),
        AND: [{ title: {contains: query, mode: "insensitive"} }, { OR: [{ creator: userId }, { editors: { has: userId } }] }],
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
    const journal = await prisma.journals.findUnique({
      where: { id: journal_id },
      select: { uuid: true, shared_with: true },
    });

    if (!journal) {
      throw new Error('Journal not found');
    }

    const editors = Array.from(new Set([journal.uuid, ...journal.shared_with]));

    const entry = await prisma.journal_entries.create({
      data: {
        journal_id,
        title,
        content: '',
        created_date: new Date(),
        last_modified: new Date(),
        creator,
        editors: editors.filter(id => id !== creator),
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
): Promise<Entry> {
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
