import { NextResponse, NextRequest } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email ID or Phone Number is required.' }, { status: 400 });
        }

        // We use a simple insert and catch duplicates since the column is UNIQUE.
        try {
            await pool.execute(
                'INSERT INTO subscribers (email) VALUES (?)',
                [email]
            );
        } catch (dbError: any) {
            if (dbError.code === 'ER_DUP_ENTRY') {
                return NextResponse.json({ message: 'Already subscribed!' }, { status: 200 }); // Graceful handling
            }
            throw dbError; // Rethrow if it's not a duplicate
        }

        return NextResponse.json({ message: 'Subscribed successfully!' }, { status: 201 });
    } catch (error) {
        console.error('Subscribe POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
