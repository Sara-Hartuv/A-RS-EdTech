// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types/user';
import * as authApi from '../api/auth.api';

interface AuthStore {
  // State
  user: User | null;
  token: string | null;
  isLoading: boolean; // true while initializing or authenticating
  error: string | null;

  // Actions
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User | null) => void;
  initAuth: () => Promise<void>;

  // Computed helpers (selectors should derive booleans from state)
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      isLoading: false,
      error: null,

      // Computed property
      get isAuthenticated() {
        return !!get().user && !!get().token;
      },

      // Login action
      login: async (phone: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ phone, password });
          const { user, token } = response.data;

          set({ user, token: token || null, error: null });
        } catch (err: unknown) {
          const errorMessage = (err as any)?.response?.data?.message || 'Login failed';
          set({ user: null, token: null, error: errorMessage });
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action: clear server session then local state
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          set({ user: null, token: null, error: null, isLoading: false });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set user manually (can be used after token-only restore)
      setUser: (user: User | null) => set({ user }),

      // Initialize auth on app start: if token exists, try to load current user
      initAuth: async () => {
        set({ isLoading: true });
        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const res = await authApi.getCurrentUser();
          set({ user: res.data });
        } catch (err) {
          // Token invalid or user not found -> clear token
          set({ user: null, token: null, error: null });
        } finally {
          set({ isLoading: false });
        }
      },

      // (Keep computed logic internal to callers/selectors)

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.role === role;
      },

      isStudent: () => get().hasRole('student'),
      isTeacher: () => get().hasRole('teacher'),
      isAdmin: () => get().hasRole('admin'),
    }),
    {
      name: 'auth-storage', // localStorage key
      // Persist only token to avoid stale user data causing inconsistent state
      partialize: (state) => ({ token: state.token }),
    }
  )
);
