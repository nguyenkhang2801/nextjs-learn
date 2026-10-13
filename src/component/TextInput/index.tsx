'use client';

import * as React from 'react';
import { cn } from '@/config';

type TextInputProps = Omit<React.ComponentProps<'input'>, 'value'> & {
  label?: string;
  containerClassName?: string;
  normalizeValue?: (value: string) => string;
};

export function TextInput({
  id,
  label,
  className,
  containerClassName,
  type = 'text',
  onChange,
  normalizeValue,
  ...props
}: TextInputProps) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;
    const raw = e.target.value ?? '';
    const next = normalizeValue ? normalizeValue(raw) : raw;
    if (next === raw) {
      onChange(e);
      return;
    }
    onChange({
      ...e,
      target: { ...e.target, value: next },
      currentTarget: { ...e.currentTarget, value: next },
    });
  };

  return (
    <div className={cn('flex w-full flex-col gap-1.5', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className='text-sm font-medium text-foreground/80'
        >
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type={type}
        onChange={handleChange}
        className={cn(
          'h-10 w-full min-h-10 rounded-md border border-foreground/15 bg-background px-3 text-sm text-foreground',
          'placeholder:text-foreground/45',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30',
          className,
        )}
        {...props}
      />
    </div>
  );
}
