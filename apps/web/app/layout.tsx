import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CompetitionCare',
  description: 'Your trusted platform for competitive exam preparation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

