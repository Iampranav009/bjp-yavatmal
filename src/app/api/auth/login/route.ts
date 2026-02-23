import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { comparePassword, signToken, setAuthCookie } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Demo Login Bypass
        if (email === 'demo@bjpyavatmal.in' && password === 'demo123') {
            const token = signToken({
                userId: 999,
                email: 'demo@bjpyavatmal.in',
                role: 'admin',
            });

            const cookie = setAuthCookie(token);
            const response = NextResponse.json({
                data: {
                    id: 999,
                    name: 'Demo Admin',
                    email: 'demo@bjpyavatmal.in',
                    role: 'admin',
                },
                message: 'Demo login successful',
            });

            response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);
            return response;
        }

        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = ?',
            [email]
        );

        if (!rows.length) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const user = rows[0];
        const isValid = await comparePassword(password, user.password_hash);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
        });

        const cookie = setAuthCookie(token);
        const response = NextResponse.json({
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            message: 'Login successful',
        });

        response.cookies.set(cookie.name, cookie.value, cookie.options as Parameters<typeof response.cookies.set>[2]);
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
