/**
 * Application Constants
 * Centralized configuration values used across the application
 */

// Artifact Categories
export const ARTIFACT_CATEGORIES = [
  'Senjata Tradisional',
  'Tekstil',
  'Alat Musik',
  'Perhiasan',
  'Kerajinan Tangan',
  'Upacara Adat',
  'Peralatan Dapur',
  'Lainnya'
] as const;

export type ArtifactCategory = typeof ARTIFACT_CATEGORIES[number];

// Validation Rules
export const VALIDATION = {
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 6,
  DESCRIPTION_MIN_LENGTH: 10,
  NAME_MIN_LENGTH: 3,
  YEAR_MIN: 1000,
  YEAR_MAX: new Date().getFullYear(),
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

// Toast Auto-close Duration (milliseconds)
export const TOAST_DURATION = 3000;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: {
    CREATED: 'Data created successfully',
    UPDATED: 'Data updated successfully',
    DELETED: 'Data deleted successfully',
  },
  ERROR: {
    UNAUTHORIZED: 'Unauthorized - Please login',
    NOT_FOUND: 'Data not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    MISSING_FIELDS: 'Required fields are missing',
  },
} as const;
