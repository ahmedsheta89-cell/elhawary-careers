/**
 * Design System - Main Styles Index
 * Exports all design tokens for easy import
 */

// Color tokens
export { colors } from './tokens.colors';
export type { Colors } from './tokens.colors';

// Spacing & Sizing tokens
export { spacing, sizing } from './tokens.spacing';
export type { Spacing, Sizing } from './tokens.spacing';

// Typography tokens
export { fontFamily, fontSize, fontWeight, letterSpacing, lineHeight, headings, bodyText } from './tokens.typography';
export type { FontFamily, FontSize, FontWeight } from './tokens.typography';

// Border & Shadow tokens
export { borderRadius, borderWidth, boxShadow, ringColor, ringWidth } from './tokens.borders';
export type { BorderRadius, BoxShadow } from './tokens.borders';

// Animation tokens
export { 
  duration, 
  easing, 
  fadeAnimations, 
  slideAnimations, 
  scaleAnimations, 
  pageTransition,
  staggerContainer,
  hoverAnimations,
  loadingAnimations,
  transitions,
} from './tokens.animation';
export type { Duration, Easing } from './tokens.animation';

// Combined design system export
export const designTokens = {
  colors,
  spacing,
  sizing,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  headings,
  bodyText,
  borderRadius,
  borderWidth,
  boxShadow,
  ringColor,
  ringWidth,
  duration,
  easing,
  fadeAnimations,
  slideAnimations,
  scaleAnimations,
  pageTransition,
  staggerContainer,
  hoverAnimations,
  loadingAnimations,
  transitions,
} as const;
