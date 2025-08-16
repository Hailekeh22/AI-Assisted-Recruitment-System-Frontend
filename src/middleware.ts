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
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Handle locale prefix
  const pathParts = pathname.split('/').filter(Boolean);
  const locale = routing.locales.find((loc) => loc === pathParts[0]);
  const pathWithoutLocale = locale ? `/${pathParts.slice(1).join('/')}` : pathname;

  const loginPath = '/login';

  // Decode token
  let userRole: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userRole = payload.role as string;
    } catch (err) {
      // Invalid token → delete cookie
      const res = NextResponse.redirect(new URL(loginPath, req.url));
      res.cookies.delete('token');
      return res;
    }
  }

  // Redirect logged-in users away from login page
  if (pathWithoutLocale === loginPath && userRole) {
    const redirectTo = roleToDashboard[userRole] || '/';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // Check protected routes
  const matchedProtected = Object.entries(protectedRoutes).find(([route]) =>
    pathWithoutLocale.startsWith(route)
  );

  if (matchedProtected) {
    const [route, allowedRoles] = matchedProtected;

    if (!userRole) {
      // Not logged in → redirect to login with `next`
      const loginUrl = new URL(loginPath, req.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!allowedRoles.includes(userRole)) {
      // Logged in but unauthorized → redirect to dashboard
      const redirectTo = roleToDashboard[userRole] || '/';
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
  }

  // Pass other requests to i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: '/((?!api|trpc|_next/static|_next/image|favicon.ico|.*\\..*).*)',
};
