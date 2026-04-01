import { auth, signIn } from '@/auth';
import { NextResponse } from 'next/server';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const ALLOWED_ORIGINS = [
    'https://wordpress-client-site.com',
    'https://another-client.com',
    'http://localhost:3000',
    'http://localhost:3001',
];

function getCorsHeaders(origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin : '',
        'Access-Control-Allow-Methods': 'POST',
    };
}

// Preflight handler — separate export, not inside POST
export async function OPTIONS(req) {
    const origin = req.headers.get('origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': isAllowed ? origin : '',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function POST(req) {
    const origin = req.headers.get('origin') || '';
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    const corsHeaders = getCorsHeaders(origin);

    // Block disallowed origins (only matters for fetch requests, not form submits)
    if (!isAllowed && origin) {
        return NextResponse.json(
            { error: 'Origin not allowed' },
            { status: 403, headers: corsHeaders }
        );
    }

    // Read formData ONCE at the top
    const formData = await req.formData();
    const apiKey = formData.get('api_key');
    const redirectTo = formData.get('redirect') || '/dashboard';
    const locale = formData.get('locale') || 'en';

    // If already logged in, just redirect
    const existingSession = await auth();
    console.log('Existing Session:', existingSession);
    if (existingSession?.accessToken && !existingSession?.error) {
        return NextResponse.redirect(
            new URL(`/${locale}/${existingSession.user.tenantId}/${redirectTo}`, req.url)
        );
    }

    // Validate API key
    if (!apiKey) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Ask NestJS to validate and return user data
    const validation = await fetch(`${baseUrl}/auth/signin-with-api-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
    });

    if (!validation.ok) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    const userData = await validation.json();
    console.log('User Data:', userData);
    // Silent sign in via internal credentials provider
    try {
        await signIn('credentials-api-key', {
            userId: userData.id,
            accessToken: userData.accessToken,
            refreshToken: userData.refreshToken,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            tenantId: userData.tenantId,
            internalSecret: process.env.INTERNAL_API_KEY_SECRET,
            redirect: false,
        });
    } catch (e) {
        console.error('Silent sign in failed:', e);
        return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.redirect(
        new URL(`/${locale}/${userData.tenantId}/${redirectTo}`, req.url),
        { headers: corsHeaders }
    );
}