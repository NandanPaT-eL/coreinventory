import { NextResponse } from 'next/server';

// Public paths that don't require authentication
const publicPaths = [
  '/auth/login',
  '/auth/signup',
  '/auth/reset-password',
  '/',
  '/_next', // Next.js internal routes
  '/favicon.ico',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith('/_next') || pathname.includes('.')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get token from localStorage is not possible in middleware
  // Instead, check cookie (set by login)
  const token = request.cookies.get('token')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // Token exists, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
