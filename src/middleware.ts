import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// The next-intl middleware is wrapped to handle internationalization.
const intlMiddleware = createMiddleware(routing);

// Define the protected routes and the roles required to access them.
const protectedRoutes: Record<string, string[]> = {
  '/user': ['user'],
  '/admin': ['admin'],
  '/employer': ['employer'],
};

// A map to redirect users to their specific dashboards based on their role.
const roleToDashboard: Record<string, string> = {
    admin: '/admin',
    employer: '/employer',
    user: '/user',
};

// the secret key used to sign the JWT.
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const tokenCookie = req.cookies.get('auth_token');

  // FIX: Handle locale prefixes in the pathname ---
  // We need to strip the locale to match against our protectedRoutes.
  const pathParts = pathname.split('/').filter(Boolean);
  // FIX: Removed the incorrect type assertion `as string[]`
  const locale = routing.locales.find(loc => loc === pathParts[0]);
  // Reconstruct the path without the locale.
  const pathWithoutLocale = locale ? `/${pathParts.slice(1).join('/')}` : pathname;


  // Determine if the requested path is a protected route using the path without the locale.
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Main RBAC 

  if (isProtectedRoute) {
    // If no token is found, redirect to the login page.
    if (!tokenCookie) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('next', pathname); // Pass original full path for correct redirect after login
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify the JWT token.
      const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
      const userRole = payload.role as string;

      // Check if the user's role is authorized for the requested route.
      const requiredRoles = Object.entries(protectedRoutes).find(([route]) => pathWithoutLocale.startsWith(route))?.[1];

      if (requiredRoles && requiredRoles.includes(userRole)) {
         // If authorized, proceed to the next middleware (next-intl).
        return intlMiddleware(req);
      } else {
        // If the role is not authorized, redirect to their own dashboard.
        const userDashboard = roleToDashboard[userRole] || '/login';
        return NextResponse.redirect(new URL(userDashboard, req.url));
      }
    } catch (err) {
      // If token verification fails redirect to login.
      console.error('JWT Verification Error:', err);
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handling for public routes

  // If a logged-in user tries to access the login page,
  // redirect them to their specific dashboard.
  if (pathWithoutLocale.startsWith('/login') && tokenCookie) {
      try {
          const { payload } = await jwtVerify(tokenCookie.value, JWT_SECRET);
          const userRole = payload.role as string;
          // Redirect to their specific dashboard.
          const userDashboard = roleToDashboard[userRole] || '/login'; // Default to /login if role is unknown
          return NextResponse.redirect(new URL(userDashboard, req.url));
      } catch (error) {
          // Token is invalid
      }
  }


  // For all other routes that are not protected just run the intl middleware.
  return intlMiddleware(req);
}

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /trpc routes
  // - /_next/static
  // - /_next/image
  // - /favicon.ico
  // - Any other files with extensions 
  matcher: '/((?!api|trpc|_next/static|_next/image|favicon.ico|.*\\..*).*)'
};
