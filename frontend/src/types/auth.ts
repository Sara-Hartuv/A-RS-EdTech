// src/types/auth.ts
import type { User } from './user';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
