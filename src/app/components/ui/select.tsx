/**
 * Select Component
 * Reusable select dropdown with label, error, and hint support
 */

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      required = false,
      disabled = false,
      options = [],
      placeholder,
      leftIcon,
      id: propId,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = propId || generatedId;
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className={cn(
              'text-text-primary mb-2 block text-sm font-medium',
              error && 'text-danger-500'
            )}
          >
            {label}
            {required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="text-text-muted pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
              {leftIcon}
            </div>
          )}

          <select
            id={id}
            ref={ref}
            className={cn(
              'border-border-default text-text-primary flex h-11 w-full appearance-none rounded-lg border bg-white px-4 py-2 pr-10 text-base',
              'placeholder:text-text-muted/70',
              'focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50',
              'transition-all duration-200',
              error && 'border-danger-500 focus-visible:ring-danger-500',
              leftIcon && 'pl-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            disabled={disabled}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {children}
          </select>

          {/* Custom arrow icon */}
          <div className="text-text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {error && (
          <p
            id={errorId}
            className="mt-2 flex items-center gap-1 text-sm text-danger-500"
            role="alert"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="text-text-muted mt-2 text-sm">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
