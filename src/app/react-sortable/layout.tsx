import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'React Sortable',
  description: 'Self-Learning Nextjs',
};

export default function ReactSortableLayout({
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
