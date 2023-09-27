import './globals.css';
import { Providers } from '@/helpers/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Wing Vault',
  description: 'Wing Vault stores and manages all your passwords securely!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {' '}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
