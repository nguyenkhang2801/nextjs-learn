'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/config';
import { useTheme } from '@/component/ThemeProvider';

export function SiteHeader() {
  const { theme, toggleTheme, mounted } = useTheme();
  const pathname = usePathname();

  return (
    <header className='sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6'>
        <Link
          href='/'
          className='text-lg font-semibold tracking-tight text-foreground hover:opacity-80'
        >
          Pokemon
        </Link>
        <nav className='flex items-center gap-2 sm:gap-3'>
          <Link
            href='/name'
            className={cn(
              'inline-flex min-h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors',
              'hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
              pathname === '/name'
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground/80',
            )}
          >
            Danh sách
          </Link>
          <button
            type='button'
            onClick={toggleTheme}
            className={cn(
              'inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-foreground/15 px-3 text-sm font-medium transition-colors',
              'hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
            )}
            aria-label={
              mounted
                ? theme === 'dark'
                  ? 'Switch to light theme'
                  : 'Switch to dark theme'
                : 'Toggle theme'
            }
          >
            {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
          </button>
        </nav>
      </div>
    </header>
  );
}
