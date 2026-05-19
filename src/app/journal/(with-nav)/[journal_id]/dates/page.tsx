export const dynamic = 'force-dynamic';

import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/src/lib/auth';
import { fetchDateIdeas } from '@/src/lib/date-ideas';
import { DateIdeaStatus } from '@/src/lib/definitions';
import { DatePlannerClient } from '@/src/components/features/date-ideas/date-planner-client';

const validStatuses = new Set(['all', 'idea', 'planned', 'completed']);

const DatePlannerPage = async (props: {
  params: Promise<{ journal_id: string }>;
  searchParams?: Promise<{
    category?: string;
    budget?: string;
    status?: string;
  }>;
}): Promise<React.ReactElement> => {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  const { journal_id } = await props.params;
  const searchParams = await props.searchParams;
  const status = validStatuses.has(searchParams?.status || '')
    ? (searchParams?.status as DateIdeaStatus | 'all')
    : 'all';
  const filters = {
    category: searchParams?.category,
    budget: searchParams?.budget,
    status,
  };
  const ideas = await fetchDateIdeas(Number(journal_id), session.user.id, filters);

  return <DatePlannerClient journalId={Number(journal_id)} ideas={ideas} filters={filters} />;
};

export default DatePlannerPage;
