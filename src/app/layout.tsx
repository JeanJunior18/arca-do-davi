import type { Metadata } from 'next';
import { Caveat, Fraunces, Nunito } from 'next/font/google';

import './globals.css';

const fraunces = Fraunces({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
});

const caveat = Caveat({
  variable: '--font-script',
  subsets: ['latin'],
  weight: ['600', '700'],
});

const nunito = Nunito({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const siteUrl = 'https://arca-do-davi.asherlabs.com.br';
const title = 'Arca do Davi — 1 aninho';
const description = 'Convite e confirmação de presença pro aniversário de 1 ano do Davi.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Arca do Davi',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: '/hero-davi.jpg', width: 3024, height: 2833, alt: 'Davi' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/hero-davi.jpg'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${caveat.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-body text-ink">{children}</body>
    </html>
  );
}
