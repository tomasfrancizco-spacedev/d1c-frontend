import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_API_PATHS = [
  '/api/auth/siws',
  '/api/auth/email',
  '/api/auth/verify',
  '/api/auth/logout',
  '/api/auth/check-admin',
];

export function headerMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  if (PUBLIC_API_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('accessToken')?.value;
  // const isAdmin = req.cookies.get('isAdmin')?.value;
  const headers = new Headers(req.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next({
    request: {
      headers
    }
  });
}