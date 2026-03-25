import axiosInstance from './axiosInstance';
import type { ApiResponse, AdminContent, PublicContent, UserContent, User } from '@/types';

/**
 * Resource API — fetches role-gated content from the backend.
 */
export const resourceApi = {
  /**
   * GET /api/public — no token required.
   */
  getPublicContent: async (): Promise<PublicContent> => {
    const { data } = await axiosInstance.get<ApiResponse<PublicContent>>('/api/public');
    return data.data!;
  },

  /**
   * GET /api/user — requires USER or ADMIN role.
   */
  getUserContent: async (): Promise<UserContent> => {
    const { data } = await axiosInstance.get<ApiResponse<UserContent>>('/api/user');
    return data.data!;
  },

  /**
   * GET /api/admin — requires ADMIN role.
   */
  getAdminContent: async (): Promise<AdminContent> => {
    const { data } = await axiosInstance.get<ApiResponse<AdminContent>>('/api/admin');
    return data.data!;
  },

  /**
   * GET /api/admin/users — list all users, ADMIN only.
   */
  getAllUsers: async (): Promise<User[]> => {
    const { data } = await axiosInstance.get<ApiResponse<User[]>>('/api/admin/users');
    return data.data!;
  },
};
