'use server';

import { prisma } from './prisma';
import { DateIdea, DateIdeaStatus, DateIdeaSummary } from './definitions';

type AccessibleJournal = {
  id: number;
  uuid: string;
  shared_with: string[];
};

async function getAccessibleJournal(
  journalId: number,
  userId: string,
): Promise<AccessibleJournal | null> {
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

function toDateIdea(
  idea: {
    id: number;
    journal_id: number;
    title: string;
    description: string | null;
    category: string;
    budget: string;
    added_by: string;
    created_at: Date;
    status: DateIdeaStatus;
    planned_at: Date | null;
    completed_at: Date | null;
    completed_note: string | null;
    user?: { name: string } | null;
  },
): DateIdea {
  return {
    id: idea.id,
    journal_id: idea.journal_id,
    title: idea.title,
    description: idea.description,
    category: idea.category,
    budget: idea.budget,
    added_by: idea.added_by,
    added_by_name: idea.user?.name || 'Someone',
    created_at: idea.created_at,
    status: idea.status,
    planned_at: idea.planned_at,
    completed_at: idea.completed_at,
    completed_note: idea.completed_note,
  };
}

export async function fetchDateIdeas(
  journalId: number,
  userId: string,
  filters: {
    category?: string;
    budget?: string;
    status?: DateIdeaStatus | 'all';
  } = {},
): Promise<DateIdea[]> {
  const journal = await getAccessibleJournal(journalId, userId);
  if (!journal) {
    throw new Error('Unauthorized: You do not have access to this journal');
  }

  const ideas = await prisma.date_ideas.findMany({
    where: {
      journal_id: journalId,
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.budget ? { budget: filters.budget } : {}),
      ...(filters.status && filters.status !== 'all' ? { status: filters.status } : {}),
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
    orderBy: [
      { status: 'asc' },
      { planned_at: 'desc' },
      { created_at: 'desc' },
    ],
  });

  return ideas.map(toDateIdea);
}

export async function fetchDateIdeaSummary(
  journalId: number,
  userId: string,
): Promise<DateIdeaSummary> {
  const ideas = await fetchDateIdeas(journalId, userId);

  return {
    idea: ideas.filter((idea) => idea.status === 'idea').length,
    planned: ideas.filter((idea) => idea.status === 'planned').length,
    completed: ideas.filter((idea) => idea.status === 'completed').length,
    plannedIdea: ideas.find((idea) => idea.status === 'planned') || null,
  };
}

export async function createDateIdeaRecord(
  journalId: number,
  userId: string,
  data: {
    title: string;
    description?: string | null;
    category: string;
    budget: string;
  },
): Promise<DateIdea> {
  const journal = await getAccessibleJournal(journalId, userId);
  if (!journal) {
    throw new Error('Unauthorized: You do not have access to this journal');
  }

  const idea = await prisma.date_ideas.create({
    data: {
      journal_id: journalId,
      title: data.title,
      description: data.description || null,
      category: data.category,
      budget: data.budget,
      added_by: userId,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return toDateIdea(idea);
}

export async function updateDateIdeaRecord(
  ideaId: number,
  userId: string,
  data: {
    title: string;
    description?: string | null;
    category: string;
    budget: string;
  },
): Promise<DateIdea> {
  const existingIdea = await prisma.date_ideas.findUnique({
    where: { id: ideaId },
    select: { journal_id: true },
  });

  if (!existingIdea) {
    throw new Error('Date idea not found');
  }

  const journal = await getAccessibleJournal(existingIdea.journal_id, userId);
  if (!journal) {
    throw new Error('Unauthorized: You do not have access to this journal');
  }

  const idea = await prisma.date_ideas.update({
    where: { id: ideaId },
    data: {
      title: data.title,
      description: data.description || null,
      category: data.category,
      budget: data.budget,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return toDateIdea(idea);
}

export async function setDateIdeaStatus(
  ideaId: number,
  userId: string,
  status: DateIdeaStatus,
  completedNote?: string | null,
): Promise<DateIdea> {
  const existingIdea = await prisma.date_ideas.findUnique({
    where: { id: ideaId },
    select: { journal_id: true },
  });

  if (!existingIdea) {
    throw new Error('Date idea not found');
  }

  const journal = await getAccessibleJournal(existingIdea.journal_id, userId);
  if (!journal) {
    throw new Error('Unauthorized: You do not have access to this journal');
  }

  const now = new Date();
  const idea = await prisma.date_ideas.update({
    where: { id: ideaId },
    data: {
      status,
      planned_at: status === 'planned' ? now : null,
      completed_at: status === 'completed' ? now : null,
      completed_note: status === 'completed' ? completedNote || null : null,
    },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  return toDateIdea(idea);
}

export async function deleteDateIdeaRecord(
  ideaId: number,
  userId: string,
): Promise<number> {
  const existingIdea = await prisma.date_ideas.findUnique({
    where: { id: ideaId },
    select: { journal_id: true },
  });

  if (!existingIdea) {
    throw new Error('Date idea not found');
  }

  const journal = await getAccessibleJournal(existingIdea.journal_id, userId);
  if (!journal) {
    throw new Error('Unauthorized: You do not have access to this journal');
  }

  const deletedIdea = await prisma.date_ideas.delete({
    where: { id: ideaId },
    select: { journal_id: true },
  });

  return deletedIdea.journal_id;
}
