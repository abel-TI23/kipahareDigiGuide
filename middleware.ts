/**
 * Ki Pahare DigiGuide - Middleware
 * Protects admin routes with authentication
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect all admin routes and API routes (except auth)
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/artifacts/:path*',
  ],
};
