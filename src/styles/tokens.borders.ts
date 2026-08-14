/**
 * Design System - Border & Shadow Tokens
 */

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  default: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const borderWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

export const boxShadow = {
  // Elevation levels for modern healthcare theme
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  default:
    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',

  // Colored shadows for semantic states
  primary: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
  secondary: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
  success: '0 4px 14px 0 rgba(34, 197, 94, 0.39)',
  warning: '0 4px 14px 0 rgba(245, 158, 11, 0.39)',
  danger: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
  info: '0 4px 14px 0 rgba(6, 182, 212, 0.39)',
} as const;

export const ringColor = {
  primary: '#2563EB',
  secondary: '#22C55E',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
} as const;

export const ringWidth = {
  0: '0',
  1: '1px',
  2: '2px',
  4: '4px',
  8: '8px',
} as const;

export type BorderRadius = typeof borderRadius;
export type BoxShadow = typeof boxShadow;
