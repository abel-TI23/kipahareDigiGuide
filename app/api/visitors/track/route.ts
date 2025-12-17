import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * POST /api/visitors/track
 * Track unique visitors
 */
export async function POST(request: NextRequest) {
  try {
    // Get visitor IP
    const visitorIp = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    // Check if visitor already exists
    const { data: existingVisitor, error: selectError } = await supabase
      .from('visitors')
      .select('*')
      .eq('visitor_ip', visitorIp)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Error checking visitor:', selectError);
      // Don't fail if table doesn't exist yet
      if (selectError.message?.includes('does not exist')) {
        console.warn('Visitors table does not exist yet. Please run SETUP_TRACKING_TABLES.md SQL.');
        return NextResponse.json({
          success: true,
          message: 'Tracking disabled - table not setup',
        });
      }
      return NextResponse.json(
        { success: false, error: selectError.message },
        { status: 500 }
      );
    }

    if (existingVisitor) {
      // Update existing visitor
      const { error: updateError } = await supabase
        .from('visitors')
        .update({
          last_visit: new Date().toISOString(),
          visit_count: existingVisitor.visit_count + 1,
        })
        .eq('visitor_ip', visitorIp);

      if (updateError) {
        console.error('Error updating visitor:', updateError);
        return NextResponse.json(
          { success: false, error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Visitor updated',
        isReturning: true,
      });
    } else {
      // Insert new visitor
      const { error: insertError } = await supabase
        .from('visitors')
        .insert([{ visitor_ip: visitorIp }]);

      if (insertError) {
        console.error('Error inserting visitor:', insertError);
        return NextResponse.json(
          { success: false, error: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'New visitor tracked',
        isReturning: false,
      });
    }

  } catch (error: any) {
    console.error('Visitor tracking error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/visitors/track
 * Get total unique visitors count
 */
export async function GET() {
  try {
    const { count, error } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting visitor count:', error);
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
    console.error('Get visitor count error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
