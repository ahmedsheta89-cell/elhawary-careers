/**
 * Application Constants
 * Centralized constants for the El Hawary Careers platform
 */

// Route paths
export const ROUTES = {
  HOME: '/',
  CAREERS: '/careers',
  JOB_DETAILS: '/jobs/:id',
  APPLY: '/apply/:id',
  BENEFITS: '/benefits',
  ABOUT: '/about',
  CONTACT: '/contact',
  NOT_FOUND: '*',
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  { key: 'home', path: ROUTES.HOME, labelAr: 'الرئيسية', labelEn: 'Home' },
  {
    key: 'careers',
    path: ROUTES.CAREERS,
    labelAr: 'الوظائف',
    labelEn: 'Careers',
  },
  {
    key: 'benefits',
    path: ROUTES.BENEFITS,
    labelAr: 'المزايا',
    labelEn: 'Benefits',
  },
  { key: 'about', path: ROUTES.ABOUT, labelAr: 'من نحن', labelEn: 'About' },
  {
    key: 'contact',
    path: ROUTES.CONTACT,
    labelAr: 'اتصل بنا',
    labelEn: 'Contact',
  },
] as const;

// Job categories
export const JOB_CATEGORIES = [
  'pharmacist',
  'assistant_pharmacist',
  'store_manager',
  'sales_representative',
  'inventory_specialist',
  'customer_service',
  'administration',
] as const;

// Job types
export const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
] as const;

// Experience levels
export const EXPERIENCE_LEVELS = ['entry', 'mid', 'senior', 'lead'] as const;

// Education levels
export const EDUCATION_LEVELS = [
  'high_school',
  'diploma',
  'bachelor',
  'master',
  'phd',
] as const;

// Application status
export const APPLICATION_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  INTERVIEW: 'interview',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
} as const;

// File upload limits
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

// Animation durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Breakpoints (Tailwind CSS default)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Z-index layers
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  MODAL: 30,
  POPOVER: 40,
  TOAST: 50,
} as const;
