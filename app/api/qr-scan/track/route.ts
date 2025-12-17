import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/qr-scan/track
 * Track QR code scans for analytics
 */
export async function POST(request: NextRequest) {
  try {
    const { artifactId } = await request.json();

    if (!artifactId) {
      return NextResponse.json(
        { success: false, error: 'Artifact ID is required' },
        { status: 400 }
      );
    }

    // Get visitor info
    const visitorIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert scan record
    const { error } = await supabase
      .from('qr_scans')
      .insert([{
        artifact_id: artifactId,
        visitor_ip: visitorIp,
        user_agent: userAgent,
      }]);

    if (error) {
      console.error('Error tracking QR scan:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'QR scan tracked successfully'
    });

  } catch (error: any) {
    console.error('QR scan tracking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/qr-scan/track?artifactId=1
 * Get QR scan count for specific artifact
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const artifactId = searchParams.get('artifactId');

    let query = supabase.from('qr_scans').select('*', { count: 'exact', head: true });

    if (artifactId) {
      query = query.eq('artifact_id', parseInt(artifactId));
    }

    const { count, error } = await query;

    if (error) {
      console.error('Error getting QR scan count:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { count: count || 0 }
    });

  } catch (error: any) {
    console.error('Get QR scan count error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
