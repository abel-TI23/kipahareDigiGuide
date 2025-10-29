/**
 * Individual Artifact API Routes
 * GET, PUT, DELETE operations for specific artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import type { Artifact } from '@/types';

/**
 * GET /api/artifacts/[id]
 * Fetch a single artifact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artifactId = parseInt(id);

    if (isNaN(artifactId)) {
      return NextResponse.json(
        createErrorResponse('Invalid artifact ID', 400),
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT * FROM artifacts 
      WHERE id = ${artifactId}
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

    const artifact = result.rows[0] as Artifact;

    return NextResponse.json(createSuccessResponse(artifact));
  } catch (error) {
    console.error('GET /api/artifacts/[id] error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/artifacts/[id]
 * Update an existing artifact
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artifactId = parseInt(id);

    if (isNaN(artifactId)) {
      return NextResponse.json(
        createErrorResponse('Invalid artifact ID', 400),
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, category, origin, year, description, image_url, audio_url } = body;

    // Check if artifact exists
    const existingResult = await sql`
      SELECT id FROM artifacts WHERE id = ${artifactId}
    `;

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

    // Update artifact
    const result = await sql`
      UPDATE artifacts
      SET
        name = COALESCE(${name}, name),
        category = COALESCE(${category}, category),
        origin = COALESCE(${origin}, origin),
        year = COALESCE(${year}, year),
        description = COALESCE(${description}, description),
        image_url = COALESCE(${image_url}, image_url),
        audio_url = COALESCE(${audio_url}, audio_url),
        updated_at = NOW()
      WHERE id = ${artifactId}
      RETURNING *
    `;

    const artifact = result.rows[0] as Artifact;

    return NextResponse.json(
      createSuccessResponse(artifact, 'Artifact updated successfully')
    );
  } catch (error) {
    console.error('PUT /api/artifacts/[id] error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/artifacts/[id]
 * Delete an artifact and its associated QR codes and feedback
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artifactId = parseInt(id);

    if (isNaN(artifactId)) {
      return NextResponse.json(
        createErrorResponse('Invalid artifact ID', 400),
        { status: 400 }
      );
    }

    // Check if artifact exists
    const existingResult = await sql`
      SELECT id FROM artifacts WHERE id = ${artifactId}
    `;

    if (existingResult.rows.length === 0) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

    // Delete artifact (CASCADE will remove related QR codes and feedback)
    await sql`
      DELETE FROM artifacts WHERE id = ${artifactId}
    `;

    return NextResponse.json(
      createSuccessResponse(
        { id: artifactId },
        'Artifact deleted successfully'
      )
    );
  } catch (error) {
    console.error('DELETE /api/artifacts/[id] error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}
