/**
 * Firebase Cloud Storage Architecture & Guardrails
 * Daily Utility Hub - All in One Website
 *
 * STORAGE RULES REQUIREMENTS (FOR FUTURE PHASE):
 * - User avatars: `users/{userId}/avatar.jpg` (max 2MB, image/jpeg or image/png only)
 * - Restaurant menu images: `restaurants/{restaurantId}/items/{itemId}.jpg` (max 5MB)
 * - Temporary processing files: NOT stored in Cloud Storage (processed client-side in browser RAM)
 * - Firebase is NOT connected in this stage.
 */

export interface FirebaseStorageContract {
  uploadUserAvatar(userId: string, file: File): Promise<string>;
  uploadRestaurantImage(restaurantId: string, file: File): Promise<string>;
  deleteFile(fileUrl: string): Promise<void>;
}

class FirebaseStorageStub implements FirebaseStorageContract {
  async uploadUserAvatar(): Promise<string> {
    throw new Error('Firebase Storage is not connected in current stage.');
  }

  async uploadRestaurantImage(): Promise<string> {
    throw new Error('Firebase Storage is not connected in current stage.');
  }

  async deleteFile(): Promise<void> {
    throw new Error('Firebase Storage is not connected in current stage.');
  }
}

export const firebaseStorageService = new FirebaseStorageStub();
