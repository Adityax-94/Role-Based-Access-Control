import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import type { LoginCredentials, RegisterCredentials } from '@/types';

/**
 * Primary hook for all authentication actions.
 *
 * Provides:
 *  - Current auth state (token, user, isAuthenticated)
 *  - loginMutation  — login via email/password
 *  - registerMutation — create a new account
 *  - logout         — clear state and redirect
 */
export function useAuth() {
  const { token, user, isAuthenticated, setAuth, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Login ────────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.clear(); // fresh slate after login
      navigate('/dashboard');
    },
  });

  // ── Register ─────────────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
    onSuccess: (data) => {
      setAuth(data);
      queryClient.clear();
      navigate('/dashboard');
    },
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    clearAuth();
    queryClient.clear();
    navigate('/login');
  };

  return {
    // State
    token,
    user,
    isAuthenticated,
    // Mutations
    loginMutation,
    registerMutation,
    // Actions
    logout,
  };
}
