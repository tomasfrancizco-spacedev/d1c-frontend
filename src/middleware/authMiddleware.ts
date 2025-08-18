// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateAuthentication } from '@/lib/server-auth-utils';

// Keep these *prefix* paths simple and check with startsWith()
const PUBLIC_PATH_PREFIXES = [
  '/',           // landing (keep as first to allow "/"; we still guard non-public below)
  '/api',        // your API (if it's public; otherwise remove this)
  '/favicon.ico',
  '/images',
  '/_next',      // Next.js assets
  '/colleges',   // static logos, etc. (optional)
  '/landing',
];

const MFA_PATH_PREFIXES = [
  '/auth/mfa/request',
  '/auth/mfa/verify',
];

const ADMIN_PATH_PREFIXES = [
  '/admin',
];

// Helper: does a pathname start with any prefix?
const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname === p);

// PUBLIC checker (but treats root carefully: we'll still protect non-public subpaths later)
const isPublicPath = (pathname: string) => {
  // Allow only exact "/" for root, not everything under it
  if (pathname === '/') return true;
  // Otherwise use prefixes
  return startsWithAny(pathname, PUBLIC_PATH_PREFIXES.filter((p) => p !== '/'));
};

const isMfaPath = (pathname: string) => startsWithAny(pathname, MFA_PATH_PREFIXES);
const isAdminPath = (pathname: string) => startsWithAny(pathname, ADMIN_PATH_PREFIXES);

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Public resources: always pass
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // 2) Validate authentication using shared utilities
  const { isWalletAuthenticated, isMfaAuthenticated, isAdmin, isFullyAuthenticated } = validateAuthentication(req);

  // 3) Weird state: MFA OK but wallet NOT OK → logout (clear both cookies) and redirect to signin
  if (!isWalletAuthenticated && isMfaAuthenticated) {
    const url = new URL('/auth/signin', req.url);
    const res = NextResponse.redirect(url);
    // Clear cookies
    res.cookies.set('siws-auth', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(0) });
    res.cookies.set('accessToken', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(0) });
    return res;
  }

  // 4) Wallet OK but MFA NOT OK → only allow MFA routes
  if (isWalletAuthenticated && !isMfaAuthenticated) {
    if (isMfaPath(pathname)) {
      return NextResponse.next();
    }
    // Redirect any other protected route to MFA request
    const url = new URL('/auth/mfa/request', req.url);
    return NextResponse.redirect(url);
  }

  // 5) Check admin access for admin paths
  if (isAdminPath(pathname)) {
    // For admin paths, user must be fully authenticated AND admin
    if (isFullyAuthenticated) {
      if (!isAdmin) {
        // User is authenticated but not admin, redirect to dashboard
        const url = new URL('/dashboard', req.url);
        return NextResponse.redirect(url);
      }
      // User is admin, allow access
      return NextResponse.next();
    }
    // Not fully authenticated for admin path, continue to regular auth flow below
  }

  // 6) Wallet OK + MFA OK → allow (for non-admin paths)
  if (isFullyAuthenticated) {
    return NextResponse.next();
  }

  // 7) Neither OK → block protected routes (anything not public & not MFA) and send to landing/signin
  if (!isPublicPath(pathname) && !isMfaPath(pathname)) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}