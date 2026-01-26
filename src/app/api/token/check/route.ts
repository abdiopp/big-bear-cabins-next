import { NextResponse } from 'next/server';
import { getTokenStatus, getValidToken } from '@/lib/streamline-token';

/**
 * POST /api/token/check
 * Check the current Streamline token status and validity
 */
export async function POST() {
    try {
        // Get current token status
        const status = await getTokenStatus();

        // Also try to get a valid token (which will refresh if needed)
        try {
            const validToken = await getValidToken();
            return NextResponse.json({
                success: true,
                status: {
                    ...status,
                    currentTokenKeyPrefix: validToken.tokenKey.substring(0, 8) + '...',
                }
            });
        } catch (tokenError) {
            return NextResponse.json({
                success: false,
                status,
                error: tokenError instanceof Error ? tokenError.message : 'Unknown error getting valid token'
            });
        }
    } catch (error) {
        console.error('Token check failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/token/check
 * Simple health check for token status
 */
export async function GET() {
    try {
        const status = await getTokenStatus();
        return NextResponse.json({ success: true, status });
    } catch (error) {
        console.error('Token status check failed:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
