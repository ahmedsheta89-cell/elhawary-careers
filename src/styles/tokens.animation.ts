/**
 * Design System - Animation Tokens
 * Reusable animation presets for Framer Motion
 */

import type { AnimationVariants } from '@/types';

// Duration tokens (ms)
export const duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Easing functions
export const easing = {
  linear: [0, 0, 1, 1],
  easeIn: [0.4, 0, 1, 1],
  easeOut: [0, 0, 0.2, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

// Fade animations
export const fadeAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as AnimationVariants,
  
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  } as AnimationVariants,
  
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  } as AnimationVariants,
  
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  } as AnimationVariants,
  
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  } as AnimationVariants,
} as const;

// Slide animations
export const slideAnimations = {
  slideUp: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
  } as AnimationVariants,
  
  slideDown: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
  } as AnimationVariants,
  
  slideLeft: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  } as AnimationVariants,
  
  slideRight: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
  } as AnimationVariants,
} as const;

// Scale animations
export const scaleAnimations = {
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  } as AnimationVariants,
  
  scaleUp: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  } as AnimationVariants,
  
  popIn: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
    exit: { scale: 0.5, opacity: 0 },
  } as AnimationVariants,
} as const;

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: duration.normal / 1000,
    ease: easing.easeOut,
  },
} as const;

// Stagger container for list animations
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
} as const;

// Hover animations
export const hoverAnimations = {
  lift: {
    whileHover: { y: -4, transition: { duration: duration.fast / 1000 } },
    whileTap: { y: -2 },
  },
  
  glow: {
    whileHover: { 
      boxShadow: '0 0 20px rgba(37, 99, 235, 0.5)',
      transition: { duration: duration.fast / 1000 },
    },
  },
  
  expand: {
    whileHover: { scale: 1.02, transition: { duration: duration.fast / 1000 } },
  },
} as const;

// Loading animations
export const loadingAnimations = {
  pulse: {
    animate: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: duration.slow / 1000,
        repeat: Infinity,
        ease: easing.easeInOut,
      },
    },
  },
  
  shimmer: {
    animate: {
      backgroundPosition: ['200% 0', '-200% 0'],
      transition: {
        duration: duration.slower / 1000,
        repeat: Infinity,
        ease: easing.linear,
      },
    },
  },
} as const;

// Common transition configurations
export const transitions = {
  default: {
    duration: duration.normal / 1000,
    ease: easing.easeInOut,
  },
  fast: {
    duration: duration.fast / 1000,
    ease: easing.easeInOut,
  },
  slow: {
    duration: duration.slow / 1000,
    ease: easing.easeInOut,
  },
  spring: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
  },
  springGentle: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 15,
  },
} as const;

export type Duration = typeof duration;
export type Easing = typeof easing;
