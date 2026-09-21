import type { Metadata } from 'next';
import './globals.scss';
import { icons } from '@/assets/icons';
import { SiteHeader, ThemeProvider } from '@/component';

export const metadata: Metadata = {
  title: 'Badminton Shop',
  description: 'Self-Learning Nextjs',
  icons: icons.shuttlecock,
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <div className='h-[calc(100vh-57px)]'>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
