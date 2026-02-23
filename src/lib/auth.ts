import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-me';
const COOKIE_NAME = 'bjp_admin_token';
const TOKEN_EXPIRY = '8h';
const SALT_ROUNDS = 12;

export interface JWTPayload {
    userId: number;
    email: string;
    role: string;
}

export function signToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

export function verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function getAdminFromRequest(): Promise<JWTPayload | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return null;
        return verifyToken(token);
    } catch {
        return null;
    }
}

export function setAuthCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
    return {
        name: COOKIE_NAME,
        value: token,
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 28800, // 8 hours
            path: '/',
        },
    };
}

export function clearAuthCookie(): { name: string; value: string; options: Record<string, unknown> } {
    return {
        name: COOKIE_NAME,
        value: '',
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 0,
            path: '/',
        },
    };
}

export { COOKIE_NAME };
