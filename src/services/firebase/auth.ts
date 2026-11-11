/**
 * Firebase Authentication Service Architecture
 * Daily Utility Hub - All in One Website
 *
 * ARCHITECTURAL DESIGN:
 * - Decoupled auth interface to enable clean dependency injection
 * - Custom claims for RBAC (admin, creator, restaurant_owner) set via trusted server/Cloud Function only
 * - NEVER allows users to elevate their own privileges from client code
 * - Firebase is NOT connected in this stage.
 */

import { UserProfile, UserRole } from './types';

export interface FirebaseAuthContract {
  getCurrentUser(): Promise<UserProfile | null>;
  signInWithGoogle(): Promise<UserProfile>;
  signInWithEmail(email: string, password: string): Promise<UserProfile>;
  signUpWithEmail(email: string, password: string, displayName: string): Promise<UserProfile>;
  signOut(): Promise<void>;
  getIdToken(): Promise<string | null>;
  hasRole(role: UserRole): Promise<boolean>;
}

/**
 * Stub service for future implementation when Firebase is provisioned.
 * Guarantees no fake login is shown to users now.
 */
class FirebaseAuthStub implements FirebaseAuthContract {
  async getCurrentUser(): Promise<UserProfile | null> {
    // Current stage: No login required, all active tools run client-side.
    return null;
  }

  async signInWithGoogle(): Promise<UserProfile> {
    throw new Error(
      'Firebase Authentication is scheduled for Phase 2. No live Firebase connection is active.'
    );
  }

  async signInWithEmail(): Promise<UserProfile> {
    throw new Error(
      'Firebase Authentication is scheduled for Phase 2. No live Firebase connection is active.'
    );
  }

  async signUpWithEmail(): Promise<UserProfile> {
    throw new Error(
      'Firebase Authentication is scheduled for Phase 2. No live Firebase connection is active.'
    );
  }

  async signOut(): Promise<void> {
    // No-op in current stage
  }

  async getIdToken(): Promise<string | null> {
    return null;
  }

  async hasRole(): Promise<boolean> {
    // Default to false: prevents client-side elevation
    return false;
  }
}

export const firebaseAuthService = new FirebaseAuthStub();
