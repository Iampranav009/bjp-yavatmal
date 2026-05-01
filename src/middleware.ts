import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-me';

async function verifyTokenFromRequest(request: NextRequest) {
    const token = request.cookies.get('bjp_admin_token')?.value;
    if (!token) return null;
    try {
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        return payload as { userId: number; email: string; role: string };
    } catch {
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect /admin routes — Super Admin only
    if (pathname.startsWith('/admin')) {
        const payload = await verifyTokenFromRequest(request);

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Only super_admin can access /admin routes EXCEPT /admin/a
        if (payload.role !== 'super_admin' && !pathname.startsWith('/admin/a')) {
            // Admins get redirected to their panel
            return NextResponse.redirect(new URL('/admin/a/dashboard', request.url));
        }

        return NextResponse.next();
    }

    // Protect /admin/a routes — Admin (and super_admin) can access
    if (pathname.startsWith('/admin/a')) {
        const payload = await verifyTokenFromRequest(request);

        if (!payload) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Both admin and super_admin can access /admin/a
        if (payload.role !== 'admin' && payload.role !== 'super_admin') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
