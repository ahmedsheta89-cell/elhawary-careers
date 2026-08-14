/**
 * Type definitions for El Hawary Careers platform
 */

// Base types
export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

// Job related types
import type {
  JOB_CATEGORIES,
  JOB_TYPES,
  EXPERIENCE_LEVELS,
  EDUCATION_LEVELS,
  APPLICATION_STATUS,
} from '@/constants';

export type JobCategory = (typeof JOB_CATEGORIES)[number];
export type JobType = (typeof JOB_TYPES)[number];
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];
export type EducationLevel = (typeof EDUCATION_LEVELS)[number];
export type ApplicationStatus =
  (typeof APPLICATION_STATUS)[keyof typeof APPLICATION_STATUS];

// Location
export interface Location {
  city: string;
  governorate: string;
  address?: string;
}

// Job Interface
export interface Job {
  id: string;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  requirements: {
    ar: string[];
    en: string[];
  };
  responsibilities: {
    ar: string[];
    en: string[];
  };
  category: JobCategory;
  type: JobType;
  experienceLevel: ExperienceLevel;
  educationLevel: EducationLevel;
  location: Location;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
    period: 'monthly' | 'yearly';
  };
  benefits: string[];
  postedDate: string;
  expiryDate: string;
  isActive: boolean;
  applicationCount: number;
}

// Application Interface
export interface Application {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  education: EducationHistory[];
  experience: WorkExperience[];
  skills: string[];
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
}

export interface EducationHistory {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: number;
  gpa?: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

// User/Profile types
export interface UserProfile {
  id: string;
  firstName: {
    ar: string;
    en: string;
  };
  lastName: {
    ar: string;
    en: string;
  };
  email: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Form types
export interface ApplyFormValues {
  fullName: string;
  email: string;
  phone: string;
  resume: FileList;
  coverLetter?: string;
  education: EducationHistory[];
  experience: WorkExperience[];
  skills: string[];
  linkedInUrl?: string;
  portfolioUrl?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

// UI Component types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface SelectOption {
  value: string;
  label: {
    ar: string;
    en: string;
  };
}

export interface SelectProps extends BaseComponentProps {
  label?: string;
  options: SelectOption[];
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

// Navigation types
export interface NavItem {
  key: string;
  path: string;
  labelAr: string;
  labelEn: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Theme types
export type ThemeColor =
  'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// Animation types
import type { Variants } from 'framer-motion';
export type AnimationVariants = Variants;
