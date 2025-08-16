import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes: Record<string, string[]> = {
  '/user': ['jobseeker'],
  '/admin': ['admin'],
  '/employer': ['employer'],
};

const roleToDashboard: Record<string, string> = {
  jobseeker: '/user',
  admin: '/admin',
  employer: '/employer',
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const { pathname } = req.nextUrl;

  const pathParts = pathname.split('/').filter(Boolean);
  const locale = routing.locales.find((loc) => loc === pathParts[0]);
  const pathWithoutLocale = locale ? `/${pathParts.slice(1).join('/')}` : pathname;

  const loginPath = '/login';

  // Try to decode the token
  let userRole: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token.value, JWT_SECRET);
      userRole = payload.role as string;

    } catch (err) {
      // Invalid token, delete it
      const res = NextResponse.redirect(new URL('/login', req.url));
      console.log(err);
      res.cookies.delete('token');
      return res;
    }
  }

  // Prevent logged-in users from accessing /login
  if (pathWithoutLocale === loginPath && userRole) {
    const redirectTo = roleToDashboard[userRole] || '/';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // Handle protected route access
  const matchedProtected = Object.entries(protectedRoutes).find(([route]) =>
    pathWithoutLocale.startsWith(route)
  );

  if (matchedProtected) {
    if (!userRole) {
      // Not logged in
      const loginUrl = new URL(loginPath, req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const [ allowedRoles] = matchedProtected;
    if (!allowedRoles.includes(userRole)) {
      // Logged in but unauthorized
      const redirectTo = roleToDashboard[userRole] || '/';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // other requests pass through i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next/static|_next/image|favicon.ico|.*\\..*).*)',
};
