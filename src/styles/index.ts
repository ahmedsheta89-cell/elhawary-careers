import { colors } from './tokens.colors';
import { spacing, sizing } from './tokens.spacing';
import {
  bodyText,
  fontFamily,
  fontSize,
  fontWeight,
  headings,
  letterSpacing,
  lineHeight,
} from './tokens.typography';
import {
  borderRadius,
  borderWidth,
  boxShadow,
  ringColor,
  ringWidth,
} from './tokens.borders';
import {
  duration,
  easing,
  fadeAnimations,
  hoverAnimations,
  loadingAnimations,
  pageTransition,
  scaleAnimations,
  slideAnimations,
  staggerContainer,
  transitions,
} from './tokens.animation';

export { colors };
export type { Colors } from './tokens.colors';
export { spacing, sizing };
export type { Spacing, Sizing } from './tokens.spacing';
export {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  headings,
  bodyText,
};
export type { FontFamily, FontSize, FontWeight } from './tokens.typography';
export { borderRadius, borderWidth, boxShadow, ringColor, ringWidth };
export type { BorderRadius, BoxShadow } from './tokens.borders';
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
};
export type { Duration, Easing } from './tokens.animation';

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
