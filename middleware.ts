import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // Skip API routes - they handle their own authentication
  if (path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/submit',
    '/user-login',
    '/advisor-login',
    '/advisor-signup',
    '/how-it-works',
    '/principles',
    '/before-you-begin',
    '/data-anonymity',
    '/privacy-policy',
    '/terms-of-use',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protected routes
  // Temporarily disabled to test login flow
  // if (path.startsWith('/user-dashboard')) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/user-login', request.url));
  //   }

  //   const payload = verifyToken(token);
  //   if (!payload || payload.role !== 'user') {
  //     return NextResponse.redirect(new URL('/user-login', request.url));
  //   }
  // }

  // Temporarily disabled to test login flow
  // if (path.startsWith('/advisor-dashboard')) {
  //   if (!token) {
  //     return NextResponse.redirect(new URL('/advisor-login', request.url));
  //   }

  //   const payload = verifyToken(token);
  //   if (!payload || payload.role !== 'advisor') {
  //     return NextResponse.redirect(new URL('/advisor-login', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

