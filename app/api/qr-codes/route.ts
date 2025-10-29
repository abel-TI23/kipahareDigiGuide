/**
 * QR Codes API
 * Generate and manage QR codes for artifacts
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import QRCode from 'qrcode';
import { createSuccessResponse, createErrorResponse, generateQRCode } from '@/lib/utils';
import type { QRCode as QRCodeType } from '@/types';

/**
 * GET /api/qr-codes
 * Get all QR codes or filter by artifact_id
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artifactId = searchParams.get('artifact_id');
    const uniqueCode = searchParams.get('code');

    // Search by unique code
    if (uniqueCode) {
      const result = await sql`
        SELECT qr.*, a.name as artifact_name
        FROM qr_codes qr
        LEFT JOIN artifacts a ON qr.artifact_id = a.id
        WHERE qr.unique_code = ${uniqueCode}
        LIMIT 1
      `;

      if (result.rows.length === 0) {
        return NextResponse.json(
          createErrorResponse('QR code not found', 404),
          { status: 404 }
        );
      }

      return NextResponse.json(createSuccessResponse(result.rows[0]));
    }

    // Filter by artifact ID
    if (artifactId) {
      const result = await sql`
        SELECT * FROM qr_codes 
        WHERE artifact_id = ${parseInt(artifactId)}
        ORDER BY created_at DESC
      `;

      return NextResponse.json(createSuccessResponse(result.rows));
    }

    // Get all QR codes
    const result = await sql`
      SELECT qr.*, a.name as artifact_name
      FROM qr_codes qr
      LEFT JOIN artifacts a ON qr.artifact_id = a.id
      ORDER BY qr.created_at DESC
    `;

    return NextResponse.json(createSuccessResponse(result.rows));
  } catch (error) {
    console.error('GET /api/qr-codes error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * POST /api/qr-codes
 * Generate a new QR code for an artifact
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artifact_id } = body;

    if (!artifact_id) {
      return NextResponse.json(
        createErrorResponse('artifact_id is required', 400),
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

    // Generate unique code
    const uniqueCode = generateQRCode(artifact_id);

    // Generate QR code image as base64
    const qrImageUrl = await QRCode.toDataURL(uniqueCode, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    // Save to database
    const result = await sql`
      INSERT INTO qr_codes (artifact_id, unique_code, qr_image_url)
      VALUES (${artifact_id}, ${uniqueCode}, ${qrImageUrl})
      RETURNING *
    `;

    const qrCode = result.rows[0] as QRCodeType;

    return NextResponse.json(
      createSuccessResponse(qrCode, 'QR code generated successfully'),
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/qr-codes error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/qr-codes/[id]
 * Delete a QR code
 */
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        createErrorResponse('Invalid QR code ID', 400),
        { status: 400 }
      );
    }

    await sql`DELETE FROM qr_codes WHERE id = ${parseInt(id)}`;

    return NextResponse.json(
      createSuccessResponse({ id }, 'QR code deleted successfully')
    );
  } catch (error) {
    console.error('DELETE /api/qr-codes error:', error);
    return NextResponse.json(
      createErrorResponse(error, 500),
      { status: 500 }
    );
  }
}
