# 🔐 Admin Login Architecture & Flow

Complete reference for the secure admin login flow in Mahii.

---

## 1. Overview

The secure admin login flow is designed with layered protection:

- **Hidden route**: `/secure-admin-portal`
- **Secret invite key**: first gate before credentials
- **Email + password**: standard admin authentication
- **Optional MFA**: second-factor verification when enabled
- **IP whitelisting**: restrict access to allowed networks
- **Rate limiting**: 5 attempts per 15 minutes
- **Session management**: single admin session with 30-minute timeout
- **Audit logging**: login attempts are logged for review

---

## 2. Frontend Implementation

### 2.1 Hidden portal page

- File: `client/src/pages/admin/SecureAdminLogin.jsx`
- Route: `/secure-admin-portal`
- Flow:
  1. Secret key verification via `/api/auth/verify-admin-secret`
  2. Admin email/password login via `/api/auth/admin/login`
  3. MFA code entry via `/api/auth/verify-mfa` when required

### 2.2 Route registration

- File: `client/src/App.js`
- Added route:
  - `<Route path="/secure-admin-portal" element={<SecureAdminLogin />} />`

### 2.3 Old admin login entry

- File: `client/src/pages/auth/AdminLogin.jsx`
- This route now performs a redirect to `/secure-admin-portal`
- The visible admin login link was intentionally removed from Navbar and shop owner login pages to keep the portal hidden

### 2.4 Auth service

- File: `client/src/services/api.js`
- Added API helpers:
  - `verifyAdminSecret`
  - `adminLogin`
  - `verifyMfa`
- Existing admin login flow in `AuthContext.jsx` now allows passing the secret key into `adminLogin`

---

## 3. Backend Security Implementation

### 3.1 Auth routes

- File: `server/routes/authRoutes.js`
- New endpoints:
  - `POST /api/auth/verify-admin-secret`
  - `POST /api/auth/admin/login`
  - `POST /api/auth/verify-mfa`
- Security middleware applied to admin endpoints:
  - `ipWhitelist(allowedIPs)`
  - `adminRateLimiter`

### 3.2 Security middleware

- File: `server/middleware/adminSecurityMiddleware.js`
- Features:
  - `adminRateLimiter` limits requests to 5 attempts per 15 minutes
  - `ipWhitelist` allows only configured IPs and blocks everything else

### 3.3 Audit logging

- File: `server/models/AdminLoginAttempt.js`
- Stores:
  - `email`
  - `endpoint`
  - `ipAddress`
  - `userAgent`
  - `success`
  - `message`
  - `timestamp`
- Logged in `verifyAdminSecret`, `adminLogin`, and related hidden admin access flows

### 3.4 Admin session enforcement

- File: `server/middleware/authMiddleware.js`
- For `admin` and `super_admin` users, JWT validation now checks:
  - session ID matches `user.adminSessionId`
  - session expiration time is valid
  - client IP matches `user.adminSessionIp`

### 3.5 Admin login controller behavior

- File: `server/controllers/authController.js`
- `verifyAdminSecret`
  - validates the provided secret key against `ADMIN_SECRET_KEY`
  - logs failed attempts
- `adminLogin`
  - requires `email`, `password`, and `secretKey`
  - verifies the admin user role
  - creates a single session token with:
    - `sessionId`
    - `adminSessionIp`
    - `adminSessionExpiresAt`
  - returns JWT token with a 30-minute expiry by default
- `verifyMfa`
  - validates one-time code using `speakeasy`
  - requires `mfaEnabled` and `mfaSecret` on the user record

### 3.6 Admin invite model

- File: `server/models/AdminInvite.js`
- Supports invite-based admin onboarding with:
  - `code`
  - `email`
  - `role`
  - `permissions`
  - `createdBy`
  - `expiresAt`
  - `isUsed`

### 3.7 Email helper

- File: `server/utils/email.js`
- Sends admin invite emails when an admin invite is created

---

## 4. User model additions

- File: `server/models/User.js`
- Added admin session fields:
  - `adminSessionId`
  - `adminSessionIp`
  - `adminSessionExpiresAt`
- Added MFA fields:
  - `mfaEnabled`
  - `mfaSecret`

---

## 5. Environment variables

Required configuration in `server/.env`:

```text
ADMIN_SECRET_KEY=swaadsetu_admin_secret_key_2026_newkey
ADMIN_ALLOWED_IPS=127.0.0.1,::1,192.168.1.100
ADMIN_SESSION_TIMEOUT_MINUTES=30
```

### Notes

- `ADMIN_SECRET_KEY` protects the hidden portal and must remain private
- `ADMIN_ALLOWED_IPS` restricts access to trusted IP addresses
- `ADMIN_SESSION_TIMEOUT_MINUTES` controls session lifetime for admin tokens

---

## 6. How the flow works

### Step 1 — Hidden portal access

- User opens `/secure-admin-portal`
- The page is not linked from public navigation
- The first step requires the secret key

### Step 2 — Email/password login

- After secret key verification, the admin enters email and password
- The backend requires the same `secretKey` again for extra protection

### Step 3 — MFA verification

- If the admin account has `mfaEnabled`, the user is prompted for an authenticator code
- `POST /api/auth/verify-mfa` validates the code against the stored `mfaSecret`

### Step 4 — Protected session

- Successful login issues a JWT containing a session ID
- Protected admin routes validate the token plus the stored session data
- IP mismatches or expired sessions reject access

---

## 7. Admin route protection

Protected routes are served through:

- `server/middleware/authMiddleware.js`
- `server/routes/adminRoutes.js`
- `server/controllers/adminController.js`

### Example protected endpoints

- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id`
- `GET /api/admin/shops`
- `PUT /api/admin/shops/:id/approve`
- `GET /api/admin/reports/revenue`
- `POST /api/admin/invite` (super admin only)

---

## 8. Important security notes

- The admin portal is intentionally unlinked from public navigation
- IP whitelist and rate limiting are enforced before any admin login logic
- Audit logs capture failed admin secret attempts and login attempts
- Only `admin` and `super_admin` roles can access admin routes
- The login flow is protected by both secret key and application credentials

---

## 9. Maintenance & extension

### Adding a new allowed IP

Update `ADMIN_ALLOWED_IPS` in `server/.env` and restart the backend.

### Extending login timeout

Adjust `ADMIN_SESSION_TIMEOUT_MINUTES` and restart the backend.

### Enabling MFA for an admin

Add `mfaEnabled: true` and a valid `mfaSecret` to the admin user record.

### Troubleshooting

- `403 Access denied from this IP address` → check `ADMIN_ALLOWED_IPS`
- `Invalid secret key` → verify `ADMIN_SECRET_KEY`
- `Too many admin login attempts` → wait 15 minutes or adjust rate limiter
- `Session invalid` → token session mismatch or IP changed

---

## 10. File references

| File | Purpose |
|---|---|
| `client/src/pages/admin/SecureAdminLogin.jsx` | Secure admin login UI and step flow |
| `client/src/pages/auth/AdminLogin.jsx` | Redirects legacy admin login route to secure portal |
| `client/src/App.js` | Registers `/secure-admin-portal` route |
| `client/src/services/api.js` | Admin auth API helpers |
| `client/src/contexts/AuthContext.jsx` | Admin login wrapper and token storage |
| `server/routes/authRoutes.js` | Auth endpoints and middleware wiring |
| `server/middleware/adminSecurityMiddleware.js` | Rate limiting and IP whitelist |
| `server/controllers/authController.js` | Admin login, secret verify, MFA verify logic |
| `server/middleware/authMiddleware.js` | JWT and admin session validation |
| `server/models/AdminLoginAttempt.js` | Audit log schema |
| `server/models/AdminInvite.js` | Admin invite management schema |
| `server/models/User.js` | Admin session/MFA fields |
| `server/utils/email.js` | Invite email sender |
