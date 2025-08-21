import { NextRequest, NextResponse } from 'next/server';
import { validateAuthentication } from '@/lib/server-auth-utils';

const PUBLIC_PATH_PREFIXES = [
  '/',
  '/api',
  '/favicon.ico',
  '/images',
  '/_next',
  '/colleges',
  '/landing',
];

const MFA_PATH_PREFIXES = [
  '/auth/mfa/request',
  '/auth/mfa/verify',
];

const ADMIN_PATH_PREFIXES = [
  '/admin',
];

const startsWithAny = (pathname: string, prefixes: string[]) =>
  prefixes.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname === p);

const isPublicPath = (pathname: string) => {
  if (pathname === '/') return true;
  return startsWithAny(pathname, PUBLIC_PATH_PREFIXES.filter((p) => p !== '/'));
};

const isMfaPath = (pathname: string) => startsWithAny(pathname, MFA_PATH_PREFIXES);
const isAdminPath = (pathname: string) => startsWithAny(pathname, ADMIN_PATH_PREFIXES);

export function authMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const { isWalletAuthenticated, isMfaAuthenticated, isAdmin, isFullyAuthenticated } = validateAuthentication(req);

  if (!isWalletAuthenticated && isMfaAuthenticated) {
    const url = new URL('/auth/signin', req.url);
    const res = NextResponse.redirect(url);
    res.cookies.set('siws-auth', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(0) });
    res.cookies.set('accessToken', '', { path: '/', httpOnly: true, secure: true, sameSite: 'lax', expires: new Date(0) });
    return res;
  }

  if (isWalletAuthenticated && !isMfaAuthenticated) {
    if (isMfaPath(pathname)) {
      return NextResponse.next();
    }
    console.log("Redirecting to mfa request from auth middleware");
    const url = new URL('/auth/mfa/request', req.url);
    return NextResponse.redirect(url);
  }

  if (isAdminPath(pathname)) {
    if (isFullyAuthenticated) {
      if (!isAdmin) {
        const url = new URL('/dashboard', req.url);
        return NextResponse.redirect(url);
      }
      return NextResponse.next();
    }
  }

  if (isFullyAuthenticated) {
    return NextResponse.next();
  }

  if (!isPublicPath(pathname) && !isMfaPath(pathname)) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}