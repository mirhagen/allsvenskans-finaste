import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Allsvenskans Finaste',
  description: '16 troner. 16 klubbar. Vem regerar din?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className={`${inter.variable} bg-[#0c0f1a] text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
