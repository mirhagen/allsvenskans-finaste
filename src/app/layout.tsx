import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Allsvenskans Finaste',
  description: '18 troner. 18 klubbar. Ingen vinner för sig själv.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
