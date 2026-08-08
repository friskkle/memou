import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const baseUrl = 'https://memou.me';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Memou | Save and Plan Memories Together',
    template: '%s | Memou',
  },
  description: 'Memou is a simple collaborative environment to log your memories and thoughts effortlessly with your loved ones. Completely free and secure.',
  keywords: ['memou', 'journal', 'collaborative journaling', 'free journal app', 'memories', 'secure diary', 'date planner'],
  authors: [{ name: 'Memou' }],
  creator: 'Memou',
  publisher: 'Memou',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Memou | Save and Plan Memories Together',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    url: baseUrl,
    siteName: 'Memou',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: 'Memou — Save and Plan Memories Together',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Memou | Save and Plan Memories Together',
    description: 'A completely free, minimalist environment to note your thoughts and ideas together, anywhere, anytime.',
    images: [`${baseUrl}/opengraph-image.png`],
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Memou',
              url: baseUrl,
              description: 'A simple collaborative environment to log your memories and thoughts effortlessly with your loved ones. Completely free and secure.',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${baseUrl}/journal?query={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Memou',
              url: baseUrl,
              description: 'A simple collaborative environment to log your memories and thoughts effortlessly with your loved ones.',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
