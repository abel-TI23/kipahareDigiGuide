/**
 * Tipahare DigiGuide - TypeScript Type Definitions
 * Complete type system for museum artifact management
 */

// ============================================
// DATABASE MODELS
// ============================================

/**
 * Artifact entity representing museum artifacts
 */
export interface Artifact {
  id: number;
  name: string;
  category: string;
  origin: string;
  year: string;
  description: string;
  image_url: string | null;
  audio_url: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Input type for creating new artifacts
 */
export interface CreateArtifactInput {
  name: string;
  category: string;
  origin: string;
  year: string;
  description: string;
  image_url?: string;
  audio_url?: string;
}

/**
 * Input type for updating artifacts
 */
export interface UpdateArtifactInput {
  name?: string;
  category?: string;
  origin?: string;
  year?: string;
  description?: string;
  image_url?: string;
  audio_url?: string;
}

/**
 * QR Code entity linking to artifacts
 */
export interface QRCode {
  id: number;
  artifact_id: number;
  unique_code: string;
  qr_image_url: string;
  created_at: Date;
}

/**
 * Input type for creating QR codes
 */
export interface CreateQRCodeInput {
  artifact_id: number;
  unique_code: string;
  qr_image_url: string;
}

/**
 * Visitor feedback entity
 */
export interface Feedback {
  id: number;
  artifact_id: number;
  visitor_name: string | null;
  rating: number; // 1-5
  comment: string | null;
  created_at: Date;
}

/**
 * Input type for submitting feedback
 */
export interface CreateFeedbackInput {
  artifact_id: number;
  visitor_name?: string;
  rating: number;
  comment?: string;
}

/**
 * Admin user entity
 */
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  email: string;
  created_at: Date;
}

/**
 * Admin login credentials
 */
export interface AdminLoginInput {
  username: string;
  password: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Generic API success response
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic API error response
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * Combined API response type
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

/**
 * Artifact card component props
 */
export interface ArtifactCardProps {
  artifact: Artifact;
  onEdit?: (artifact: Artifact) => void;
  onDelete?: (id: number) => void;
  showActions?: boolean;
}

/**
 * QR Scanner component props
 */
export interface QRScannerProps {
  onScanSuccess: (code: string) => void;
  onScanError?: (error: string) => void;
  isScanning?: boolean;
}

/**
 * Feedback form component props
 */
export interface FeedbackFormProps {
  artifactId: number;
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: string) => void;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * File upload result
 */
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Camera permission status
 */
export type CameraPermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

/**
 * Loading state for async operations
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Form validation error
 */
export interface FormError {
  field: string;
  message: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalArtifacts: number;
  totalScans: number;
  averageRating: number;
  totalFeedback: number;
  recentArtifacts: Artifact[];
  recentFeedback: Feedback[];
}

// ============================================
// NEXTAUTH TYPES
// ============================================

/**
 * Extended NextAuth session type
 */
export interface SessionUser {
  id: number;
  username: string;
  email: string;
}

/**
 * NextAuth credentials
 */
export interface AuthCredentials {
  username: string;
  password: string;
}

// ============================================
// CONSTANTS & ENUMS
// ============================================

/**
 * Artifact categories
 */
export enum ArtifactCategory {
  CERAMIC = 'Ceramic',
  TEXTILE = 'Textile',
  SCULPTURE = 'Sculpture',
  PAINTING = 'Painting',
  JEWELRY = 'Jewelry',
  WEAPON = 'Weapon',
  TOOL = 'Tool',
  MANUSCRIPT = 'Manuscript',
  OTHER = 'Other',
}

/**
 * File upload constraints
 */
export const FILE_CONSTRAINTS = {
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_AUDIO_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/mp3', 'audio/wav'],
} as const;

/**
 * Validation regex patterns
 */
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  YEAR: /^\d{4}$/,
} as const;
