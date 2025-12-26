import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');
  const superAdminDomain = 'rentalsystem-seven.vercel.app';

  // Get the session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || '',
    secureCookie: process.env.NODE_ENV === 'production'
  });

  // Domain-specific redirection for root and /Home
  if (pathname === '/' || pathname === '/Home') {
    if (host === superAdminDomain) {
      if (token?.role === 'superadmin') {
        return NextResponse.redirect(new URL('/SuperDashboard', request.url));
      } else {
        return NextResponse.redirect(new URL('/SuperLogin', request.url));
      }
    } else {
      // For all other domains, navigate to Home
      if (pathname === '/') {
        return NextResponse.redirect(new URL('/Home', request.url));
      }
    }
  }

  // Protected routes
  const superAdminRoutes = ['/SuperDashboard', '/api/superadmin/add-admin'];
  const adminRoutes = ['/AdminDashboard', '/api/admin/change-password', '/api/admin/forgot-password'];
  const authRoutes = ['/SuperLogin', '/SuperSignup', '/AdminLogin'];

  const isSuperAdminRoute = superAdminRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname === route);

  // Redirect to login if accessing protected route without token
  if ((isSuperAdminRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/SuperLogin', request.url));
  }

  // Redirect to appropriate dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    if (token.role === 'superadmin') {
      return NextResponse.redirect(new URL('/SuperDashboard', request.url));
    } else if (token.role === 'admin') {
      return NextResponse.redirect(new URL('/AdminDashboard', request.url));
    }
  }

  // Role-based access control
  if (isSuperAdminRoute && token?.role !== 'superadmin') {
    return NextResponse.redirect(new URL('/AdminLogin', request.url));
  }

  if (isAdminRoute && token?.role !== 'admin') {
    return NextResponse.redirect(new URL('/SuperLogin', request.url));
  }

  // API route protection
  if (pathname.startsWith('/api/superadmin/add-admin') && token?.role !== 'superadmin') {
    return NextResponse.json(
      { message: 'Unauthorized - Super Admin access required' },
      { status: 403 }
    );
  }

  if (pathname.startsWith('/api/admin/change-password') && token?.role !== 'admin') {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/Home',
    '/SuperDashboard/:path*',
    '/AdminDashboard/:path*',
    '/SuperLogin',
    '/SuperSignup',
    '/AdminLogin',
    '/api/superadmin/:path*',
    '/api/admin/:path*',
  ],
};