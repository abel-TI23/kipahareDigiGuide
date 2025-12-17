/**
 * Ki Pahare DigiGuide - Middleware
 * Protects admin routes with authentication
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Allow GET requests to /api/artifacts (public read)
    if (pathname.startsWith('/api/artifacts') && req.method === 'GET') {
      return NextResponse.next();
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow GET requests to /api/artifacts (public read)
        if (pathname.startsWith('/api/artifacts') && req.method === 'GET') {
          return true;
        }
        
        // Require auth for everything else
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Protect all admin routes and write operations on API artifacts
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/artifacts/:path*',
  ],
};
