import React from 'react';
import { CreateJournalForm } from '@/src/components/features/forms/journal-form';
import { auth } from '@/src/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function NewJournalPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  })
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
