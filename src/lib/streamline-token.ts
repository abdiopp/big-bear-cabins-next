// lib/streamline-token.ts
// Token management service for Streamline VRS API

import { prisma } from './prisma';
import type { TokenExpirationResponse, RenewTokenResponse } from './streamline-types';

const STREAMLINE_API_URL = 'https://web.streamlinevrs.com/api/json';

interface TokenData {
    tokenKey: string;
    tokenSecret: string;
    expiresAt: Date;
}

/**
 * Get the current token from the database
 */
async function getStoredToken(): Promise<TokenData | null> {
    const token = await prisma.streamlineToken.findFirst({
        orderBy: { updatedAt: 'desc' }
    });

    if (!token) {
        return null;
    }

    return {
        tokenKey: token.tokenKey,
        tokenSecret: token.tokenSecret,
        expiresAt: token.expiresAt
    };
}

/**
 * Save token to the database
 */
async function saveToken(tokenData: TokenData): Promise<void> {
    // Upsert the token - update if exists, create if not
    await prisma.streamlineToken.upsert({
        where: { tokenKey: tokenData.tokenKey },
        update: {
            tokenSecret: tokenData.tokenSecret,
            expiresAt: tokenData.expiresAt
        },
        create: {
            tokenKey: tokenData.tokenKey,
            tokenSecret: tokenData.tokenSecret,
            expiresAt: tokenData.expiresAt
        }
    });
}

/**
 * Parse date string from API, returning a valid Date or a fallback
 */
function parseExpirationDate(dateValue: unknown): Date {
    // Default to 30 days from now if we can't parse the date
    const fallbackDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (!dateValue) {
        console.warn('⚠️ No expiration date provided, using fallback');
        return fallbackDate;
    }

    // Handle Unix timestamp (seconds)
    if (typeof dateValue === 'number') {
        const date = new Date(dateValue * 1000);
        if (!isNaN(date.getTime())) return date;
    }

    // Handle string date
    if (typeof dateValue === 'string') {
        // Try direct parsing first
        let date = new Date(dateValue);
        if (!isNaN(date.getTime())) return date;

        // Try common formats like "YYYY-MM-DD HH:mm:ss"
        const isoFormatted = dateValue.replace(' ', 'T');
        date = new Date(isoFormatted);
        if (!isNaN(date.getTime())) return date;
    }

    console.warn(`⚠️ Could not parse expiration date: ${dateValue}, using fallback`);
    return fallbackDate;
}

/**
 * Check token expiration via Streamline API
 */
async function checkTokenExpiration(tokenKey: string, tokenSecret: string): Promise<TokenExpirationResponse> {
    const res = await fetch(STREAMLINE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            methodName: 'GetTokenExpiration',
            params: {
                token_key: tokenKey,
                token_secret: tokenSecret
            }
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to check token expiration: ${res.status}`);
    }

    const data = await res.json();
    console.log('📋 Token expiration API response:', JSON.stringify(data, null, 2));
    return data.data;
}

/**
 * Renew an expired token via Streamline API
 */
async function renewToken(tokenKey: string, tokenSecret: string): Promise<RenewTokenResponse> {
    console.log('🔄 Renewing Streamline token...');

    const res = await fetch(STREAMLINE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            methodName: 'RenewExpiredToken',
            params: {
                token_key: tokenKey,
                token_secret: tokenSecret
            }
        })
    });

    if (!res.ok) {
        throw new Error(`Failed to renew token: ${res.status}`);
    }

    const data = await res.json();

    if (data.status !== 1) {
        throw new Error(`Token renewal failed: ${data.status_text || 'Unknown error'}`);
    }

    console.log('✅ Token renewed successfully');
    return data.data;
}

/**
 * Check if token is expired or will expire soon (within 1 hour)
 */
function isTokenExpiringSoon(expiresAt: Date): boolean {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    return expiresAt <= oneHourFromNow;
}

/**
 * Get a valid token, refreshing if necessary
 * This is the main entry point for getting tokens
 */
export async function getValidToken(): Promise<{ tokenKey: string; tokenSecret: string }> {
    // First, try to get token from environment (initial setup)
    const envTokenKey = process.env.STREAMLINE_KEY;
    const envTokenSecret = process.env.STREAMLINE_SECRET;

    if (!envTokenKey || !envTokenSecret) {
        throw new Error('Streamline API credentials not configured in environment variables');
    }

    // Check if we have a stored token
    let storedToken = await getStoredToken();

    // If no stored token, initialize from env and check expiration
    if (!storedToken) {
        console.log('📦 No stored token found, initializing from environment...');

        try {
            // Check expiration of env token
            const expiration = await checkTokenExpiration(envTokenKey, envTokenSecret);

            const expiresAt = parseExpirationDate(expiration.expiration_date);

            // Save initial token
            await saveToken({
                tokenKey: envTokenKey,
                tokenSecret: envTokenSecret,
                expiresAt
            });

            storedToken = {
                tokenKey: envTokenKey,
                tokenSecret: envTokenSecret,
                expiresAt
            };

            console.log(`📅 Token expires at: ${expiresAt.toISOString()}`);
        } catch (error) {
            console.error('Failed to initialize token:', error);
            // Fall back to env credentials
            return { tokenKey: envTokenKey, tokenSecret: envTokenSecret };
        }
    }

    // Check if token is expiring soon and refresh if needed
    if (isTokenExpiringSoon(storedToken.expiresAt)) {
        console.log('⏰ Token expiring soon, refreshing...');

        try {
            const renewed = await renewToken(storedToken.tokenKey, storedToken.tokenSecret);

            const newExpiresAt = parseExpirationDate(renewed.expiration_date);

            // Update stored token with new credentials
            await saveToken({
                tokenKey: renewed.token_key,
                tokenSecret: renewed.token_secret,
                expiresAt: newExpiresAt
            });

            return {
                tokenKey: renewed.token_key,
                tokenSecret: renewed.token_secret
            };
        } catch (error) {
            console.error('Failed to renew token:', error);
            // Return current token and hope for the best
            return {
                tokenKey: storedToken.tokenKey,
                tokenSecret: storedToken.tokenSecret
            };
        }
    }

    return {
        tokenKey: storedToken.tokenKey,
        tokenSecret: storedToken.tokenSecret
    };
}

/**
 * Force refresh the token (for manual refresh)
 */
export async function forceRefreshToken(): Promise<{ tokenKey: string; tokenSecret: string }> {
    const storedToken = await getStoredToken();

    const tokenKey = storedToken?.tokenKey || process.env.STREAMLINE_KEY;
    const tokenSecret = storedToken?.tokenSecret || process.env.STREAMLINE_SECRET;

    if (!tokenKey || !tokenSecret) {
        throw new Error('No token available to refresh');
    }

    const renewed = await renewToken(tokenKey, tokenSecret);

    const newExpiresAt = parseExpirationDate(renewed.expiration_date);

    await saveToken({
        tokenKey: renewed.token_key,
        tokenSecret: renewed.token_secret,
        expiresAt: newExpiresAt
    });

    return {
        tokenKey: renewed.token_key,
        tokenSecret: renewed.token_secret
    };
}

/**
 * Get token status for debugging/monitoring
 */
export async function getTokenStatus(): Promise<{
    hasStoredToken: boolean;
    tokenKey?: string;
    expiresAt?: Date;
    isExpiringSoon?: boolean;
}> {
    const storedToken = await getStoredToken();

    if (!storedToken) {
        return { hasStoredToken: false };
    }

    return {
        hasStoredToken: true,
        tokenKey: storedToken.tokenKey.substring(0, 8) + '...',
        expiresAt: storedToken.expiresAt,
        isExpiringSoon: isTokenExpiringSoon(storedToken.expiresAt)
    };
}
