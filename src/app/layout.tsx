import type { Metadata } from 'next';
import './globals.scss';
import { icons } from '@/assets/icons';

export const metadata: Metadata = {
  title: 'Badminton Shop',
  description: 'Self-Learning Nextjs',
  icons: icons.shuttlecock,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
