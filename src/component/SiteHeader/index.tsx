'use client';

import Link from 'next/link';
import { cn } from '@/config';
import { useTheme } from '@/component/ThemeProvider';

export function SiteHeader() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className='sticky top-0 z-50 border-b border-foreground/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          href='/'
          className='text-lg font-semibold tracking-tight text-foreground hover:opacity-80'
        >
          Badminton Shop
        </Link>
        <button
          type='button'
          onClick={toggleTheme}
          className={cn(
            'inline-flex h-9 items-center justify-center rounded-md border border-foreground/15 px-3 text-sm font-medium transition-colors',
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
      </div>
    </header>
  );
}
