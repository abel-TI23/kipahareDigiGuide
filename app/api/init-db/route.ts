/**
 * Database Initialization Endpoint
 * Run this once to set up database tables
 * Access: /api/init-db
 */

import { NextResponse } from 'next/server';
import { initializeDatabase, seedAdminUser } from '@/lib/database';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';

export async function POST() {
  try {
    // Initialize database tables
    await initializeDatabase();
    
    // Seed admin user
    await seedAdminUser();

    return NextResponse.json(
      createSuccessResponse(
        { initialized: true },
        'Database initialized successfully! Default admin credentials: admin / admin123'
      ),
      { status: 200 }
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Use POST method to initialize database',
      endpoint: '/api/init-db',
      method: 'POST',
    },
    { status: 405 }
  );
}
