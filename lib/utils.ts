/**
 * Ki Pahare DigiGuide - Utility Functions
 * Common helper functions for the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FormError, VALIDATION_PATTERNS, FILE_CONSTRAINTS } from '@/types';

// ============================================
// STYLING UTILITIES
// ============================================

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email);
}

/**
 * Validate username format
 */
export function isValidUsername(username: string): boolean {
  return VALIDATION_PATTERNS.USERNAME.test(username);
}

/**
 * Validate year format
 */
export function isValidYear(year: string): boolean {
  return VALIDATION_PATTERNS.YEAR.test(year);
}

/**
 * Validate rating (1-5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}

/**
 * Validate form fields and return errors
 */
export function validateArtifactForm(data: {
  name: string;
  category: string;
  origin: string;
  year: string;
  description: string;
}): FormError[] {
  const errors: FormError[] = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Name must be at least 3 characters' });
  }

  if (!data.category || data.category.trim().length < 2) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (!data.origin || data.origin.trim().length < 2) {
    errors.push({ field: 'origin', message: 'Origin is required' });
  }

  if (!data.year || !isValidYear(data.year)) {
    errors.push({ field: 'year', message: 'Valid 4-digit year is required' });
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.push({ field: 'description', message: 'Description must be at least 10 characters' });
  }

  return errors;
}

// ============================================
// FILE UTILITIES
// ============================================

/**
 * Validate image file
 */
export function isValidImage(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_CONSTRAINTS.MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image size must be less than 5MB' };
  }

  if (!FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Only JPEG, PNG, and WebP images are allowed' };
  }

  return { valid: true };
}

/**
 * Validate audio file
 */
export function isValidAudio(file: File): { valid: boolean; error?: string } {
  if (file.size > FILE_CONSTRAINTS.MAX_AUDIO_SIZE) {
    return { valid: false, error: 'Audio size must be less than 10MB' };
  }

  if (!FILE_CONSTRAINTS.ALLOWED_AUDIO_TYPES.includes(file.type as any)) {
    return { valid: false, error: 'Only MP3 and WAV audio files are allowed' };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Generate safe filename
 */
export function generateSafeFilename(originalName: string): string {
  const timestamp = Date.now();
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  return `${timestamp}-${sanitized}`;
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Generate slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(d);
}

// ============================================
// QR CODE UTILITIES
// ============================================

/**
 * Generate unique QR code identifier
 */
export function generateQRCode(artifactId: number): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  
  return `KI_PAHARE-${artifactId}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Extract artifact ID from QR code
}

/**
 * Parse QR code to extract artifact ID
 */
export function parseQRCode(code: string): number | null {
  const match = code.match(/KI_PAHARE-(\d+)-/);
  return match ? parseInt(match[1]) : null;
}

/**
 * Validates QR code format
 */
export function isValidQRCode(code: string): boolean {
  return /^KI_PAHARE-\d+-\d+-[A-Z0-9]+$/.test(code);
}

// ============================================
// ERROR HANDLING UTILITIES
// ============================================

/**
 * Extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

/**
 * Create standardized API error response
 */
export function createErrorResponse(error: unknown, statusCode: number = 500) {
  return {
    success: false,
    error: getErrorMessage(error),
    message: 'An error occurred while processing your request',
    statusCode,
  };
}

/**
 * Create standardized API success response
 */
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

// ============================================
// MOBILE DETECTION
// ============================================

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Check if device supports camera
 */
export async function checkCameraSupport(): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices) {
    return false;
  }
  
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch {
    return false;
  }
}

// ============================================
// PERFORMANCE UTILITIES
// ============================================

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Sleep/delay utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
