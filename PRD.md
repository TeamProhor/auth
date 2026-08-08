# Prohor Auth — Product Requirements Document (PRD)

## Product Overview

**Prohor Auth** is the identity platform of the Prohor ecosystem.

It allows users to create a single **Prohor ID** and securely sign in to Prohor products and approved third-party applications.

The platform will work as an independent authentication provider similar to:

* Google Identity
* GitHub OAuth
* Auth0
* Clerk
* Keycloak

The core purpose is not just user login, but providing a complete identity infrastructure.

---

# Product Vision

Build a trusted identity layer where:

* Users have one universal Prohor account.
* Developers can integrate "Continue with Prohor".
* Applications never need to manage user passwords.
* Identity, security, and permissions are handled centrally.

---

# Initial Scope

The first version focuses on:

* Prohor Auth identity provider & SSO core
* User identity management & security center
* OAuth 2.1 provider (Authorization Code Flow with PKCE)
* OpenID Connect (OIDC) support (`/.well-known/openid-configuration`, `jwks.json`, `/oauth/userinfo`)
* Developer platform & dashboard (App registration, secrets, redirect URIs, scopes, user directory, RBAC)
* Seamless Bengali/English localized user experience

Future applications will integrate through standard OAuth/OIDC protocols.

---

# Core Architecture

Prohor Auth is built as a single full-stack Next.js 16 (App Router) application.

The application handles:

* Frontend UI & Design System (Landing, OAuth Consent, Personal Dashboard, Developer Portal)
* Next.js Route Handlers & Server Actions for Backend APIs
* Authentication logic & Session management
* OAuth 2.1 Provider Engine
* OpenID Connect Provider Engine
* Personal User Dashboard
* Developer Management Portal

The system follows a modular internal architecture with strict separation between UI components, backend route handlers, and database access logic.

---

# Technology Stack

## Application Framework

* Next.js 16 (App Router)
* React 19
* TypeScript
* Bun Package Manager & Runtime

---

## UI & Design System

* Tailwind CSS v4
* shadcn/ui (Base UI)
* Motion (Animations)
* Hugeicons & Iconify (`@iconify/react`)
* Recharts (Developer Analytics)

Design goals:

* Minimal & Modern Dark/Light theme
* Fast & Responsive
* Developer-focused
* Accessible

---

## Database & Data Layer

* **Database**: PostgreSQL
* **ORM**: Drizzle ORM (Type-safe query building, migrations, and schema management)
* **Client State & Data Fetching**: TanStack Query (`@tanstack/react-query`) for interactive dashboard state, client mutations, and real-time refreshes.

---

## Validation & Hashing

* **Validation**: Zod (For forms, API request schemas, OAuth requests, and env variables)
* **Password Hashing**: Argon2id (`@node-rs/argon2` or Bun native crypto)
* **JWT & Key Signing**: `jose` (RS256 algorithm for OIDC ID tokens and JWKS keypair management)

---

## Media Storage

* **UploadThing** (User avatars, Application logos, branding assets)

---

## Email & Notifications

* **Resend + React Email** (Email verification, magic link login, password reset, security login alerts)

---

## Deployment & Hosting

* **Vercel** (Application hosting, edge functions, environment configuration)

---

## Development Tools

* Biome (Linting & Formatting)
* GitHub Actions (CI/CD pipeline)

---

# Authentication System

Prohor Auth supports multiple authentication methods.

## Initial Methods

### Email Authentication

* Registration & Login with Password
* Magic Link Passwordless Sign-In
* Email verification
* Password reset & password change

### Social Authentication

* Google OAuth
* GitHub OAuth

Future expansion:

* Microsoft, Apple, Discord, Enterprise SAML/OIDC

---

# Account Model & Database Schema Blueprint

A user owns one universal Prohor identity linked across multiple authentication accounts and active sessions.

```
Prohor Identity (User)
├── Email Login Credentials
├── Google OAuth Link
├── GitHub OAuth Link
├── Active Device Sessions
└── Granted Developer Consents
```

### Core Database Tables (Drizzle ORM)

1. **`users`**: `id`, `name`, `email`, `email_verified`, `avatar_url`, `phone`, `dob`, `gender`, `bio`, `created_at`, `updated_at`
2. **`accounts`**: `id`, `user_id`, `provider` (email, google, github), `provider_account_id`, `password_hash`, `created_at`
3. **`sessions`**: `id`, `user_id`, `token`, `ip_address`, `user_agent`, `location`, `expires_at`, `created_at`
4. **`oauth_clients`**: `id`, `client_id`, `client_secret_hash`, `name`, `app_type` (web, native, service), `redirect_uris` (array), `logo_url`, `created_by_user_id`, `created_at`
5. **`authorization_codes`**: `id`, `code`, `client_id`, `user_id`, `redirect_uri`, `scope`, `code_challenge`, `code_challenge_method`, `expires_at`
6. **`access_tokens` / `refresh_tokens`**: `id`, `token_hash`, `client_id`, `user_id`, `scope`, `expires_at`, `revoked`
7. **`user_consents`**: `id`, `user_id`, `client_id`, `granted_scopes`, `created_at`
8. **`audit_logs`**: `id`, `user_id`, `event_type` (login, password_change, app_approved, session_revoked), `ip_address`, `details`, `created_at`

---

# Session Management

The platform uses secure session-based authentication with real-time session control.

Features:

* HttpOnly & Secure SameSite cookies
* Session expiration & sliding renewals
* Device tracking (IP, Browser/OS detection, Geo-location string)
* Active session list in User Security Center
* Single session revocation & "Logout from all devices" capability

---

# OAuth 2.1 Provider Engine

Prohor Auth acts as an independent OAuth 2.1 identity provider.

Supported Flow:

* **Authorization Code Flow with PKCE** (`S256` code challenge method required for public clients)
* **Refresh Tokens** (With token rotation and reuse detection)

Flow Architecture:

```
Third-Party App / Prohor Product
       ↓
GET /api/oauth/authorize (Validate client_id, redirect_uri, scope, code_challenge)
       ↓
Prohor Auth (/oauth/consent UI)
       ↓
User Approves Scopes
       ↓
Generates single-use Authorization Code
       ↓
Redirect back to Third-Party App redirect_uri with code
       ↓
POST /api/oauth/token (Exchange code + PKCE code_verifier for Access & ID Tokens)
```

---

# OpenID Connect (OIDC) Provider Engine

Prohor Auth implements standard OpenID Connect specifications:

* **Discovery Endpoint**: `GET /.well-known/openid-configuration`
* **JWKS Endpoint**: `GET /api/jwks.json` (Exposes RS256 public keys for third-party token validation)
* **ID Tokens**: Signed JWT containing claims (`sub`, `iss`, `aud`, `exp`, `iat`, `name`, `email`, `picture`)
* **UserInfo Endpoint**: `GET /api/oauth/userinfo` (Bearer token protected)

---

# Developer Dashboard Features (`/developer/*`)

Developers can:

* **Application Registration**: Create Web (PKCE), Mobile, or Service (M2M) apps.
* **Credentials Management**: View `client_id`, generate and securely copy/rotate `client_secret`.
* **Redirect URIs**: Dynamically add and remove allowed callback URIs.
* **Consent Screen Customization**: Configure app logo, brand colors, and description.
* **User Directory (`/developer/users`)**: View connected app users, search/filter, inspect user details, adjust permissions, or ban/unban users.
* **RBAC & Analytics (`/developer/rbac`, `/developer/analytics`)**: Define roles, manage permissions, view request stats and rate limits.

---

# User Dashboard Features (`/dashboard/*`)

Users can:

* **Profile Management (`/dashboard/profile`)**: Update name, avatar (UploadThing), phone, birth date, gender, and bio.
* **Security & Sessions (`/dashboard/security`)**: Change password, toggle 2FA/Passkeys, view active login sessions with IP/device info, revoke specific devices or log out everywhere.
* **Connected Applications**: View third-party applications granted access and revoke permissions.
* **Billing & Privacy (`/dashboard/billing`, `/dashboard/privacy`)**: View storage/tier status and data privacy controls.

---

# Security Requirements

* **Password Protection**: Argon2id hashing with secure salts.
* **PKCE Enforcement**: Mandatory PKCE for all authorization code requests.
* **Token Rotation**: Refresh tokens are rotated upon use; detected reuse invalidates the token family.
* **CSRF & Rate Limiting**: Strict CSRF protection on mutation endpoints and rate limiting on `/login`, `/magic-link`, `/oauth/token`.
* **Audit Logging**: Comprehensive logging of security events in `audit_logs`.

---

# Development Strategy & Roadmap

## Phase 1 — Database & Core Auth Engine (Current Focus)
* Install missing core backend packages (`drizzle-orm`, `postgres`, `zod`, `@tanstack/react-query`, `jose`, `@node-rs/argon2`, `uploadthing`, `resend`).
* Implement PostgreSQL Drizzle schema and migrations.
* Wire `/login`, `/magic-link`, and session cookies to live DB handlers.

## Phase 2 — OAuth 2.1 & OIDC Engine
* Build `/api/oauth/authorize`, `/api/oauth/token`, `/.well-known/openid-configuration`, `/api/jwks.json`, and `/api/oauth/userinfo`.
* Connect `/oauth/consent` page to real authorization code generation.

## Phase 3 — Developer Portal & User Center Wire-up
* Connect `/developer/apps` to database CRUD operations (create app, rotate secret, update URIs).
* Connect `/developer/users` to database query pagination.
* Connect `/dashboard/profile` & `/dashboard/security` to live user state, UploadThing avatar upload, and session revocation.

---

**Product Principle**

Prohor Auth is not a simple login form. It is the complete identity and security infrastructure that powers every Prohor product and external third-party application with trust and simplicity.

