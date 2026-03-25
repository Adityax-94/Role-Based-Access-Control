import axiosInstance from './axiosInstance';
import type { ApiResponse, AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types';

/**
 * Authentication API calls.
 * All functions return the inner `data` payload from the ApiResponse wrapper.
 */

export const authApi = {
  /**
   * Register a new user account.
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/auth/register',
      credentials
    );
    return data.data!;
  },

  /**
   * Login with email + password, receive a JWT token.
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await axiosInstance.post<ApiResponse<AuthResponse>>(
      '/api/auth/login',
      credentials
    );
    return data.data!;
  },

  /**
   * Fetch the currently authenticated user's profile.
   * Requires a valid JWT (attached automatically by Axios interceptor).
   */
  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get<ApiResponse<User>>('/api/auth/me');
    return data.data!;
  },
};
