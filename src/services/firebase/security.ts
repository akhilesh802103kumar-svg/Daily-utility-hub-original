/**
 * Future Firebase Security Architecture & Rule Specifications
 * Daily Utility Hub - All in One Website
 *
 * This specification establishes the security boundaries for future Firebase provisioning:
 *
 * 1. BACKEND-ENFORCED ADMIN ROLES:
 *    - Admin permissions MUST be set exclusively using Firebase Admin SDK on a trusted backend:
 *      `admin.auth().setCustomUserClaims(uid, { role: 'admin' })`
 *    - Never allow users to assign or modify roles through frontend code.
 *
 * 2. FIRESTORE DATA ISOLATION BLUEPRINT:
 *    ```rules
 *    rules_version = '2';
 *    service cloud.firestore {
 *      match /databases/{database}/documents {
 *        // Helper: Check authenticated
 *        function isAuthenticated() {
 *          return request.auth != null;
 *        }
 *        // Helper: Check owner
 *        function isOwner(userId) {
 *          return isAuthenticated() && request.auth.uid == userId;
 *        }
 *        // Helper: Check admin claim from token
 *        function isAdmin() {
 *          return isAuthenticated() && request.auth.token.role == 'admin';
 *        }
 *
 *        // Users collection: Private to owner, read/write restricted
 *        match /users/{userId} {
 *          allow read, update: if isOwner(userId) || isAdmin();
 *          allow create: if isOwner(userId) && !('role' in request.resource.data);
 *          allow delete: if isAdmin();
 *        }
 *
 *        // Subscriptions: Read-only to owner, writable ONLY by trusted backend
 *        match /subscriptions/{userId} {
 *          allow read: if isOwner(userId) || isAdmin();
 *          allow write: if false; // Cloud Functions / Admin SDK only
 *        }
 *
 *        // Multi-tenant Restaurant data: Strict isolation
 *        match /restaurants/{restaurantId} {
 *          allow read: if true; // Public menu viewing via QR code
 *          allow create: if isAuthenticated() && request.resource.data.ownerUid == request.auth.uid;
 *          allow update, delete: if isAuthenticated() && (resource.data.ownerUid == request.auth.uid || isAdmin());
 *        }
 *      }
 *    }
 *    ```
 *
 * 3. PAYMENT VERIFICATION:
 *    - Razorpay / Stripe signatures MUST be verified on a trusted server-side endpoint.
 *    - Never trust payment success callbacks emitted directly from the browser window.
 *
 * 4. API SECRETS:
 *    - Private keys (Razorpay Secret, Firebase Service Account, Gemini Server Keys)
 *      must remain in secure server environment variables.
 */

export const FIREBASE_SECURITY_SPEC = {
  isConfigured: false,
  rulesVersion: '2',
  enforceServerAdminClaims: true,
  enforceTenantIsolation: true,
  enforceServerSidePaymentVerification: true,
  zeroClientApiSecrets: true,
} as const;
