import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from './auth.config';
import { defaultLocale, supportedLocales } from './lib/i18n-config';
import {
    LOGIN,
    PUBLIC_ROUTES,
    ROOT,
    notAccessAbleWhileLoggedIn,
} from './lib/route-list';

const { auth } = NextAuth(authConfig);



const normalizeLocale = (locale) => {
    const map = { 'en-US': 'en', 'nl-NL': 'nl', en: 'en', nl: 'nl' };
    return map[locale] || locale;
};

function getLocale(req) {
    const cookieLocale = req.cookies.get('preferred-language')?.value;
    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
        return normalizeLocale(cookieLocale);
    }
    const acceptedLanguage = req.headers.get('accept-language') ?? undefined;
    if (acceptedLanguage) {
        const headers = { 'accept-language': acceptedLanguage };
        const languages = new Negotiator({ headers }).languages();
        const locale = match(languages, supportedLocales, defaultLocale);
        return normalizeLocale(locale);
    }
    return normalizeLocale(defaultLocale);
}

function getLocaleFromPathname(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const first = segments[0];
    const normalized = supportedLocales.map(normalizeLocale);
    if (normalized.includes(normalizeLocale(first))) return normalizeLocale(first);
    return null;
}

function removeLocaleFromPathname(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const first = segments[0];
    const normalized = supportedLocales.map(normalizeLocale);
    if (normalized.includes(normalizeLocale(first))) return '/' + segments.slice(1).join('/');
    return pathname;
}

export default auth(async (req) => {
    const { nextUrl } = req;
    const { pathname } = nextUrl;
    const isAuthenticated = !!req.auth;

    // ── Locale handling ──────────────────────────────────────────
    const currentLocale = getLocaleFromPathname(pathname);
    const pathnameWithoutLocale = removeLocaleFromPathname(pathname);

    if (!currentLocale) {
        const preferredLocale = getLocale(req);
        const newUrl = new URL(`/${preferredLocale}${pathname}`, req.url);
        newUrl.search = nextUrl.search;
        return NextResponse.redirect(newUrl);
    }

    // ── Auth guard ────────────────────────────────────────────────
    const SUCCESS_ROUTES = ['/trips/*/payment/*/success'];

    const isSuccessRoute = SUCCESS_ROUTES.some(r =>
        pathnameWithoutLocale.match(r.replace(/\*/g, '[^/]+')),
    );

    // ── Admin Route Handling ─────────────────────────────────────
    const isAdminDashboardRoute = pathnameWithoutLocale.startsWith('/admin/dashboard');
    const isAdminRoute = pathnameWithoutLocale === '/admin';
    const session = req.auth;

    if (isAdminRoute && isAuthenticated) {
        return Response.redirect(new URL(`/${currentLocale}/admin/dashboard`, nextUrl));
    }

    if (isAdminDashboardRoute) {
        if (!isAuthenticated) {
            return Response.redirect(new URL(`/${currentLocale}/admin`, nextUrl));
        }
    }

    const isPublicRoute =
        PUBLIC_ROUTES.find(r => pathnameWithoutLocale.startsWith(r)) ||
        pathnameWithoutLocale === '/' ||
        pathnameWithoutLocale === '/admin' ||
        isSuccessRoute;

    const isAuthRoute = notAccessAbleWhileLoggedIn.find(r =>
        pathnameWithoutLocale.includes(r),
    );

    if (isAuthenticated && isAuthRoute) {
        return Response.redirect(new URL(`/${currentLocale}${ROOT}`, nextUrl));
    }

    if (!isAuthenticated && !isPublicRoute) {
        return Response.redirect(new URL(`/${currentLocale}${LOGIN}`, nextUrl));
    }

    // ── Language cookie ───────────────────────────────────────────
    const response = NextResponse.next();
    response.headers.set('x-current-locale', currentLocale);

    const cookieLocale = req.cookies.get('preferred-language')?.value;
    if (!cookieLocale || normalizeLocale(cookieLocale) !== currentLocale) {
        response.cookies.set('preferred-language', currentLocale, {
            path: '/',
            maxAge: 365 * 24 * 60 * 60,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });
    }

    return response;
});

export const config = {
    matcher: ['/((?!_next|api|assets|.*\\..*).*)',],
};