import type { User } from '../types';
import { get, post } from './client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', credentials);
}

export function register(data: RegisterData): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register', data);
}

export function logout(): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/logout');
}

export function getCurrentUser(): Promise<User> {
  return get<User>('/auth/me');
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/forgot-password', { email });
}

export function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  return post<{ message: string }>('/auth/reset-password', { token, password });
}
