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

export async function getCurrentUser(): Promise<User> {
  const response = await get<{ user: User }>('/auth/me');
  return response.user;
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return post<{ message: string }>('/password/reset', { email });
}

export function resetPassword(
  token: string,
  password: string,
): Promise<{ message: string }> {
  return post<{ message: string }>(`/password/reset/${token}`, { password });
}
