/**
 * Utility function to merge Tailwind CSS classes with cn (classnames) support
 * Combines clsx for conditional classes and tailwind-merge for conflict resolution
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
