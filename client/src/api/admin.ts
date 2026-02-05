import type { User } from '../types';
import { del, get, put } from './client';

export async function getUsers(): Promise<User[]> {
  const response = await get<{ users: User[] }>('/admin/users');
  return response.users;
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const response = await put<{ user: User }>(`/admin/users/${id}`, data);
  return response.user;
}

export function deleteUser(id: number): Promise<void> {
  return del<void>(`/admin/users/${id}`);
}
