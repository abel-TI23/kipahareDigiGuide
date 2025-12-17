/**
 * Artifacts API - GET all artifacts with pagination and server-side filtering
 * Returns a list of all artifacts with optional filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabaseDb } from '@/lib/supabase';
import { createSuccessResponse, createErrorResponse } from '@/lib/utils';
import { PAGINATION } from '@/lib/constants';
import type { Artifact } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(PAGINATION.DEFAULT_PAGE_SIZE)),
      PAGINATION.MAX_PAGE_SIZE
    );
    const offset = (page - 1) * limit;

    // Get all artifacts from Supabase
    let artifacts = await supabaseDb.getAllArtifacts();

    // Server-side filtering by category
    if (category && category !== 'All Categories') {
      artifacts = artifacts.filter(a => a.category === category);
    }

    // Server-side search (name or description)
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      artifacts = artifacts.filter(a => 
        a.name.toLowerCase().includes(searchLower) || 
        a.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = artifacts.length;
    const paginatedArtifacts = artifacts.slice(offset, offset + limit);

    return NextResponse.json(
      createSuccessResponse({
        artifacts: paginatedArtifacts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
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
 * Requires admin authentication (protected by middleware)
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication (middleware already handles this, but double-check)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        createErrorResponse('Unauthorized - Please login', 401),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, category, origin, year, description, image_url, audio_url } = body;

    // Validate required fields
    if (!name || !category || !origin || !year || !description) {
      return NextResponse.json(
        createErrorResponse('Missing required fields', 400),
        { status: 400 }
      );
    }

    // Insert artifact to Supabase
    const artifact = await supabaseDb.createArtifact({
      name,
      category,
      origin,
      year,
      description,
      image_url: image_url || '',
      audio_url: audio_url || '',
    });

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
