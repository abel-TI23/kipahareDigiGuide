/**
 * Kipahare DigiGuide - Database Configuration
 * Vercel Postgres connection and query utilities
 */

import { sql } from '@vercel/postgres';

// ============================================
// DATABASE CONNECTION
// ============================================

/**
 * Initialize database tables
 * Run this once to set up the schema
 */
export async function initializeDatabase() {
  try {
    // Create artifacts table
    await sql`
      CREATE TABLE IF NOT EXISTS artifacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        year VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(500),
        audio_url VARCHAR(500),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create QR codes table
    await sql`
      CREATE TABLE IF NOT EXISTS qr_codes (
        id SERIAL PRIMARY KEY,
        artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
        unique_code VARCHAR(255) UNIQUE NOT NULL,
        qr_image_url VARCHAR(500) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create feedback table
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        artifact_id INTEGER REFERENCES artifacts(id) ON DELETE CASCADE,
        visitor_name VARCHAR(100),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create admin users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create indexes for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_artifacts_category ON artifacts(category);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_qr_codes_unique_code ON qr_codes(unique_code);
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_feedback_artifact_id ON feedback(artifact_id);
    `;

    console.log('✅ Database tables initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

/**
 * Seed database with initial admin user
 * Default credentials: admin / admin123
 */
export async function seedAdminUser() {
  const bcrypt = require('bcryptjs');
  
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await sql`
      INSERT INTO admin_users (username, password_hash, email)
      VALUES ('admin', ${hashedPassword}, 'admin@kipahare.museum')
      ON CONFLICT (username) DO NOTHING;
    `;
    
    console.log('✅ Admin user seeded successfully');
    console.log('📝 Default credentials: admin / admin123');
    return { success: true };
  } catch (error) {
    console.error('❌ Admin user seeding error:', error);
    throw error;
  }
}

/**
 * Check database connection
 */
export async function checkDatabaseConnection() {
  try {
    await sql`SELECT 1`;
    return { connected: true };
  } catch (error) {
    console.error('❌ Database connection error:', error);
    return { connected: false, error };
  }
}

// ============================================
// QUERY HELPERS
// ============================================

/**
 * Generic query wrapper with error handling
 */
export async function executeQuery<T>(
  queryFn: () => Promise<T>
): Promise<{ data?: T; error?: string }> {
  try {
    const data = await queryFn();
    return { data };
  } catch (error) {
    console.error('Database query error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
}

/**
 * Execute a transaction with multiple queries
 */
export async function executeTransaction<T>(
  queries: Array<() => Promise<any>>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    await sql`BEGIN`;
    
    const results = [];
    for (const query of queries) {
      const result = await query();
      results.push(result);
    }
    
    await sql`COMMIT`;
    return { success: true, data: results as T };
  } catch (error) {
    await sql`ROLLBACK`;
    console.error('Transaction error:', error);
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed' 
    };
  }
}

// ============================================
// DATABASE UTILITIES
// ============================================

/**
 * Update timestamp helper
 */
export function updateTimestamp() {
  return new Date().toISOString();
}

/**
 * Sanitize SQL input (basic protection)
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Generate pagination offset
 */
export function getPaginationParams(page: number = 1, pageSize: number = 10) {
  const offset = (page - 1) * pageSize;
  return { offset, limit: pageSize };
}
