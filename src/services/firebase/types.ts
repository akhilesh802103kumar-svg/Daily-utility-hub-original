/**
 * Firebase Architecture & Data Model Contracts
 * Daily Utility Hub - All in One Website
 *
 * NOTE: Firebase is NOT connected in this stage.
 * These interfaces define the strict data contracts and security boundaries
 * for future Firebase Authentication, Firestore, and Storage provisioning.
 */

export type UserRole = 'user' | 'creator' | 'restaurant_owner' | 'admin';

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_annual';

export type SubscriptionState = 'active' | 'inactive' | 'trialing' | 'cancelled' | 'expired';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  preferences?: {
    language: 'en' | 'hi';
    theme: 'light' | 'dark' | 'system';
  };
}

export interface SubscriptionStatus {
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionState;
  startedAt?: string;
  expiresAt?: string;
  paymentGateway?: 'razorpay' | 'stripe';
  externalSubscriptionId?: string;
  features: {
    unlimitedPdfMerge: boolean;
    batchImageCompression: boolean;
    allPremiumInvitationTemplates: boolean;
    highResQrDownloads: boolean;
    customQrBranding: boolean;
  };
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  expectedAmount: number;
  currency: 'INR' | 'USD';
}

export interface PaymentVerificationResult {
  verified: boolean;
  verifiedAt: string;
  transactionId: string;
  receiptUrl?: string;
  message?: string;
}

export interface RestaurantData {
  restaurantId: string;
  ownerUid: string; // Enforces strict data ownership in Firestore security rules
  restaurantName: string;
  tagline?: string;
  contactPhone: string;
  address: string;
  gstNumber?: string;
  menuCategories: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      title: string;
      description?: string;
      price: number;
      isVeg: boolean;
      isAvailable: boolean;
      imageUrl?: string;
    }>;
  }>;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedInvitationDocument {
  id: string;
  userId: string; // Foreign key to UserProfile.uid
  templateId: string;
  eventTitle: string;
  hostName: string;
  honoree: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  address: string;
  invitationMessage: string;
  rsvpInfo: string;
  fontChoice: string;
  textColor: string;
  accentColor: string;
  createdAt: string;
  updatedAt: string;
}
