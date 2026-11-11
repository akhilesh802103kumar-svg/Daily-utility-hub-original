/**
 * Firestore Database Architecture & Security Contracts
 * Daily Utility Hub - All in One Website
 *
 * SECURITY ISOLATION PRINCIPLES:
 * 1. User Isolation: A user's documents (`users/{userId}`) are only accessible by that user.
 * 2. Multi-tenant Restaurant Isolation: Restaurant owners can only query/write documents where `ownerUid == request.auth.uid`.
 * 3. Subscription & Payments: Read-only to clients; write access restricted to backend webhooks/Cloud Functions.
 * 4. Admin Privileges: Enforced via Firebase Custom Claims verified in security rules (`request.auth.token.admin == true`).
 * 5. Firebase is NOT connected in this stage.
 */

import {
  UserProfile,
  SubscriptionStatus,
  RestaurantData,
  SavedInvitationDocument,
  PaymentVerificationRequest,
  PaymentVerificationResult,
} from './types';

export interface FirestoreServiceContract {
  // User Profile
  getUserProfile(userId: string): Promise<UserProfile | null>;
  saveUserProfile(profile: UserProfile): Promise<void>;

  // Subscriptions
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>;

  // Invitations (Client-side cloud save for registered users in Phase 2)
  getSavedInvitations(userId: string): Promise<SavedInvitationDocument[]>;
  saveInvitation(invitation: SavedInvitationDocument): Promise<void>;
  deleteInvitation(userId: string, invitationId: string): Promise<void>;

  // Multi-Tenant Restaurant QR Menu
  getRestaurant(restaurantId: string): Promise<RestaurantData | null>;
  saveRestaurant(restaurant: RestaurantData): Promise<void>;

  // Payment Verification (Delegated to trusted backend API)
  verifyPayment(request: PaymentVerificationRequest): Promise<PaymentVerificationResult>;
}

class FirestoreServiceStub implements FirestoreServiceContract {
  async getUserProfile(): Promise<UserProfile | null> {
    return null;
  }

  async saveUserProfile(): Promise<void> {
    throw new Error('Firestore is not connected in current stage.');
  }

  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
    return {
      userId,
      plan: 'free',
      status: 'active',
      features: {
        unlimitedPdfMerge: true,
        batchImageCompression: true,
        allPremiumInvitationTemplates: false, // Locked until Phase 2 subscription
        highResQrDownloads: true,
        customQrBranding: true,
      },
    };
  }

  async getSavedInvitations(): Promise<SavedInvitationDocument[]> {
    return [];
  }

  async saveInvitation(): Promise<void> {
    throw new Error('Firestore is not connected in current stage.');
  }

  async deleteInvitation(): Promise<void> {
    throw new Error('Firestore is not connected in current stage.');
  }

  async getRestaurant(): Promise<RestaurantData | null> {
    return null;
  }

  async saveRestaurant(): Promise<void> {
    throw new Error('Firestore is not connected in current stage.');
  }

  async verifyPayment(): Promise<PaymentVerificationResult> {
    throw new Error(
      'Payment verification must be processed through a trusted server-side endpoint. Client-side payment verification is strictly prohibited.'
    );
  }
}

export const firestoreService = new FirestoreServiceStub();
