import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/stats
 * Get aggregated statistics for dashboard
 * Returns: QR scan count, unique visitors, average rating
 */
export async function GET() {
  try {
    // Get QR scan count
    const { count: qrScanCount, error: qrError } = await supabase
      .from('qr_scans')
      .select('*', { count: 'exact', head: true });

    if (qrError) {
      console.error('Error getting QR scan count:', qrError);
    }

    // Get unique visitors count
    const { count: visitorsCount, error: visitorsError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });

    if (visitorsError) {
      console.error('Error getting visitors count:', visitorsError);
    }

    // Get average rating
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .select('rating');

    if (feedbackError) {
      console.error('Error getting feedback:', feedbackError);
    }

    // Calculate average rating
    let avgRating = 0;
    let totalRatings = 0;

    if (feedbackData && feedbackData.length > 0) {
      const sumRatings = feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0);
      totalRatings = feedbackData.length;
      avgRating = totalRatings > 0 ? parseFloat((sumRatings / totalRatings).toFixed(1)) : 0;
    }

    // Get total artifacts count
    const { count: artifactsCount, error: artifactsError } = await supabase
      .from('artifacts')
      .select('*', { count: 'exact', head: true });

    if (artifactsError) {
      console.error('Error getting artifacts count:', artifactsError);
    }

    return NextResponse.json({
      success: true,
      data: {
        qrScans: qrScanCount || 0,
        visitors: visitorsCount || 0,
        avgRating: avgRating,
        totalRatings: totalRatings,
        artifacts: artifactsCount || 0,
      }
    });

  } catch (error: any) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
