// ─── Domain types ────────────────────────────────────────────────────────────

export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: Role;
}

// ─── API Response shapes ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: Role;
}

// ─── Resource content ────────────────────────────────────────────────────────

export interface PublicContent {
  message: string;
  info: string;
}

export interface UserContent {
  message: string;
  features: string[];
  accessLevel: string;
}

export interface AdminContent {
  message: string;
  permissions: string[];
  accessLevel: string;
  warning: string;
}
