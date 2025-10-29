/**
 * Feedback API
 * Submit and retrieve visitor feedback for artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { createSuccessResponse, createErrorResponse, isValidRating } from '@/lib/utils';
import type { Feedback } from '@/types';

/**
 * GET /api/feedback
 * Get all feedback or filter by artifact_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artifactId = searchParams.get('artifact_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;

    if (artifactId) {
      // Get feedback for specific artifact
      result = await sql`
        SELECT f.*, a.name as artifact_name
        FROM feedback f
        LEFT JOIN artifacts a ON f.artifact_id = a.id
        WHERE f.artifact_id = ${parseInt(artifactId)}
        ORDER BY f.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      // Get all feedback
      result = await sql`
        SELECT f.*, a.name as artifact_name
        FROM feedback f
        LEFT JOIN artifacts a ON f.artifact_id = a.id
        ORDER BY f.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Get total count
    const countQuery = artifactId
      ? sql`SELECT COUNT(*) as total FROM feedback WHERE artifact_id = ${parseInt(artifactId)}`
      : sql`SELECT COUNT(*) as total FROM feedback`;

    const countResult = await countQuery;
    const total = parseInt(countResult.rows[0].total);

    return NextResponse.json(
      createSuccessResponse({
        feedback: result.rows,
        total,
        page: Math.floor(offset / limit) + 1,
        pageSize: limit,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * POST /api/feedback
 * Submit new visitor feedback
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artifact_id, visitor_name, rating, comment } = body;

    // Validate required fields
    if (!artifact_id || !rating) {
      return NextResponse.json(
        createErrorResponse('artifact_id and rating are required', 400),
        { status: 400 }
      );
    }

    // Validate rating range
    if (!isValidRating(rating)) {
      return NextResponse.json(
        createErrorResponse('Rating must be between 1 and 5', 400),
        { status: 400 }
      );
    }

    // Verify artifact exists
    const artifactResult = await sql`
      SELECT id FROM artifacts WHERE id = ${artifact_id}
    `;

    if (artifactResult.rows.length === 0) {
      return NextResponse.json(
        createErrorResponse('Artifact not found', 404),
        { status: 404 }
      );
    }

    // Insert feedback
    const result = await sql`
      INSERT INTO feedback (artifact_id, visitor_name, rating, comment)
      VALUES (
        ${artifact_id},
        ${visitor_name || null},
        ${rating},
        ${comment || null}
      )
      RETURNING *
    `;

    const feedback = result.rows[0] as Feedback;

    return NextResponse.json(
      createSuccessResponse(feedback, 'Thank you for your feedback!'),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback/stats
 * Get feedback statistics for an artifact
 */
export async function getStats(artifactId: number) {
  try {
    const result = await sql`
      SELECT
        COUNT(*) as total_feedback,
        AVG(rating)::DECIMAL(10,2) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM feedback
      WHERE artifact_id = ${artifactId}
    `;

    return result.rows[0];
  } catch (error) {
    console.error('Feedback stats error:', error);
    throw error;
  }
}
