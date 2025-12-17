/**
 * Individual Artifact API Routes
 * GET, PUT, DELETE operations for specific artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { supabaseDb } from '@/lib/supabase';
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

    const artifact = await supabaseDb.getArtifactById(artifactId);

    if (!artifact) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

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
 * Update an existing artifact (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        createErrorResponse('Unauthorized - Please login', 401),
        { status: 401 }
      );
    }

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

    // Update artifact in Supabase
    const artifact = await supabaseDb.updateArtifact(artifactId, {
      name,
      category,
      origin,
      year,
      description,
      image_url,
      audio_url,
    });

    if (!artifact) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

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
 * Delete an artifact (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        createErrorResponse('Unauthorized - Please login', 401),
        { status: 401 }
      );
    }

    const { id } = await params;
    const artifactId = parseInt(id);

    if (isNaN(artifactId)) {
      return NextResponse.json(
        createErrorResponse('Invalid artifact ID', 400),
        { status: 400 }
      );
    }

    // Delete artifact from Supabase
    const result = await supabaseDb.deleteArtifact(artifactId);

    if (!result.success) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

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
