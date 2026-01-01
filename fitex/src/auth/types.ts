export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  googleId?: string;
  subscriptionStatus: 'free' | 'premium' | 'trial';
  subscriptionExpiry?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  deviceId: string;
  isActive: boolean;
  createdAt: string;
}

export interface GoogleAuthResponse {
  idToken: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name?: string;
    photo?: string;
  };
}

export interface AuthState {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isOffline: boolean;
  pendingActions: Array<{
    id: string;
    action: string;
    data: any;
    timestamp: string;
  }>;
}