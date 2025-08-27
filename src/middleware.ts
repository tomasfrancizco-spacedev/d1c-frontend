import { NextRequest } from 'next/server';
import { authMiddleware } from './middleware/authMiddleware';
import { headerMiddleware } from './middleware/headerMiddleware';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith('/api/')) {
        return headerMiddleware(req);
    }

    return authMiddleware(req);
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)', '/api/:path*']
};