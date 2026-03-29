import { Metadata } from 'next';
import { HomeClient } from './home-client';

export const metadata: Metadata = {
  title: 'Memou | Your Personal Collaborative Journal',
  description: 'Memou provides a simple collaborative environment to log your memories and thoughts effortlessly with your loved ones. Completely free and secure.',
  keywords: ['journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary'],
  openGraph: {
    title: 'Memou | Your Collaborative Mental Space',
    description: 'A completely free, minimalist environment to capture thoughts, ideas, and memories seamlessly.',
    type: 'website',
  }
};

export default function Home() {
  return <HomeClient />;
}