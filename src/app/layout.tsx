import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';
import './globals.scss';
import { icons } from '@/assets/icons';
import { SiteHeader, ThemeProvider } from '@/component';

const notoSans = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const siteDescription =
  'Học tên Pokémon tiếng Nhật: nghĩa, phiên âm, và nghe đọc.';

export const metadata: Metadata = {
  title: {
    default: 'Pokemon',
    template: '%s | Pokemon',
  },
  description: siteDescription,
  icons: {
    icon: icons.pokeball,
  },
  openGraph: {
    title: 'Pokemon',
    description: siteDescription,
    type: 'website',
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='vi' className={notoSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${notoSans.className} font-sans antialiased`}>
        <ThemeProvider>
          <SiteHeader />
          <div className='min-h-[calc(100dvh-57px)] overflow-auto'>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
