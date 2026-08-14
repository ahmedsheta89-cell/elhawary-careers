/**
 * Application Configuration
 * Centralized configuration for the El Hawary Careers platform
 */

export const config = {
  // Application
  appName: 'El Hawary Careers',
  appTagline: 'صيدلية الهواري',

  // Branding
  brand: {
    name: 'El Hawary Pharmacy',
    arabicName: 'صيدلية الهواري',
    logo: '/assets/logo.svg',
  },

  // Locale
  locale: {
    default: 'ar',
    supported: ['ar', 'en'],
    rtl: ['ar'],
  },

  // Country
  country: 'Egypt',
  countryCode: 'EG',
  currency: 'EGP',

  // API (placeholder for future backend integration)
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: 30000,
  },

  // Feature flags
  features: {
    enableEnglish: true,
    enableNotifications: false,
    enableAnalytics: false,
  },

  // Contact
  contact: {
    email: 'careers@elhawarypharmacy.com',
    phone: '+20 123 456 7890',
  },
} as const;

export type Config = typeof config;
