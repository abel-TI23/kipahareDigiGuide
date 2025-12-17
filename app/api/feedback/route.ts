/**
 * Feedback API
 * Submit and retrieve visitor feedback for artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isValidRating } from '@/lib/utils';

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

    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (artifactId) {
      query = query.eq('artifact_id', parseInt(artifactId));
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
      }
    });

  } catch (error: any) {
    console.error('GET /api/feedback error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
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
    const { artifact_id, visitor_name, email, rating, comment } = body;

    // Validate required fields
    if (!artifact_id || !rating) {
      return NextResponse.json(
        { success: false, error: 'artifact_id and rating are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (!isValidRating(rating)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Insert feedback
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        artifact_id: parseInt(artifact_id),
        visitor_name: visitor_name || null,
        email: email || null,
        rating: parseInt(rating),
        comment: comment || null,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting feedback:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Thank you for your feedback!'
    }, { status: 201 });

  } catch (error: any) {
    console.error('POST /api/feedback error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
