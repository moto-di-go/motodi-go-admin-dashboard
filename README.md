# MOTO'DI GO Admin Dashboard

## Current Delivery State

This repository delivers the ADMIN-AUTH-001 shell and ADMIN-KYC-001 review workflow on Astro/Tailwind:

- server-side admin session with the HttpOnly `motodi_admin_session` cookie;
- login, refresh-on-navigation and logout through the API Gateway;
- RBAC-filtered navigation for platform admin, support and agency profiles;
- protected dashboard pages plus `login`, `unauthorized` and `session-expired` pages;
- connected KYC review queue, document detail, decision history and validate/reject actions.

The operations, pricing/SIG, moderation, KPI and agency business screens still use local mock data. Their backend integration remains covered by the follow-up admin tickets.

## Environment

Copy `.env.example` and configure:

```bash
API_BASE_URL=http://localhost:8080/api/v1
API_TIMEOUT_MS=30000
PUBLIC_APP_ENV=local
ADMIN_SESSION_COOKIE_NAME=motodi_admin_session
ADMIN_SESSION_COOKIE_SECURE=false
```

## Local Checks

```bash
npm ci
npm test
npm run check
npm run build
```
