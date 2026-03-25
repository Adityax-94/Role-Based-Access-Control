import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, User } from '@/types';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setAuth: (authResponse: AuthResponse) => void;
  logout: () => void;
}

/**
 * Global auth state powered by Zustand.
 *
 * `persist` middleware automatically syncs token + user to localStorage
 * under the key 'rbac_auth', so the session survives page refreshes.
 *
 * The Axios interceptor reads the raw 'rbac_token' key for simplicity;
 * we keep them in sync here via setAuth / logout.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (authResponse: AuthResponse) => {
        const user: User = {
          id: authResponse.id,
          name: authResponse.name,
          email: authResponse.email,
          role: authResponse.role,
        };

        // Also write the raw token so the Axios interceptor can read it
        localStorage.setItem('rbac_token', authResponse.token);

        set({
          token: authResponse.token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('rbac_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'rbac_auth', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
