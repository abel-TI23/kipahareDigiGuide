import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(request: NextRequest) {
  try {
    const { artifactId } = await request.json();

    if (!artifactId) {
      return NextResponse.json(
        { success: false, error: 'Artifact ID is required' },
        { status: 400 }
      );
    }

    // Generate the artifact URL - prioritize NEXT_PUBLIC_APP_URL, then NEXTAUTH_URL, then derive from request
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    
    if (!baseUrl || baseUrl.includes('your-project')) {
      // Fallback: derive from request headers
      const host = request.headers.get('host');
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      baseUrl = `${protocol}://${host}`;
    }
    
    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');
    
    const artifactUrl = `${baseUrl}/artifacts/${artifactId}`;

    // Generate QR code with museum colors
    const qrImage = await QRCode.toDataURL(artifactUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#8B4513',  // Museum brown
        light: '#FAF3E8'  // Cream background
      },
      errorCorrectionLevel: 'H'
    });

    return NextResponse.json({
      success: true,
      qrImage,
      url: artifactUrl
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
