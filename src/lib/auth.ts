import { account, databases, ID, DATABASE_ID, USERS_COLLECTION_ID } from './appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface AuthError {
  message: string;
  code?: number;
}

export class AuthService {
  // Helper method to check available session methods
  static checkAvailableMethods() {
    console.log('=== Appwrite Account Methods ===');
    console.log('All methods:', Object.getOwnPropertyNames(account));
    console.log('createEmailSession exists:', typeof account.createEmailSession === 'function');
    console.log('createSession exists:', typeof account.createSession === 'function');
    console.log('create exists:', typeof account.create === 'function');
    console.log('get exists:', typeof account.get === 'function');
    console.log('deleteSessions exists:', typeof account.deleteSessions === 'function');
    console.log('===============================');
  }

  static async signUp(email: string, password: string, name: string, phone?: string): Promise<User> {
    try {
      const user = await account.create(
        ID.unique(),
        email,
        password,
        name
      );
      // Create session after signup
      await account.createEmailSession(email, password);
      // Store additional user data in database
      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          email: user.email,
          name: name,
          phone: phone || '',
          createdAt: new Date().toISOString()
        }
      );
      return {
        $id: user.$id,
        email: user.email,
        name: name,
        phone: phone,
        createdAt: user.$createdAt
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to create account',
        code: error.code
      };
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      await account.createEmailSession(email, password);
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.$createdAt
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to sign in',
        code: error.code
      };
    }
  }

  // Phone/OTP methods
  static async sendPhoneOTP(phone: string): Promise<{ userId: string }> {
    try {
      const userId = ID.unique();
      await account.createPhoneSession(userId, phone);
      return { userId };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to send OTP',
        code: error.code
      };
    }
  }

  static async verifyPhoneOTP(userId: string, secret: string): Promise<User> {
    try {
      await account.updatePhoneSession(userId, secret);
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.$createdAt
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to verify OTP',
        code: error.code
      };
    }
  }

  // Magic link methods
  static async sendMagicLink(email: string): Promise<void> {
    try {
      await account.createMagicURLSession(ID.unique(), email, `${window.location.origin}/auth/callback`);
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to send magic link',
        code: error.code
      };
    }
  }

  // OAuth 2.0 methods
  static async createOAuth2Session(provider: 'google' | 'github' | 'discord', successUrl?: string, failureUrl?: string): Promise<void> {
    try {
      const success = successUrl || `${window.location.origin}/auth/callback`;
      const failure = failureUrl || `${window.location.origin}/auth/callback?error=oauth_failed`;
      
      await account.createOAuth2Session(provider, success, failure);
    } catch (error: any) {
      throw {
        message: error.message || `Failed to authenticate with ${provider}`,
        code: error.code
      };
    }
  }

  static async signOut(): Promise<void> {
    try {
      await account.deleteSessions();
    } catch (error: any) {
      throw {
        message: error.message || 'Failed to sign out',
        code: error.code
      };
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await account.get();
      return {
        $id: user.$id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        createdAt: user.$createdAt
      };
    } catch (error) {
      return null;
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      await account.get();
      return true;
    } catch (error) {
      return false;
    }
  }
} 