import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect all /admin routes
    if (pathname.startsWith('/admin')) {
        const token = request.cookies.get('bjp_admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-dev-secret-change-me');
            await jwtVerify(token, secret);
            return NextResponse.next();
        } catch {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('bjp_admin_token');
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
