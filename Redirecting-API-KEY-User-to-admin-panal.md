# Redirecting Wordpress Plugin user to Admin Panel

Tags: Analysis, Engineering, Research, completed
Created time: March 29, 2026 12:51 PM
Created by: Shahadat Hussain Ripon _devripon

## The Problem I Need to Solve

My `DashboardLayout` does `const session = await auth()` and redirects to `/` if no session. So the API key user hitting `/trip/create` will always get kicked out. I need to **silently exchange the API key for a real NextAuth session** before the layout runs.

The best place to do this is **middleware** — it runs before everything.

---

## The Complete Flow

Here's what I’ll build: 

![image.png](Redirecting%20Wordpress%20Plugin%20user%20to%20Admin%20Panel/image.png)

---

## Step 1 — NestJS: Add a validate-api-key endpoint

This endpoint receives the API key, validates it, and returns the user data so Next.js can sign them in.

```tsx
// auth.controller.ts
@Public()
@Post('signin-with-api-key')
async signInWithApiKey(
  @Body('apiKey') apiKey: string,
  @Res({ passthrough: true }) res: Response,
): Promise<AuthResponse> {
  const response = await this.authService.validateApiKeyAndGetUser(apiKey);
  const nodeEnv = this.config.get<string>('NODE_ENV');
  res.cookie('refreshToken', response.refreshToken, {
    httpOnly: true,
    secure: nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
  return response;
}
```

```tsx
// auth.service.ts
/**
 * Validate API key and get user data
 * @param apiKey API key to validate
 * @returns Auth response with user data and tokens
 * @throws UnauthorizedException if API key is invalid
 */
async validateApiKeyAndGetUser(apiKey: string): Promise<AuthResponse> {
  // Find tenant by API key
  const tenant = await this.prisma.apiKey.findUnique({
    where: { key: apiKey },
    include: { tenant: true },
  });

  if (!tenant) {
    throw new UnauthorizedException('Invalid API key');
  }

  // Get Tenant User
  const tenantUser = await this.prisma.user.findUnique({
    where: { id: tenant.tenant.ownerId },
  });
  if (!tenantUser) {
    throw new UnauthorizedException('Invalid API key');
  }

  // Generate tokens for that user — reuse my existing getToken()
  const tokens = await this.getToken(
    tenantUser?.id,
    tenantUser?.email,
    'b2b',
    tenantUser?.role,
  );

  return {
    id: tenantUser?.id,
    name: tenantUser?.name,
    email: tenantUser?.email,
    tenantId:
      tenantUser?.tenantId || tenantUser?.createdByTenantId || undefined,
    role: tenantUser?.role,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    userType: 'b2b',
  };
}
```

---

## Step 2 — Next.js: The `/api/auth/wp-login` route

This is what the WordPress form POSTs to. It calls my NestJS endpoint, uses my existing `signIn('credentials-user')` silently, then redirects.

```tsx
// app/api/auth/wp-login/route.ts
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
```

---

## Step 3 — Add a new credentials provider in `auth.ts`

I already have `credentials-user` and `credentials-customer`. I will add a third one specifically for API key login — it skips the password check entirely and uses the pre-validated token data.

```tsx
// auth.ts — add inside providers: []
CredentialsProvider({
  id: 'credentials-api-key',
  name: 'API Key Login',
  credentials: {
    userId: {},
    accessToken: {},
    refreshToken: {},
    email: {},
    name: {},
    role: {},
    internalSecret: {},
  },
  async authorize(credentials) {
    // Verify this is a legitimate internal call
    if (credentials.internalSecret !== process.env.INTERNAL_API_KEY_SECRET) {
      return null;
    }

    // No password check needed — NestJS already validated the API key
    return {
      id: credentials.userId,
      email: credentials.email,
      name: credentials.name,
      role: credentials.role,
      tenantId: credentials.tenantId,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      provider: 'credentials-user', // treat same as a normal user session
      userType: 'user',
    };
  },
});
```

---

## Step 4 — WordPress plugin (the form)

```php
$api_key    = get_option('my_plugin_api_key');
$locale     = 'en';
$redirect   = '/trip/create';

echo '
<form method="POST" action="https://mydomain.com/api/auth/wp-login">
  <input type="hidden" name="api_key"  value="' . esc_attr($api_key) . '">
  <input type="hidden" name="redirect" value="' . esc_attr($redirect) . '">
  <input type="hidden" name="locale"   value="' . esc_attr($locale) . '">
  <button type="submit">Create Trip</button>
</form>';
```

---

## Step 5 — Add `INTERNAL_API_KEY_SECRET` to my `.env`

```bash
INTERNAL_API_KEY_SECRET=some-long-random-secret-only-my-server-knows
```

Generate it with:

```bash
openssl rand -base64 32
```

This secret makes sure nobody can call my `credentials-api-key` provider directly from outside — only my `/api/auth/wp-login` route can use it.

---

## What changes in my existing code

**Nothing in `DashboardLayout`** — it already does `const session = await auth()` and checks `session?.accessToken`. Once the cookie is set, it just works.

**Nothing in `fetchWithAuth`** — it reads from the session normally.

**Nothing in `handleSignInWithCredentials`** — that's only for the manual login form.

The only things I need to add are the new NestJS endpoint, the new Next.js API route, and the new credentials provider. Everything else flows through my existing session/token infrastructure unchanged.

---

## WordPress Flow Understanding

So my WordPress plugin user always hits one endpoint with requested URL in the body.

Yes, exactly. That's the cleanest approach.

The WordPress plugin always does **one thing only** — hit my single handshake endpoint with the API key and where the user wants to go:

```php
// WordPress plugin — every button/link works the same way
$api_key  = get_option('my_plugin_api_key');

// Create trip button
echo '
<form method="POST" action="https://mydomain.com/api/auth/wp-login">
  <input type="hidden" name="api_key"    value="' . esc_attr($api_key) . '">
  <input type="hidden" name="redirect"   value="/trip/create">
  <input type="hidden" name="locale"     value="en">
  <button type="submit">Create Trip</button>
</form>';

// Edit trip button
echo '
<form method="POST" action="https://mydomain.com/api/auth/wp-login">
  <input type="hidden" name="api_key"    value="' . esc_attr($api_key) . '">
  <input type="hidden" name="redirect"   value="/trip/edit/123">
  <input type="hidden" name="locale"     value="en">
  <button type="submit">Edit Trip</button>
</form>';
```

My Next.js endpoint receives it, validates once, sets the session, and sends the user wherever `redirect` says. The plugin never needs to know about sessions, tokens, or auth — it just says *"here's my key, send user here."*

One thing worth noting — if the user is **already logged in** from a previous click, I don't want to re-run the whole handshake every time. So I will add a small check at the top of my `/api/auth/wp-login` route:

```tsx
export async function POST(req: NextRequest) {
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

  // Otherwise do the full api key → session exchange
  // ... rest of my existing code
}
```

This way the first click does the full auth handshake, and every subsequent click in the same browser session just redirects instantly.

---

## Refresh Token & Middleware

Yes, **completely unchanged.** Here's why everything still works:

---

## What stays the same and why

**`auth.ts` JWT callback** — unchanged. Once the `credentials-api-key` provider creates the session, the JWT callback takes over exactly like any other login. It stores tokens in Redis, handles refresh, everything runs the same.

**`refreshAccessToken()`** — unchanged. The session created from the API key contains a real `accessToken` and `refreshToken` from my NestJS backend. When the access token expires, the refresh logic kicks in exactly as it does for normal users.

**`fetchWithAuth`** — unchanged. It just reads `session.accessToken` — it doesn't care how the session was created.

**`DashboardLayout`** — unchanged. It calls `auth()`, finds a valid session, and proceeds normally.

**My NestJS guards** — unchanged. The `JwtOrApiKeyGuard` keeps working for direct API calls. The WordPress plugin flow never even reaches that guard because requests come from my Next.js server with a proper Bearer token.

---

## The only thing I need to add

Think of it like a funnel:

```
WordPress plugin (API key)
        ↓
/api/auth/wp-login        ← new, one time only
        ↓
NextAuth session created  ← same as normal login
        ↓
Everything below is identical to a regular logged-in user
        ↓
JWT refresh, Redis, fetchWithAuth, middleware — all unchanged
```

The API key is just an **alternative entry point** into my existing auth system. Once the session exists, my app has no idea whether the user logged in with email/password, OAuth, or an API key — it treats them all the same.