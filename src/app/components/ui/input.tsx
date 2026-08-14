/**
 * Input Component
 * Reusable form input with label, error, and hint support
 */

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      error,
      hint,
      required = false,
      disabled = false,
      leftIcon,
      rightIcon,
      id: propId,
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
            <div className="text-text-muted pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}

          <input
            id={id}
            type={type}
            ref={ref}
            className={cn(
              'border-border-default text-text-primary flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-base',
              'placeholder:text-text-muted/70',
              'focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50',
              'transition-all duration-200',
              error && 'border-danger-500 focus-visible:ring-danger-500',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="text-text-muted pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      required = false,
      disabled = false,
      id: propId,
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

        <textarea
          id={id}
          ref={ref}
          className={cn(
            'border-border-default text-text-primary flex min-h-[120px] w-full rounded-lg border bg-white px-4 py-3 text-base',
            'placeholder:text-text-muted/70',
            'focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50',
            'resize-y transition-all duration-200',
            error && 'border-danger-500 focus-visible:ring-danger-500',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          disabled={disabled}
          {...props}
        />

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

Textarea.displayName = 'Textarea';

export { Input, Textarea };
