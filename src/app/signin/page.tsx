import BackButton from '@/src/components/elements/back';
import { AuthForm } from '@/src/components/features/forms/auth-form';
import { getSession } from '@/src/lib/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Memou | Sign in',
  description: 'Sign in to your Memou account to access your journals.',
  keywords: ['memou', 'signin', 'journal', 'memories', 'secure diary'],
  openGraph: {
    title: 'Memou | Sign in',
    description: 'Sign in to your Memou account to access your journals.',
    type: 'website',
  }
};

export default async function Signin() {
  const session = await getSession();
  if (session) {
    redirect('/journal');
  }
  return (
    <div className="flex-1 font-sans grid grid-rows-[20px_1fr_20px] gap-16">
      <main className="flex flex-col gap-8 p-4">
        <div>
          <BackButton />
        </div>
        <div className="flex flex-col gap-8 items-center">
          <h1 className="font-serif text-3xl font-medium text-center">
            Enter your account to begin
          </h1>
          <AuthForm />
        </div>
      </main>
    </div>
  );
}
