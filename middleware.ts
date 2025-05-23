import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authOptions } from './lib/auth';

const PUBLIC_ROUTES = ['/login'];
const PROTECTED_ROUTES = ['/courses', '/profile'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

    const token = await getToken({
        req: request,
        secret: authOptions.secret
    });

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isPublicRoute && token) {
        return NextResponse.redirect(new URL('/courses', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, etc.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
    ]
};
