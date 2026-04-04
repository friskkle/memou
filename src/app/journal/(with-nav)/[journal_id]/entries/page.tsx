import React from 'react';
import { getSession } from '@/src/lib/auth';
import { redirect } from 'next/navigation';

const Entries = async (): Promise<React.ReactElement> => {
  const session = await getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-4 mt-2 relative">
      <span className="flex flex-col mb-4">
        <p className="text-3xl font-bold">Entries</p>
        <p className="text-lg text-stone-600 mt-2">Hey {session.user.name}, you&apos;ve discovered a new page! Entries will move here soon!</p>
      </span>
    </div>
  );
};

export default Entries;
