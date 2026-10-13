'use client';

import * as React from 'react';
import { cn } from '@/config';

export type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
  selectClassName?: string;
};

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  className,
  selectClassName,
}: SelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className='text-sm font-medium text-foreground/80'
        >
          {label}
        </label>
      ) : null}
      <div className='relative'>
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'h-10 w-full min-h-10 appearance-none rounded-md border border-foreground/15 bg-background py-2 pl-3 pr-9 text-sm text-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
            selectClassName,
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          className='pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/50'
          aria-hidden
        >
          <path
            fillRule='evenodd'
            d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z'
            clipRule='evenodd'
          />
        </svg>
      </div>
    </div>
  );
}
