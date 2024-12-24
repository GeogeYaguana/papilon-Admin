// src/types/types.ts

export interface AuthState {
    isAuthenticated: boolean;
    token: string | null;
    userId: number | null;
    userType: string | null;
  }
  
  export type AuthAction =
    | { type: 'LOGIN'; payload: { token: string; userId: number; userType: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_AUTH'; payload: { token: string; userId: number; userType: string } };
  