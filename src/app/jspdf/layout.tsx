import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JS PDF',
  description: 'Self-Learning Nextjs',
};

export default function JSPDFLayout({
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
