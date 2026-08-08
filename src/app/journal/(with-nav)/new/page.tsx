import React from 'react';
import { CreateJournalForm } from '@/src/components/features/forms/journal-form';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New Journal',
  description: 'Create a new collaborative journal to start logging memories with your loved ones.',
  keywords: ['memou', 'new journal', 'collaborative journaling', 'free journal app', 'memories'],
  alternates: {
    canonical: 'https://memou.me/journal/new',
  },
};

export default async function NewJournalPage() {
  const session = await getSession();
  if (!session) {
    redirect('/signin');
  }
  return (
    <main style={{ padding: 24 }}>
      <header style={{ maxWidth: 720, margin: '0 auto 24px' }}>
        <h1 className="font-bold" style={{ margin: 0 }}>
          Create New Journal
        </h1>
      </header>

      <CreateJournalForm uuid={session.user.id} />
    </main>
  );
}
