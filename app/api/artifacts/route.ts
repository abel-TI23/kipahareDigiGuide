/**
 * Artifacts API - GET all artifacts
 * Returns a list of all artifacts with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import type { Artifact } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = sql`
      SELECT 
        id, name, category, origin, year, description,
        image_url, audio_url, created_at, updated_at
      FROM artifacts
      WHERE 1=1
    `;

    // Add category filter
    if (category) {
      query = sql`
        SELECT * FROM artifacts 
        WHERE category = ${category}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    // Add search filter
    else if (search) {
      query = sql`
        SELECT * FROM artifacts 
        WHERE name ILIKE ${'%' + search + '%'} 
        OR description ILIKE ${'%' + search + '%'}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }
    // Default query
    else {
      query = sql`
        SELECT * FROM artifacts 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const result = await query;
    const artifacts = result.rows as Artifact[];

    // Get total count for pagination
    const countResult = await sql`SELECT COUNT(*) as total FROM artifacts`;
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json(
      createSuccessResponse({
        artifacts,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    console.error('GET /api/artifacts error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * Create new artifact
 * Requires admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, origin, year, description, image_url, audio_url } = body;

    // Validate required fields
    if (!name || !category || !origin || !year || !description) {
      return NextResponse.json(
        createErrorResponse('Missing required fields', 400),
        { status: 400 }
      );
    }

    // Insert artifact
    const result = await sql`
      INSERT INTO artifacts (
        name, category, origin, year, description, image_url, audio_url
      )
      VALUES (
        ${name}, ${category}, ${origin}, ${year}, ${description},
        ${image_url || null}, ${audio_url || null}
      )
      RETURNING *
    `;

    const artifact = result.rows[0] as Artifact;

    return NextResponse.json(
      createSuccessResponse(artifact, 'Artifact created successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/artifacts error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}
