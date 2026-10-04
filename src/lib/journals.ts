'use server';

import { prisma } from './prisma';
import { Journal, Entry, JournalInvite } from './definitions';
import { Prisma } from '../generated/prisma/client';

async function getAccessibleJournal(
  journalId: number,
  userId: string,
): Promise<{ id: number; uuid: string; shared_with: string[] } | null> {
  return prisma.journals.findFirst({
    where: {
      id: journalId,
      OR: [{ uuid: userId }, { shared_with: { has: userId } }],
    },
    select: {
      id: true,
      uuid: true,
      shared_with: true,
    },
  });
}

// Journals
export async function fetchJournals(
  uid: string,
  options: {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'creator';
    sortDir?: 'asc' | 'desc';
  } = {}
): Promise<{ journals: Journal[]; totalCount: number }> {
  const {
    query = '',
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortDir = 'asc'
  } = options;

  try {
    const where = {
      AND: [
        { title: { contains: query, mode: "insensitive" as const } },
        { OR: [{ uuid: uid }, { shared_with: { has: uid } }] }
      ],
    };

    const totalCount = await prisma.journals.count({ where });

    // Determine orderBy structure
    let orderBy: Prisma.journalsOrderByWithRelationInput = { id: 'desc' };
    if (sortBy === 'name') {
      orderBy = { title: sortDir };
    } else if (sortBy === 'creator') {
      orderBy = { user: { name: sortDir } };
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const journals = await prisma.journals.findMany({
      where,
      orderBy,
      skip,
      take,
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

    const mappedJournals = journals.map((journal) => ({
      id: journal.id,
      uuid: journal.uuid,
      title: journal.title || '',
      shared_with: journal.shared_with,
      shared_with_names: journal.shared_with
        .filter((id) => id !== uid)
        .map((id) => userMap[id] || { id: id, name: 'Unknown', email: '' }),
      creator_name: userMap[journal.uuid]?.name || 'Unknown',
    }));

    return { journals: mappedJournals, totalCount };
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

    // Authorization check: user must be the creator or in the journal's shared_with list
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
      },
    });
    await createInvite(journal.id, shared_with, uid);
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
      },
    });
    // Create invites for new shared users
    await createInvite(id, shared_with, uuid);
    return journal.id;
  } catch (error) {
    console.error('Error editing journal:', error);
    throw error;
  }
}

// Invites
export async function fetchInvites(userId: string): Promise<JournalInvite[]> {
  try {
    const today = new Date();
    const invites = await prisma.journal_invites.findMany({
      where: {
        user_id: userId,
        status: 'pending',
        expires_at: {
          gte: today,
        }
      },
      include: {
        journals: {
          select: {
            title: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    });
    return invites;
  } catch (error) {
    console.error('Error fetching invites:', error);
    throw error;
  }
}

export async function createInvite(
  journal_id: number,
  user_ids: string[],
  invited_by: string,
) {
  try {
    const invites = user_ids.map((user_id) => {
      return {
        journal_id,
        user_id,
        invited_by,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    });
    const invite = await prisma.journal_invites.createMany({
      data: invites,
    });
    return invite;
  } catch (error) {
    console.error('Error creating invite:', error);
    throw error;
  }
}

export async function updateInvite(
  invite_id: number,
  user_id: string,
  journal_id: number,
  status: 'accepted' | 'declined'
): Promise<void> {
  try {
    const invite = await prisma.journal_invites.update({
      where: {
        id: invite_id,
        user_id: user_id
      },
      data: {
        status: status,
      },
    });
    
    if(invite.status === 'accepted') {
      await prisma.journals.update({
        where: {
          id: journal_id,
        },
        data: {
          shared_with: {
            push: invite.user_id,
          },
        },
      });
    }
  } catch (error) {
    console.error('Error accepting invite:', error);
    throw error;
  }
}

export async function removeInvite(invite_id: number): Promise<void> {
  try {
    await prisma.journal_invites.delete({
      where: {
        id: invite_id,
      },
    });
  } catch (error) {
    console.error('Error removing invite:', error);
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
        creator: '',
      };
    }

    // Authorization check: user must have access to the parent journal.
    if (userId) {
      const isJournalOwner = entry.journals.uuid === userId;
      const isSharedWith = entry.journals.shared_with.includes(userId);

      if (!isJournalOwner && !isSharedWith) {
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
  options: {
    query?: string;
    page?: number;
    limit?: number;
    sortBy?: 'name' | 'created' | 'modified';
    sortDir?: 'asc' | 'desc';
  } = {}
): Promise<{ entries: Entry[]; totalCount: number }> {
  const {
    query = '',
    page,
    limit,
    sortBy = 'modified',
    sortDir = 'desc'
  } = options;

  try {
    const parsedJournalId = parseInt(journal_id);

    if (userId) {
      const journal = await getAccessibleJournal(parsedJournalId, userId);
      if (!journal) {
        throw new Error('Unauthorized: You do not have access to this journal');
      }
    }

    const where = {
      journal_id: parsedJournalId,
      title: { contains: query, mode: 'insensitive' as const },
    };

    const totalCount = await prisma.journal_entries.count({ where });

    // Determine orderBy structure
    let orderBy: Prisma.journal_entriesOrderByWithRelationInput = { last_modified: 'desc' };
    if (sortBy === 'name') {
      orderBy = { title: sortDir };
    } else if (sortBy === 'created') {
      orderBy = { created_date: sortDir };
    } else if (sortBy === 'modified') {
      orderBy = { last_modified: sortDir };
    }

    const skip = page && limit ? (page - 1) * limit : undefined;
    const take = limit ?? undefined;

    const entries = await prisma.journal_entries.findMany({
      where,
      orderBy,
      ...(skip !== undefined ? { skip } : {}),
      ...(take !== undefined ? { take } : {}),
    });

    const mappedEntries = entries.map((entry) => ({
      id: entry.id,
      journal_id: entry.journal_id,
      title: entry.title || 'Untitled',
      content: entry.content || '',
      created_date: entry.created_date,
      last_modified: entry.last_modified,
      creator: entry.creator,
    }));

    return { entries: mappedEntries, totalCount };
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
      select: { id: true },
    });

    if (!journal) {
      throw new Error('Journal not found');
    }
    const entry = await prisma.journal_entries.create({
      data: {
        journal_id,
        title,
        content: '',
        created_date: new Date(),
        last_modified: new Date(),
        creator,
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
    const existingEntry = await prisma.journal_entries.findUnique({
      where: { id: entry_id },
      select: { journal_id: true },
    });

    if (!existingEntry) {
      throw new Error('Entry not found');
    }

    const journal = await getAccessibleJournal(existingEntry.journal_id, userId);
    if (!journal) {
      throw new Error('Unauthorized: You do not have access to this journal');
    }

    const entry = await prisma.journal_entries.update({
      where: {
        id: entry_id,
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
    const entry = await prisma.journal_entries.findUnique({
      where: { id: entry_id },
      select: { journal_id: true },
    });

    if (!entry) {
      throw new Error('Entry not found');
    }

    const journal = await getAccessibleJournal(entry.journal_id, userId);
    if (!journal) {
      throw new Error('Unauthorized: You do not have access to this journal');
    }

    const deletedEntry = await prisma.journal_entries.delete({
      where: {
        id: entry_id,
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
